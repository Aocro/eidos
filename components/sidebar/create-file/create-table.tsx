import { useState } from "react"

import { useCurrentPathInfo } from "@/hooks/use-current-pathinfo"
import { useGoto } from "@/hooks/use-goto"
import { useSqlite } from "@/hooks/use-sqlite"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import { csvFile2Sql } from "../helper"

export const CreateTable = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void
}) => {
  const [tableName, setTableName] = useState("")
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const params = useCurrentPathInfo()
  const { space } = params
  const { createTable, createTableWithSqlAndInsertSqls } = useSqlite(space)
  const goto = useGoto()

  const handleCreateTable = async () => {
    if (file) {
      const res = await csvFile2Sql(file)
      setImporting(true)
      await createTableWithSqlAndInsertSqls({
        tableId: res.tableId,
        tableName: tableName.trim(),
        createTableSql: res.createTableSql,
        insertSql: res.sqls,
        callback: setProgress,
      })
      setImporting(false)
      goto(space, res.tableId)
      setOpen(false)
    } else {
      const tableId = await createTable(tableName)
      goto(space, tableId)
      setOpen(false)
    }
    setFile(null)
  }

  return (
    <>
      <DialogHeader>
        {/* <DialogTitle>Create Table</DialogTitle> */}
        <DialogDescription>
          {`give your table a name and click create when you're ready`}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            *Name
          </Label>
          <Input
            id="name"
            placeholder="e.g. books"
            className="col-span-3"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Import
          </Label>
          <Input
            id="username"
            className="col-span-3"
            type="file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0])
              }
            }}
          />
        </div>
      </div>
      {importing && <Progress value={progress} />}
      <DialogFooter>
        <Button type="submit" onClick={handleCreateTable}>
          Create
        </Button>
      </DialogFooter>
    </>
  )
}