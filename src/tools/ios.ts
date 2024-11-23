import { tool } from 'ai'
import { z } from 'zod'

export const iosTools = {
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
    execute: async ({ configuration }) => {
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

  startIosApp: tool({
    description: 'Start iOS application on simulator or device',
    parameters: z.object({
      deviceId: z.string().optional(),
      deviceName: z.string().optional(),
      configuration: z.enum(['Debug', 'Release']),
      scheme: z.string().optional(),
      clearData: z.boolean().optional().default(false),
    }),
    execute: async ({ deviceId, deviceName }) => {
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
}
