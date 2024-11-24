# Tools

While there are no constraints on how to structure your tools, we follow a few conventions to make it easier for the agent to understand and use them:

## Explicit names

Tools should have explicit names that describe what they do. For example, `getAppleSimulators` is better than `listSimulators`.

## Explicit parameters

Tools should have explicit parameters that describe what they need to do their job. If tool `A` needs return value of tool `B`, it should use `B` in parameter name. For example, `runAppleBuild` needs `reactNativeConfig` property, so it should use `reactNativeConfig_<value_needed>` as a parameter.

### Getters

#### Return Type

**Success**

Tools should return an object with information. 

**Error**

If a tool encounters an error, it should return an object with `error` property set to a string that describes the error. It can also return an `action` if there is a follow-up action that the agent should take to recover. If not specified, the agent will try to decide what to do next.

### Actions

#### Return Type

**Success**

Tools should return an object with `success` property set to `true` to indicate a successful execution, or a string with a success message. This is useful to indicate additional information that might be helpful for the agent to know.

You may attach `action` property to the response object to provide a follow-up action that the agent should take.

**Error**

Same as for getters.

