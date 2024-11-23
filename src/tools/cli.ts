import { tool } from 'ai'
import { z } from 'zod'

export const cliTools = {
  getPlatforms: tool({
    description: 'List platforms for React Native project',
    parameters: z.object({}),
    execute: async () => {
      return ['ios', 'android', 'windows']
    },
  }),

  // Metro Tools
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

  // Device Tools
  listAndroidDevices: tool({
    description: 'List available Android devices and emulators',
    parameters: z.object({}),
    execute: async () => {
      return [
        {
          id: 'emulator-5554',
          name: 'Pixel_4_API_30',
          type: 'emulator',
          os: 'Android 11',
        },
      ]
    },
  }),

  listIosSimulators: tool({
    description: 'List available iOS simulators',
    parameters: z.object({}),
    execute: async () => {
      return [
        {
          id: '123',
          name: 'iPhone 14',
          type: 'simulator',
          os: 'iOS 16.4',
          booted: false,
        },
        {
          id: '456',
          name: 'iPhone 15',
          type: 'simulator',
          os: 'iOS 17.0',
          booted: true,
        },
      ]
    },
  }),

  bootIosSimulator: tool({
    description:
      'Boot iOS simulator. Returns true if the simulator was booted successfully. False otherwise.',
    parameters: z.object({
      deviceId: z.string(),
    }),
    execute: async () => {
      return {
        error: ` Xcode error "Unable to boot the Simulator"`,
      }
    },
  }),

  buildIosApp: tool({
    description: 'Build iOS application',
    parameters: z.object({
      configuration: z.enum(['Debug', 'Release']),
      scheme: z.string().optional(),
      destination: z.string().optional(),
      clean: z.boolean().optional().default(false),
    }),
    execute: async ({ configuration, scheme, destination, clean }) => {
      return {
        success: true,
        buildPath: '/Users/dev/MyApp/ios/build/Build/Products/Debug-iphonesimulator/MyApp.app',
        duration: '45s',
        warnings: 2,
        errors: 0,
        buildNumber: '1.0.0',
        configuration,
      }
    },
  }),

  buildAndroidApp: tool({
    description: 'Build Android application',
    parameters: z.object({
      variant: z.enum(['debug', 'release']),
      clean: z.boolean().optional().default(false),
      flavor: z.string().optional(),
    }),
    execute: async ({ variant, clean, flavor }) => {
      return {
        success: true,
        outputPath: '/Users/dev/MyApp/android/app/build/outputs/apk/debug/app-debug.apk',
        duration: '1m 12s',
        warnings: 1,
        errors: 0,
        versionCode: 1,
        versionName: '1.0.0',
        variant,
      }
    },
  }),

  startIosApp: tool({
    description: 'Start iOS application on simulator or device',
    parameters: z.object({
      deviceId: z.string().optional(),
      deviceName: z.string().optional(),
      configuration: z.enum(['Debug', 'Release']),
      scheme: z.string().optional(),
      clearData: z.boolean().optional().default(false),
    }),
    execute: async ({ deviceId, deviceName, configuration, scheme, clearData }) => {
      return {
        success: true,
        device: {
          id: deviceId || '123-456',
          name: deviceName || 'iPhone 14',
          type: 'simulator',
          os: 'iOS 16.4',
        },
        appState: 'running',
        pid: 12345,
        debugUrl: 'http://localhost:8081/debugger-ui',
        launchTime: '2.3s',
      }
    },
  }),

  startAndroidApp: tool({
    description: 'Start Android application on emulator or device',
    parameters: z.object({
      deviceId: z.string().optional(),
      variant: z.enum(['debug', 'release']),
      clearData: z.boolean().optional().default(false),
      mainActivity: z.string().optional().default('.MainActivity'),
    }),
    execute: async ({ deviceId, variant, clearData, mainActivity }) => {
      return {
        success: true,
        device: {
          id: deviceId || 'emulator-5554',
          name: 'Pixel_4_API_30',
          type: 'emulator',
          os: 'Android 11',
        },
        appState: 'running',
        pid: 23456,
        debugUrl: 'http://localhost:8081/debugger-ui',
        launchTime: '3.1s',
        logcat: {
          pid: 23457,
          command: 'adb logcat -v time',
        },
      }
    },
  }),
}
