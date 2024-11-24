import {
  findDevServerPort,
  getDefaultUserTerminal,
  startServerInNewWindow,
} from '@react-native-community/cli-tools'
import { tool } from 'ai'
import dedent from 'dedent'
import { z } from 'zod'

import { loadReactNativeConfig } from './vendor-rncli'

export const reactNativeTools = {
  startMetro: tool({
    description: 'Start Metro bundler',
    parameters: z.object({
      port: z.number().default(8081),
    }),
    execute: async ({ port }) => {
      try {
        const config = await loadReactNativeConfig()
        const { port: newPort } = await findDevServerPort(port, config.root)
        startServerInNewWindow(
          newPort,
          config.root,
          config.reactNativePath,
          getDefaultUserTerminal()
        )
        return {
          success: true,
        }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to start Metro bundler',
        }
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
