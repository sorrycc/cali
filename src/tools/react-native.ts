import { tool } from 'ai'
import dedent from 'dedent'
import { z } from 'zod'

import { loadReactNativeConfig } from './vendor-rncli'

export const reactNativeTools = {
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

  getReactNativeConfig: tool({
    description: dedent`
      Get React Native configuration. Returns available platforms, Android and iOS project configuration.

      Android project configuration includes:
        - sourceDir
        - appName
        - packageName
        - applicationId
        - mainActivity
        - assets

      iOS project configuration includes:
        - sourceDir
        - xcodeProject
          - name
          - path
          - isWorkspace
        - assets
    `,
    parameters: z.object({}),
    execute: async () => {
      const config = await loadReactNativeConfig()
      return {
        ...config.project,
        platforms: Object.keys(config.project),
      }
    },
  }),
}
