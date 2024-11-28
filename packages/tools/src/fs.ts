import { tool } from 'ai'
import { execSync } from 'child_process'
import fs from 'fs'
import { z } from 'zod'

export const getFileTree = tool({
  description:
    'Get user file tree, can be used to determine the package.json location, package manager, etc.',
  parameters: z.object({
    depth: z.number().optional().default(1),
  }),
  execute: async ({ depth }) => {
    try {
      const output = execSync(`tree -J -I "node_modules|cache|*.pyc" -L ${depth}`, {
        cwd: process.cwd(),
      }).toString()
      const fileTree = JSON.parse(output)

      return {
        success: true,
        fileTree,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'File to get file tree',
      }
    }
  },
})

export const readFile = tool({
  description: 'Read file, can be used to read package.json, etc.',
  parameters: z.object({
    filePath: z.string(),
    encoding: z.enum(['utf8', 'base64']).optional().default('utf8'),
  }),
  execute: async ({ filePath, encoding }) => {
    try {
      const content = fs.readFileSync(filePath, encoding)

      return {
        success: true,
        file: content,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'File to get file tree',
      }
    }
  },
})
