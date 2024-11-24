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
        success: `Metro server started on port ${newPort}.`,
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

export const listReactNativeLibraries = tool({
  description: dedent`
    List React Native libraries from reactnative.directory.
    Can be used to search for libraries by name or category.

    Returns:
      - "name" - library name with stars count, show only this in the list.
      - "description" - library description
      - "npmPackageName" - npm package name to use with "npm install"
      - "score" - library score
      - "url" - library GitHub repository URL
  `,
  parameters: z.object({
    search: z.string().optional(),
  }),
  execute: async ({ search }) => {
    try {
      const response = await fetch(
        `https://reactnative.directory/api/libraries${search ? `?search=${search}` : ''}`
      )
      const { libraries } = await response.json()

      const mappedLibraries = libraries.map((library: any) => ({
        name: `${library.github.name} (★ ${library.github.stats.stars})`,
        description: library.description,
        npmPackageName: library.npmPkg,
        score: library.score,
        url: library.github.urls.repo,
      }))

      return {
        success: true,
        libraries: mappedLibraries,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to start Metro bundler',
      }
    }
  },
})
