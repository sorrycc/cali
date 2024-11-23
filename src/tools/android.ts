import { tool } from 'ai'
import { z } from 'zod'

import {
  build,
  getEmulators,
  getPhoneName,
  getTaskNames,
  tryLaunchAppOnDevice,
  tryLaunchEmulator,
} from './vendor-rncli'
import { adb, getAdbPath, getEmulatorName } from './vendor-rncli'

export const androidTools = {
  getAdbPath: tool({
    description: 'Get path to ADB executable',
    parameters: z.object({}),
    execute: async () => {
      return getAdbPath()
    },
  }),

  listAndroidDevices: tool({
    description: 'List available Android devices and emulators',
    parameters: z.object({
      adbPath: z.string(),
    }),
    execute: async ({ adbPath }) => {
      const devices = adb.getDevices(adbPath).map((device) => ({
        id: device,
        name: device.includes('emulator')
          ? getEmulatorName(adbPath, device)
          : getPhoneName(adbPath, device),
        type: device.includes('emulator') ? 'emulator' : 'device',
        booted: true,
      }))

      const deviceNames = devices.map((device) => device.name)
      const emulators = getEmulators()
        .filter((name) => !deviceNames.includes(name))
        .map((name) => ({
          id: undefined,
          name,
          type: 'emulator',
          booted: false,
        }))

      return [...devices, ...emulators]
    },
  }),

  bootAndroidEmulator: tool({
    description: 'Boot Android emulator',
    parameters: z.object({
      adbPath: z.string(),
      emulatorName: z.string(),
    }),
    execute: async ({ adbPath, emulatorName }) => {
      await tryLaunchEmulator(adbPath, emulatorName)
    },
  }),

  buildAndroidApp: tool({
    description: 'Builds Android application and install it on a given device',
    parameters: z.object({
      deviceId: z.string(),
      metroPort: z.number(),
      sourceDir: z.string(),
      appName: z.string(),
      mode: z.enum(['debug', 'release']),
    }),
    execute: async ({ mode, appName, sourceDir, metroPort }) => {
      // tbd: taks selection
      // tbd: user selection
      // tbd: flavor selection

      const gradleArgs = getTaskNames(appName, mode, [], 'install')
      gradleArgs.push('-x', 'lint', `-PreactNativeDevServerPort=${metroPort}`)

      // tbd: additional CLI flags, such as activeArchOnly

      try {
        build(gradleArgs, sourceDir)
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

  launchAndroidAppOnDevice: tool({
    description: 'Launch Android application on a given device',
    parameters: z.object({
      deviceId: z.string(),
      adbPath: z.string(),
      packageName: z.string(),
      mainActivity: z.string(),
      applicationId: z.string(),
    }),
    execute: async ({ deviceId, adbPath, packageName, mainActivity, applicationId }) => {
      try {
        // @ts-ignore
        tryLaunchAppOnDevice(deviceId, { packageName, mainActivity, applicationId }, adbPath, {
          appId: '',
          appIdSuffix: '',
        })
        return {
          success: true,
        }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to launch app',
        }
      }
    },
  }),
}
