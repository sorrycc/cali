import { tool } from 'ai'
import { execSync } from 'child_process'
import dedent from 'dedent'
import { z } from 'zod'

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
      try {
        const output = execSync('npx react-native config', {
          env: {
            ...process.env,
            NODE_NO_WARNINGS: '1',
          },
          stdio: ['pipe', 'pipe', 'ignore'],
          encoding: 'utf8',
        }).toString()
        const config = JSON.parse(output)
        return {
          ...config.project,
          platforms: Object.keys(config.project),
        }
      } catch (error) {
        return {
          error: `There was an error loading project configuration: ${JSON.stringify(error)}`,
        }
      }
    },
  }),
}
