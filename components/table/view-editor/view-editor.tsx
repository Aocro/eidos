import { startTransition, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useClickAway } from "ahooks"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslation } from "react-i18next"

import { IView, ViewTypeEnum } from "@/lib/store/IView"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

import { Button } from "../../ui/button"
import { useViewOperation } from "../hooks"
import { useViewCount } from "../hooks/use-view-count"
import { ViewIconMap } from "../view-item"
import { ViewLayout } from "./view-layout"

const formSchema = z.object({
  name: z.string(),
  type: z.string(),
  query: z.string().optional(),
})

interface IViewEditorProps {
  setEditDialogOpen: (open: boolean) => void
  view: IView
}

const LIMIT_ROWS_FOR_OPTIMIZE_VIEW = 88888

export const ViewEditor = ({ setEditDialogOpen, view }: IViewEditorProps) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { updateView } = useViewOperation()
  const { count, loading } = useViewCount(view)

  const disabled = loading || count > LIMIT_ROWS_FOR_OPTIMIZE_VIEW

  useClickAway(
    (e) => {
      setEditDialogOpen(false)
    },
    [ref],
    ["mousedown", "touchstart"]
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: view.name,
      type: view.type,
      query: view.query || `SELECT * from tb_${view.table_id};`,
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateView(view.id, {
      query: values.query,
      name: values.name,
    })
  }

  const handleChangeViewType = (type: ViewTypeEnum) => {
    startTransition(() => {
      updateView(view.id, { type })
    })
  }

  return (
    <div
      className="absolute right-0 top-0 z-10 h-full w-[400px] overflow-hidden bg-white p-3 shadow-lg dark:bg-slate-950"
      ref={ref}
      id="view-editor"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.name')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.fieldType')}</FormLabel>
                <FormDescription>
                  {t('table.view.typeDescription')}
                </FormDescription>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <ViewLayout
                      onClick={() => {
                        field.onChange("grid")
                        handleChangeViewType(ViewTypeEnum.Grid)
                      }}
                      viewId={view.id}
                      isActive={field.value === "grid"}
                      title={t('table.view.grid')}
                      viewType={ViewTypeEnum.Grid}
                      icon={ViewIconMap[ViewTypeEnum.Grid]}
                    ></ViewLayout>
                    <ViewLayout
                      onClick={() => {
                        field.onChange("gallery")
                        handleChangeViewType(ViewTypeEnum.Gallery)
                      }}
                      disabled={disabled}
                      viewId={view.id}
                      isActive={field.value === "gallery"}
                      title={t('table.view.gallery')}
                      viewType={ViewTypeEnum.Gallery}
                      icon={ViewIconMap[ViewTypeEnum.Gallery]}
                    ></ViewLayout>
                    <ViewLayout
                      viewId={view.id}
                      onClick={() => {
                        field.onChange("doc_list")
                        handleChangeViewType(ViewTypeEnum.DocList)
                      }}
                      disabled={disabled}
                      isActive={field.value === "doc_list"}
                      title={t('table.view.docList')}
                      viewType={ViewTypeEnum.DocList}
                      icon={ViewIconMap[ViewTypeEnum.DocList]}
                    ></ViewLayout>
                    {disabled && (
                      <p className="text-sm  text-muted-foreground">
                        {t('table.view.disabledViewTypesWarning')}
                      </p>
                    )}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.view.query')}</FormLabel>
                <FormDescription>
                  {t('table.view.queryDescription')}
                </FormDescription>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t('common.update')}</Button>
        </form>
      </Form>
    </div>
  )
}
