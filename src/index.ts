import { openai } from '@ai-sdk/openai'
import { confirm, intro, log, select, spinner, text } from '@clack/prompts'
import { CoreMessage, generateText } from 'ai'
import chalk from 'chalk'
import { z } from 'zod'

import { cliTools } from './tools/cli'
import { retro } from 'gradient-string'

const MessageSchema = z.union([
  z.object({ type: z.literal('select'), content: z.string(), options: z.array(z.string()) }),
  z.object({ type: z.literal('question'), content: z.string() }),
  z.object({ type: z.literal('confirmation'), content: z.string() }),
  z.object({ type: z.literal('end'), content: z.string() }),
])

console.clear()

intro(`${retro(`
██████╗ ██╗      █████╗ ██╗
██╔══██╗██║     ██╔══██╗██║
██║  ╚═╝██║     ███████║██║
██║  ██╗██║     ██╔══██║██║
██████╔╝███████╗██║  ██║██║
╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝
`)}

${chalk.gray(`AI agent for building React Native apps.\nPowered by: ${chalk.bold('Vercel AI SDK')} & ${chalk.bold('React Native CLI')}`)}`)

const question = (await text({
  message: 'What do you want to do today?',
})) as string

const messages: CoreMessage[] = [
  {
    role: 'system',
    content: 'What do you want to do today?',
  },
  {
    role: 'user',
    content: question,
  },
]

const s = spinner()

// eslint-disable-next-line no-constant-condition
while (true) {
  s.start(chalk.gray('Thinking...'))

  const response = await generateText({
    model: openai('gpt-4o'),
    // tbd: change prompt based on project
    system: `
      ROLE:
        You are a React Native developer tasked with building and shipping a React Native app.

      RULES:
        Ask one clear and concise question at a time.
        If you need more information, ask a follow-up question.
        Use tools to gather information about the project.
        Always ask the user to choose when multiple options are available from the tool.
        If tools require parameters, ask the user to provide them explicitly.
        Never assume or make up arguments for a tool unless the user has explicitly provided them.
        If a parameter is required but not provided, you must ask the user to specify it before proceeding.

      WORKFLOW RULES:
        You must run a tool to list available platforms.
        Never build or run for multiple platforms simultaneously.
        If user selects "Debug" mode, always start Metro bundler using "startMetro" tool.

      ERROR HANDLING:
        - If a tool call returns an error, you must explain the error to the user and ask user if they want to try again:
          {
            "type": "confirmation",
            "content": "<error explanation and retry question>"
          }
        - If you have tools to fix the error, ask user to select one of them:
          {
            "type": "select",
            "content": "<error explanation and tool selection question>",
            "options": ["<option1>", "<option2>", "<option3>"]
          }
        
        MANUAL RESOLUTION:
          - If you do not have tools to fix the error, you must ask a Yes/No question with manual steps as content:
            {
              "type": "confirmation",
              "content": "<error explanation and manual steps>"
            }

          - If user confirms, you must re-run the same tool.
          - Never ask user to perform the action manually. Instead, ask user to fix the error, so you can run the tool again.
          - If single tool fails more than 3 times, proceed with NEXT TASK.

      RESPONSE FORMAT:
        - Your response must be a valid JSON object.
        - Your response must not contain any other text.

      RESPONSE TYPES:
        - If the question is a question that involves choosing from a list of options, you must return:
          {
            "type": "select",
            "content": "<question>",
            "options": ["<option1>", "<option2>", "<option3>"]
          }
        - If the question is a Yes/No question, you must return:
          {
            "type": "confirmation",
            "content": "<question>"
          }
        - When you finish processing user task, you must ask user a confirmation if they want to continue with another task:
          {
            "type": "confirmation",
            "content": "<question>"
          }
        - If user does not want to continue, you must return "end" type.
          {
            "type": "end",
            "content": "<result>"
          } 
    `,
    // tbd: set tools based on project, platform, and question
    tools: cliTools,
    maxSteps: 10,
    messages,
    onStepFinish(event) {
      if (event.stepType === 'initial') {
        s.message(
          `Executing: ${chalk.gray(event.toolCalls.map((toolCall) => toolCall.toolName).join(', '))}`
        )
      }
    },
  })

  const toolCalls = response.steps.flatMap((step) =>
    step.toolCalls.map((toolCall) => toolCall.toolName)
  )

  if (toolCalls.length > 0) {
    s.stop(`Tools called: ${chalk.gray(toolCalls.join(', '))})`)
  } else {
    s.stop(chalk.gray('Done.'))
  }

  for (const step of response.steps) {
    if (step.text.length > 0) {
      messages.push({ role: 'assistant', content: step.text })
    }
    if (step.toolCalls.length > 0) {
      messages.push({ role: 'assistant', content: step.toolCalls })
    }
    if (step.toolResults.length > 0) {
      // tbd: fix this upstream. for some reason, the tool does not include the type,
      // against the spec.
      for (const toolResult of step.toolResults) {
        if (!toolResult.type) {
          toolResult.type = 'tool-result'
        }
      }
      messages.push({ role: 'tool', content: step.toolResults })
    }
  }

  // tbd: handle parsing errors
  const data = MessageSchema.parse(JSON.parse(response.text))

  const answer = await (() => {
    switch (data.type) {
      case 'select':
        return select({
          message: data.content,
          options: data.options.map((option) => ({ value: option, label: option })),
        })
      case 'question':
        return text({ message: data.content })
      case 'confirmation': {
        return confirm({ message: data.content }).then((answer) => {
          return answer ? 'yes' : 'no'
        })
      }
      case 'end':
        log.step(data.content)
    }
  })()

  if (typeof answer !== 'string') {
    break
  }

  messages.push({
    role: 'user',
    content: answer as string,
  })
}
