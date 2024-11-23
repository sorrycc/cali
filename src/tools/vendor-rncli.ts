/**
 * This file re-exports private internals from the RN CLI, or copies some of the private functions.
 * In the future, we should export these functions from the RN CLI package.
 */
import { execSync } from 'child_process'
import { EOL } from 'os'

export { default as adb } from '@react-native-community/cli-platform-android/build/commands/runAndroid/adb'
export { default as getAdbPath } from '@react-native-community/cli-platform-android/build/commands/runAndroid/getAdbPath'
export {
  getEmulators,
  default as tryLaunchEmulator,
} from '@react-native-community/cli-platform-android/build/commands/runAndroid/tryLaunchEmulator'

export function getEmulatorName(adbPath: string, deviceId: string) {
  const buffer = execSync(`${adbPath} -s ${deviceId} emu avd name`)
  return buffer
    .toString()
    .split(EOL)[0]
    .replace(/(\r\n|\n|\r)/gm, '')
    .trim()
}

export function getPhoneName(adbPath: string, deviceId: string) {
  const buffer = execSync(`${adbPath} -s ${deviceId} shell getprop | grep ro.product.model`)
  return buffer
    .toString()
    .replace(/\[ro\.product\.model\]:\s*\[(.*)\]/, '$1')
    .trim()
}

export { build } from '@react-native-community/cli-platform-android/build/commands/buildAndroid'
export { getTaskNames } from '@react-native-community/cli-platform-android/build/commands/runAndroid/getTaskNames'
