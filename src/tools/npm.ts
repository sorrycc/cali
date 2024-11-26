import { tool } from 'ai'
import { z } from 'zod'
import { execSync } from 'child_process'

import { install, installDev, uninstall } from './vendor-rncli'

export const installNpmPackage = tool({
  description: 'Install a package from npm by name',
  parameters: z.object({
    packageNames: z.array(z.string()),
    packageManager: z.enum(['yarn', 'npm', 'bun']).optional(),
    dev: z.boolean().optional(),
  }),
  execute: async ({ packageNames, packageManager, dev }) => {
    try {
      const params = {
        packageManager: packageManager || 'npm',
        root: process.cwd(),
      }
      if (dev) {
        await installDev(packageNames, params)
      } else {
        await install(packageNames, params)
      }
      return {
        success: true,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to install package',
      }
    }
  },
})

export const unInstallNpmPackage = tool({
  description: 'Uninstall a package from npm by name',
  parameters: z.object({
    packageNames: z.array(z.string()),
    packageManager: z.enum(['yarn', 'npm', 'bun']).optional(),
  }),
  execute: async ({ packageNames, packageManager }) => {
    try {
      const params = {
        packageManager: packageManager || 'npm',
        root: process.cwd(),
      }
      await uninstall(packageNames, params)
      return {
        success: true,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to install package',
      }
    }
  },
})


export const getFileTree = tool({
  description: 'Get user file tree, can be used to determine the package.json location, package manager, etc.',
  parameters: z.object({
    depth: z.number().optional().default(1),
  }),
  execute: async ({depth}) => {
    try {
      const output = execSync(`tree -J -L ${depth}`, {
        cwd: process.cwd(),
      }).toString() 
      const fileTree = JSON.parse(output)

      return {
        success: true,
        fileTree
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'File to get file tree',
      }
    }
  },
})
