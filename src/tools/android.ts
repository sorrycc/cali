import { tool } from 'ai'
import dedent from 'dedent'
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
    description: 'Returns path to ADB executable',
    parameters: z.object({}),
    execute: async () => {
      return getAdbPath()
    },
  }),

  getAndroidDevices: tool({
    description: dedent`
      Gets available Android devices and emulators.

      Returns an array of devices:
        - "id" - device ID
        - "name" - device name
        - "type" - device type ("device" or "emulator")
        - "booted" - whether the device is booted
    `,
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
    description: 'Boots a given Android emulator and returns its ID',
    parameters: z.object({
      adbPath: z.string(),
      androidDevice_name: z.string(),
    }),
    execute: async ({ adbPath, androidDevice_name: emulatorName }) => {
      try {
        await tryLaunchEmulator(adbPath, emulatorName)
        return {
          success: true,
          action: `Device booted. Re-run "getAndroidDevices" to verify ${emulatorName} is in the list, with "booted" set to true.`,
        }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to boot emulator',
        }
      }
    },
  }),

  buildAndroidApp: tool({
    description: 'Builds Android application and install it on a given device',
    parameters: z.object({
      androidDevice_id: z.string(),
      metroPort: z.number(),
      reactNativeConfig_android_sourceDir: z.string(),
      reactNativeConfig_android_appName: z.string(),
      mode: z.enum(['debug', 'release']),
    }),
    execute: async ({
      mode,
      reactNativeConfig_android_appName: appName,
      reactNativeConfig_android_sourceDir: sourceDir,
      metroPort,
    }) => {
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
    description: 'Launches a given Android application on a specified device',
    parameters: z.object({
      androidDevice_id: z.string(),
      adbPath: z.string(),
      reactNativeConfig_android_packageName: z.string(),
      reactNativeConfig_android_mainActivity: z.string(),
      reactNativeConfig_android_applicationId: z.string(),
    }),
    execute: async ({
      androidDevice_id: deviceId,
      adbPath,
      reactNativeConfig_android_packageName: packageName,
      reactNativeConfig_android_mainActivity: mainActivity,
      reactNativeConfig_android_applicationId: applicationId,
    }) => {
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
