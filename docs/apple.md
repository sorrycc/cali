# src/tools/apple.ts

## listAppleSimulators
List available simulators
### Parameters
```typescript
z.object({
  platform: z.enum(platforms),
})
```
### Return Type
```typescript
await listAppleDevices(sdkNames)
```
## installRubyGems
Install Ruby gems, including CocoaPods

### Return Type
```typescript
{
  success: true,
}
```
## bootAppleSimulator
Boot iOS simulator. Returns true if the simulator was booted successfully. False otherwise.
### Parameters
```typescript
z.object({
  deviceId: z.string(),
})
```
### Return Type
```typescript
{
  success: true,
  deviceId,
  state: 'Booted',
}
```
```typescript
{
  success: false,
  error: error instanceof Error ? error.message : 'Failed to boot simulator',
  deviceId,
}
```
## buildAppleAppWithoutStarting
Build application for Apple platforms without running it
### Parameters
```typescript
z.object({
  platform: z.enum(platforms),
  configuration: z.enum(['Debug', 'Release']),
  mode: z.string().optional(),
  target: z.string().optional(),
  verbose: z.boolean().optional(),
  scheme: z.string().optional(),
  xcconfig: z.string().optional(),
  buildFolder: z.string().optional(),
  interactive: z.boolean().optional(),
  destination: z.string().optional(),
  extraParams: z.array(z.string()).optional(),
  forcePods: z.boolean().optional(),
  clean: z.boolean().optional().default(false),
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
## buildStartAppleApp
Build and start Apple application on simulator or device
### Parameters
```typescript
z.object({
  platform: z.enum(platforms),
  simulator: z.string().optional(),
  device: z.union([z.string(), z.literal(true)]).optional(),
  udid: z.string().optional(),
  binaryPath: z.string().optional(),
  listDevices: z.boolean().optional(),
  packager: z.boolean().optional(),
  port: z.number(),
  terminal: z.string().optional(),
  clean: z.boolean().optional().default(false),
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
## installPods
Install CocoaPods dependencies
### Parameters
```typescript
z.object({
  platform: z.enum(platforms),
  clean: z.boolean().optional().default(false),
  newArchitecture: z.boolean().optional(),
})
```
### Return Type
```typescript
{
  success: false,
  error: 'Project directory not found',
}
```
```typescript
{
  success: true,
  message: 'Pods installed successfully',
}
```
```typescript
{
  success: false,
  error: error instanceof Error ? error.message : 'Failed to install pods',
}
```
## startAppleLogging
Start Apple gathering logs from simulator or device
### Parameters
```typescript
z.object({
  platform: z.enum(platforms),
  interactive: z.boolean().optional().default(true),
})
```
### Return Type
```typescript
{
  success: true,
}
```
