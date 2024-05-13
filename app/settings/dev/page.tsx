import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { useConfigStore } from "../store"
import { saveTransformerCache } from "./helper"

export function DevtoolsPage() {
  const { aiConfig, setAiConfig } = useConfigStore()

  const clearLocalModels = () => {
    setAiConfig({
      ...aiConfig,
      localModels: [],
    })
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Devtools</h3>
        <p className="text-sm text-muted-foreground">
          some tools for development{" "}
        </p>
        <span className=" text-red-500"> use it with caution.</span>
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Save transformer.js cache </CardTitle>
            <CardDescription>
              <p>
                Save transformer.js cache to <code>/static/transformers/</code>
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t px-6 py-4">
            <Button className="w-[200px]" onClick={saveTransformerCache}>
              Save
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clear local LLMs </CardTitle>
            <CardDescription>
              <p>
                just set local models to empty array, don't remove the cache
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t px-6 py-4">
            <Button className="w-[200px]" onClick={clearLocalModels}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}