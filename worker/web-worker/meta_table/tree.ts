import { TreeTableName } from "@/lib/sqlite/const"
import { getRawTableNameById } from "@/lib/utils"

import { ITreeNode } from "../../../lib/store/ITreeNode"
import { BaseTable, BaseTableImpl } from "./base"

export class TreeTable extends BaseTableImpl implements BaseTable<ITreeNode> {
  name = TreeTableName
  createTableSql = `
  CREATE TABLE IF NOT EXISTS ${TreeTableName} (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    parent_id TEXT NULL,
    is_pinned BOOLEAN DEFAULT 0,
    icon TEXT NULL,
    cover TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `

  add(data: ITreeNode): Promise<ITreeNode> {
    this.dataSpace.exec(
      `INSERT INTO ${TreeTableName} (id,name,type,parent_id) VALUES (? , ? , ? , ?);`,
      [data.id, data.name, data.type, data.parent_id]
    )
    return Promise.resolve(data)
  }

  async get(id: string): Promise<ITreeNode | null> {
    const res = await this.dataSpace.exec2(
      `SELECT * FROM ${TreeTableName} where id = ?;`,
      [id]
    )
    if (res.length === 0) {
      return null
    }
    return res[0] as ITreeNode
  }

  async updateName(id: string, name: string): Promise<boolean> {
    try {
      await this.dataSpace.exec2(
        `UPDATE ${TreeTableName} SET name = ? WHERE id = ?;`,
        [name, id]
      )
      return Promise.resolve(true)
    } catch (error) {
      return Promise.resolve(false)
    }
  }

  async pin(id: string, is_pinned: boolean): Promise<boolean> {
    await this.dataSpace.exec2(
      `UPDATE ${TreeTableName} SET is_pinned = ? WHERE id = ?;`,
      [is_pinned, id]
    )
    return Promise.resolve(true)
  }

  async del(id: string): Promise<boolean> {
    await this.dataSpace.sql`DELETE FROM ${Symbol(
      TreeTableName
    )} WHERE id = ${id}`
    return true
  }

  // @deprecated Proxy can't pass to main thread
  makeProxyRow(row: any): ITreeNode {
    const dataSpace = this.dataSpace
    return new Proxy(row, {
      get(target, p, receiver) {
        if (p === "children") {
          return []
        }
        return Reflect.get(target, p, receiver)
      },
      set(target, p: string, value, receiver) {
        dataSpace.exec(`UPDATE ${TreeTableName} SET ${p} = ? WHERE id = ?;`, [
          value,
          target.id,
        ])
        return Reflect.set(target, p, value, receiver)
      },
    })
  }

  async list(qs: {
    query?: string
    withSubNode?: boolean
  }): Promise<ITreeNode[]> {
    const { query, withSubNode } = qs
    let sql = `SELECT * FROM ${TreeTableName} `
    if (query) {
      sql += ` WHERE name like ?`
    }
    if (query && !withSubNode) {
      sql += ` AND parent_id is null;`
    }
    const bind = query ? [`%${query}%`] : undefined
    const res = await this.dataSpace.exec2(sql, bind)
    return res.map((row) => row)
  }

  async moveIntoTable(id: string, tableId: string): Promise<boolean> {
    try {
      await this.dataSpace.withTransaction(async () => {
        // update parent_id
        await this.dataSpace.exec2(
          `UPDATE ${TreeTableName} SET parent_id = ? WHERE id = ?;`,
          [tableId, id]
        )
        // add new row in table
        // row. _id = nodeId
        const tableName = getRawTableNameById(tableId)
        const title = (await this.get(id))?.name
        await this.dataSpace.exec2(
          `INSERT INTO ${tableName} (_id,title) VALUES (?,?);`,
          [id, title]
        )
      })
      return Promise.resolve(true)
    } catch (error) {
      return Promise.resolve(false)
    }
  }
}
