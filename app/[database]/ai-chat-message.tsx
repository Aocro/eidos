import { Bot, Trash2, User } from "lucide-react"
import { ChatCompletionResponseMessage } from "openai"

import { AIMessage } from "./ai-chat-message-prisma"

export const AIChatMessage = ({
  message,
  msgIndex,
  handleRunCode,
}: {
  msgIndex: number
  message: ChatCompletionResponseMessage
  handleRunCode: any
}) => {
  return (
    <div
      className="group relative flex w-full items-start gap-2 rounded-lg bg-gray-200 p-2 dark:bg-gray-700"
      key={msgIndex}
    >
      {message.role === "assistant" && (
        <>
          <Bot className="h-4 w-4 shrink-0" />
          <AIMessage
            message={message.content}
            onRun={handleRunCode}
            msgIndex={msgIndex}
          />
        </>
      )}
      {message.role === "user" && (
        <>
          <User className="h-4 w-4 shrink-0" />
          <p className="grow">{message.content}</p>
        </>
      )}
      {/* <Trash2
        className="absolute right-0.5 top-0.5 hidden h-4 w-4 cursor-pointer group-hover:block"
      /> */}
    </div>
  )
}