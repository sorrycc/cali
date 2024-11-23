import { tool } from 'ai'
import { execSync } from 'child_process'
import { z } from 'zod'

import type { ApplePlatform } from './vendor-rncli'
import {
  createAppleBuild,
  createAppleRun,
  createLogCommand,
  getPlatformInfo,
  listAppleDevices,
  loadReactNativeConfig,
} from './vendor-rncli'

const platforms = ['ios', 'tvos', 'visionos'] as const

export const iosTools = {
  listAppleSimulators: tool({
    description: 'List available simulators',
    parameters: z.object({
      platform: z.enum(platforms),
    }),
    execute: async ({ platform }) => {
      const sdkNames = getPlatformInfo(platform as ApplePlatform).sdkNames
      return await listAppleDevices(sdkNames)
    },
  }),

  bootAppleSimulator: tool({
    description:
      'Boot iOS simulator. Returns true if the simulator was booted successfully. False otherwise.',
    parameters: z.object({
      deviceId: z.string(),
    }),
    execute: async ({ deviceId }) => {
      try {
        execSync(`xcrun simctl boot ${deviceId}`, { stdio: 'inherit' })
        return {
          success: true,
          deviceId,
          state: 'Booted',
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to boot simulator',
          deviceId,
        }
      }
    },
  }),

  buildAppleApp: tool({
    description: 'Build iOS application',
    parameters: z.object({
      platform: z.enum(platforms),
      configuration: z.enum(['Debug', 'Release']),
      mode: z.string().optional(),
      target: z.string().optional(),
      verbose: z.boolean().optional(),
      scheme: z.string().optional(),
      xcconfig: z.string().optional(),
      buildFolder: z.string().optional(),
      interactive: z.boolean().optional(),
      destination: z.string().optional(),
      extraParams: z.array(z.string()).optional(),
      forcePods: z.boolean().optional(),
      clean: z.boolean().optional().default(false),
    }),
    execute: async ({ platform, ...params }) => {
      const config = await loadReactNativeConfig()
      const build = createAppleBuild({ platformName: platform })
      try {
        await build([], config, params)
        return {
          success: true,
        }
      } catch (error) {
        return {
          error: JSON.stringify(error),
        }
      }
    },
  }),

  startAppleApp: tool({
    description: 'Start Apple application on simulator or device',
    parameters: z.object({
      platform: z.enum(platforms),
      simulator: z.string().optional(),
      device: z.union([z.string(), z.literal(true)]).optional(),
      udid: z.string().optional(),
      binaryPath: z.string().optional(),
      listDevices: z.boolean().optional(),
      packager: z.boolean().optional(),
      port: z.number(),
      terminal: z.string().optional(),
      clean: z.boolean().optional().default(false),
    }),
    execute: async ({ platform, ...params }) => {
      const config = await loadReactNativeConfig()
      const run = createAppleRun({ platformName: platform })

      try {
        await run([], config, params)
        return {
          success: true,
        }
      } catch (error) {
        return {
          error: JSON.stringify(error),
        }
      }
    },
  }),

  installPods: tool({
    description: 'Install CocoaPods dependencies',
    parameters: z.object({
      newArchitecture: z.boolean().optional(),
    }),
    execute: async ({ newArchitecture }) => {
      try {
        const config = await loadReactNativeConfig()
        const iosDirectory = config.project.ios?.sourceDir ?? 'ios'

        const commands = ['bundle exec pod install']

        for (const command of commands) {
          execSync(command, {
            cwd: iosDirectory,
            stdio: 'inherit',
            env: {
              ...process.env,
              ...(newArchitecture ? { RCT_NEW_ARCH_ENABLED: '1' } : {}),
            },
          })
        }

        return {
          success: true,
          message: 'Pods installed successfully',
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to install pods',
        }
      }
    },
  }),

  startAppleLogging: tool({
    description: 'Start Apple gathering logs from simulator or device',
    parameters: z.object({
      platform: z.enum(platforms),
      interactive: z.boolean().optional().default(true),
    }),
    execute: async ({ platform, ...params }) => {
      const config = await loadReactNativeConfig()
      const log = createLogCommand({ platformName: platform })
      await log([], config, params)
      return {
        success: true,
      }
    },
  }),
}
