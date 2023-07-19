/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { DRAG_DROP_PASTE } from "@lexical/rich-text"
import { isMimeType } from "@lexical/utils"
import { COMMAND_PRIORITY_LOW } from "lexical"

import { uploadFile2OPFS } from "@/lib/opfs"
import { useCurrentPathInfo } from "@/hooks/use-current-pathinfo"

import { INSERT_IMAGE_COMMAND } from "../ImagesPlugin"

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
]

export default function DragDropPaste(): null {
  const [editor] = useLexicalComposerContext()
  // should not be here, but we need to make sure the space is set
  const { space } = useCurrentPathInfo()
  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        ;(async () => {
          const filesResult = await Promise.all(
            files.map(async (file) => {
              const fileUrl = await uploadFile2OPFS(file, space)
              return {
                file,
                result: fileUrl,
              }
            })
          )
          for (const { file, result } of filesResult) {
            if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: file.name,
                src: result,
              })
            }
          }
        })()
        return true
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor, space])
  return null
}