<div align="center">
  <h1>cali</h1>
</div>

<p align="center">
  <img src="./assets/terminal.png" width="500" />
</p>

<p align="center">
  🪄 An AI agent for building React Native apps 
</p>

---

```bash
$ npx cali
```

## Wait, what?

Cali is an AI agent that helps you build React Native apps. It takes all the utilities and functions of a React Native CLI and exposes them as tools to an LLM.

Thanks to that, an LLM can help you with your React Native app development, without the need to remember commands, spending time troubleshooting errors, and in the future, much more.

Under the hood, it uses [Vercel AI SDK](https://github.com/ai-sdk/ai) and [@react-native-community/cli](https://github.com/react-native-community/cli).

The default model is `gpt-4o`.

> [!NOTE]
> You can change the default model by setting `AI_MODEL` env variable. We are currently
evaluating how different models perform, so we might change the default model in the future.

## Prerequisites

In order to use Cali, you need to have an OpenAI API key. You can get one [here](https://platform.openai.com/api-keys).

Once you have your key, you can set it as `OPENAI_API_KEY` env variable (either create a dotenv file or set it inline).

## Features

[TBD]

## Usage

Under the hood, Cali uses Vercel AI SDK. That means you can import all its tools into your existing project and use them for different purposes, without our interactive chat interface.

```ts
// import all tools
import { reactNativeTools, androidTools, iosTools } from "cali";

// use them in your project
import { generateText } from "ai";
await generateText({
  // other options
  tools: {
    ...reactNativeTools,
    ...androidTools,
    ...iosTools,
  },
});
```

## Future requests

I like the idea of an AI agent for building React Native apps. I would like to play around with this idea in public, and see where it goes.

Feel free to open an issue or a discussion to suggest ideas or report bugs. Happy to hear from you! 👋
