import { tool } from 'ai'
import { z } from 'zod'

export const reactNativeTools = {
  getPlatforms: tool({
    description: 'List platforms that this React Native project supports',
    parameters: z.object({}),
    execute: async () => {
      return ['ios', 'android', 'windows']
    },
  }),

  startMetro: tool({
    description: 'Start Metro bundler',
    parameters: z.object({}),
    execute: async () => {
      return {
        port: 3000,
        debuggerUrl: null,
      }
    },
  }),
}
