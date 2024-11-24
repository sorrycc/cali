# src/tools/react-native.ts

## startMetroDevServer
Starts Metro development server on a given port or a different available port.
Returns port Metro server started on.
### Parameters
```typescript
z.object({
  port: z.number().default(8081),
  reactNativeConfig_root: z.string(),
  reactNativeConfig_reactNativePath: z.string(),
})
```
### Return Type
```typescript
{
  success: true,
  port: newPort,
}
```
```typescript
{
  error: error instanceof Error ? error.message : 'Failed to start Metro bundler',
}
```
## getReactNativeConfig
Get React Native configuration. 

Returns:
  - "root" - root directory of the project
  - "path" - path to React Native CLI installation
  - "version" - React Native version
  - "platforms" - available platforms
  - "project" - project configuration per platform

Apple project configuration:
  - "sourceDir" - iOS source directory
  - "xcodeProject" - Xcode project configuration
    - "name" - iOS project name
    - "path" - path to the Xcode project
    - "isWorkspace" - whether the project is a workspace
  - "assets" - iOS assets

Android project configuration:
  - "sourceDir" - Android source directory
  - "appName" - Android app name
  - "packageName" - Android package name
  - "applicationId" - Android application ID
  - "mainActivity" - Android main activity
  - "assets" - Android assets

### Return Type
```typescript
{
  root,
  path,
  version,
  project,
  platforms,
}
```
