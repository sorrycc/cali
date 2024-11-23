import { tool } from 'ai'
import { z } from 'zod'

import { build, getEmulators, getPhoneName, getTaskNames, tryLaunchEmulator } from './vendor-rncli'
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
    description: 'Builds Android application',
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

      // tbd: build

      const gradleArgs = getTaskNames(appName, mode, [], 'install')
      gradleArgs.push('-x', 'lint', `-PreactNativeDevServerPort=${metroPort}`)

      // tbd: activeArchOnly

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

  // installAndroidApp: tool({
  //   description: 'Installs Android application on device or emulator',
  //   parameters: z.object({}),
  //   execute: async () => {},
  // }),

  // startAndroidApp: tool({
  //   description: 'Start Android application on emulator or device',
  //   parameters: z.object({
  //     deviceId: z.string().optional(),
  //     variant: z.enum(['debug', 'release']),
  //     clearData: z.boolean().optional().default(false),
  //     mainActivity: z.string().optional().default('.MainActivity'),
  //   }),
  //   execute: async ({ deviceId, variant, clearData, mainActivity }) => {
  //     return {
  //       success: true,
  //       device: {
  //         id: deviceId || 'emulator-5554',
  //         name: 'Pixel_4_API_30',
  //         type: 'emulator',
  //         os: 'Android 11',
  //       },
  //       appState: 'running',
  //       pid: 23456,
  //       debugUrl: 'http://localhost:8081/debugger-ui',
  //       launchTime: '3.1s',
  //       logcat: {
  //         pid: 23457,
  //         command: 'adb logcat -v time',
  //       },
  //     }
  //   },
  // }),
}
