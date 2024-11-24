# Tools

While there are no constraints on how to structure your tools, we follow a few conventions to make it easier for the agent to understand and use them:

### Explicit names

### Return Type (Success/Error)

For tools that perform actions:

#### Success

Tools should return an object with `success` property set to `true` to indicate a successful execution, or a string with a success message. This is useful to indicate additional information that might be helpful for the agent to know.

You may attach `action` property to the response object to provide a follow-up action that the agent should take.

#### Error

If a tool encounters an error, it should return an object with `error` property set to a string that describes the error.

For tools that return information:

#### Success

Tools should return an object with information. 

#### Error

If a tool encounters an error, it should return an object with `error` property set to a string that describes the error. This is similar to the error object returned from actions.
