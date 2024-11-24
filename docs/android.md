# src/tools/android.ts

## getAdbPath
Returns path to ADB executable

### Return Type
```typescript
getAdbPathString()
```
## getAndroidDevices
Gets available Android devices and emulators.

Returns an array of devices:
  - "id" - device ID
  - "name" - device name
  - "type" - device type ("device" or "emulator")
  - "booted" - whether the device is booted
### Parameters
```typescript
z.object({
  adbPath: z.string(),
})
```
### Return Type
```typescript
[...devices, ...emulators]
```
## bootAndroidEmulator
Boots a given Android emulator and returns its ID
### Parameters
```typescript
z.object({
  adbPath: z.string(),
  androidDevice_name: z.string(),
})
```
### Return Type
```typescript
{
  success: true,
  action: `Device booted. Re-run "getAndroidDevices" to verify ${emulatorName} is in the list, with "booted" set to true.`,
}
```
```typescript
{
  error: error instanceof Error ? error.message : 'Failed to boot emulator',
}
```
## buildAndroidApp
Builds Android application and install it on a given device
### Parameters
```typescript
z.object({
  androidDevice_id: z.string(),
  metroPort: z.number(),
  reactNativeConfig_android_sourceDir: z.string(),
  reactNativeConfig_android_appName: z.string(),
  mode: z.enum(['debug', 'release']),
})
```
### Return Type
```typescript
{
  success: true,
}
```
```typescript
{
  error: JSON.stringify(error),
}
```
## runAdbReverse
Runs "adb reverse" to forward given port to a specified Android device
### Parameters
```typescript
z.object({
  androidDevice_id: z.string(),
  port: z.number(),
})
```
### Return Type
```typescript
{
  success: true,
}
```
```typescript
{
  error:
  error instanceof Error
  ? error.message
  : 'Failed to run "adb reverse". Port is not forwared.',
}
```
## launchAndroidAppOnDevice
Launches a given Android application on a specified device
### Parameters
```typescript
z.object({
  androidDevice_id: z.string(),
  adbPath: z.string(),
  reactNativeConfig_android_packageName: z.string(),
  reactNativeConfig_android_mainActivity: z.string(),
  reactNativeConfig_android_applicationId: z.string(),
  didForwardMetroPortToDevice: z.boolean(),
})
```
### Return Type
```typescript
{
  error: 'Port is not forwarded to device.',
  action: 'Run "runAdbReverse" to forward port to device and try again.',
}
```
```typescript
{
  success: true,
}
```
```typescript
{
  error: error instanceof Error ? error.message : 'Failed to launch app',
}
```
