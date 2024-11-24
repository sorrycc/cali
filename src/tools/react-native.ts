import {
  findDevServerPort,
  getDefaultUserTerminal,
  startServerInNewWindow,
} from '@react-native-community/cli-tools'
import { tool } from 'ai'
import dedent from 'dedent'
import { z } from 'zod'

import { loadReactNativeConfig } from './vendor-rncli'

export const startMetroDevServer = tool({
  description: dedent`
    Starts Metro development server on a given port or a different available port.
    Returns port Metro server started on.
  `,
  parameters: z.object({
    port: z.number().default(8081),
    reactNativeConfig_root: z.string(),
    reactNativeConfig_reactNativePath: z.string(),
  }),
  execute: async ({
    port,
    reactNativeConfig_root: root,
    reactNativeConfig_reactNativePath: reactNativePath,
  }) => {
    try {
      const { port: newPort } = await findDevServerPort(port, root)
      startServerInNewWindow(newPort, root, reactNativePath, getDefaultUserTerminal())
      return {
        success: true,
        port: newPort,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to start Metro bundler',
      }
    }
  },
})

export const getReactNativeConfig = tool({
  description: dedent`
    Get React Native configuration. 
    
    Returns:
      - "root" - root directory of the project
      - "path" - path to React Native CLI installation
      - "version" - React Native version
      - "platforms" - available platforms
      - "project" - project configuration per platform

    Apple project configuration:
      - "sourceDir" - iOS source directory
      - "xcodeProject" - Xcode project configuration
        - "name" - iOS project name
        - "path" - path to the Xcode project
        - "isWorkspace" - whether the project is a workspace
      - "assets" - iOS assets

    Android project configuration:
      - "sourceDir" - Android source directory
      - "appName" - Android app name
      - "packageName" - Android package name
      - "applicationId" - Android application ID
      - "mainActivity" - Android main activity
      - "assets" - Android assets
  `,
  parameters: z.object({}),
  execute: async () => {
    const {
      root,
      reactNativePath: path,
      reactNativeVersion: version,
      project,
      platforms,
    } = await loadReactNativeConfig()
    return {
      root,
      path,
      version,
      project,
      platforms,
    }
  },
})
