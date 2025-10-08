# TanStack AI - Features Overview

## 🎯 Core Streaming Features

### Universal Structured Streaming

**ALL providers now support structured JSON streaming:**

- ✅ OpenAI (native implementation)
- ✅ Anthropic (via converter - native implementation TODO)
- ✅ Ollama (via converter - native implementation TODO)
- ✅ Google Gemini (via converter - native implementation TODO)

### Stream Chunk Types

Every chunk in the stream is a typed JSON object:

1. **`ContentStreamChunk`** - Text content

   ```typescript
   {
     type: "content",
     delta: "Hello",           // New token(s)
     content: "Hello world",   // Accumulated content
     id: "...",
     model: "...",
     timestamp: 1234567890
   }
   ```

2. **`ToolCallStreamChunk`** - Function/tool calls

   ```typescript
   {
     type: "tool_call",
     toolCall: {
       id: "call_abc",
       type: "function",
       function: {
         name: "get_weather",
         arguments: "{\"location\":\"NYC\"}"
       }
     },
     index: 0,
     id: "...",
     model: "...",
     timestamp: 1234567890
   }
   ```

3. **`DoneStreamChunk`** - Completion signal

   ```typescript
   {
     type: "done",
     finishReason: "stop",
     usage: {
       promptTokens: 10,
       completionTokens: 15,
       totalTokens: 25
     },
     id: "...",
     model: "...",
     timestamp: 1234567890
   }
   ```

4. **`ErrorStreamChunk`** - Error information
   ```typescript
   {
     type: "error",
     error: {
       message: "Rate limit exceeded",
       code: "rate_limit_error"
     },
     id: "...",
     model: "...",
     timestamp: 1234567890
   }
   ```

## 🔧 Tool Calling Support

The library is ready for function/tool calling:

- `Tool` interface for defining functions
- `ToolCall` interface for function invocations
- Messages support `toolCalls` and `toolCallId` fields
- Streaming supports incremental tool call updates
- OpenAI adapter has full native support

## 🖥️ CLI Streaming Demo

### Normal Mode (All Providers)

```bash
# Real-time streaming with any provider
pnpm cli chat --provider openai
pnpm cli chat --provider anthropic
pnpm cli chat --provider ollama
pnpm cli chat --provider gemini
```

Output:

```
🤖 TanStack AI Chat
Type "exit" to quit

You: Tell me a joke
🤖 Why did the programmer quit his job?
Because he didn't get arrays!

[Tokens: 25]
```

### Debug Mode - See JSON Chunks

```bash
pnpm cli chat --provider openai --debug
```

Output:

```
🤖 TanStack AI Chat

You: Hello
🤖
--- Streaming JSON Chunks ---

{"type":"content","delta":"Hello","content":"Hello","id":"...","model":"gpt-3.5-turbo","timestamp":1234567890}
{"type":"content","delta":"!","content":"Hello!","id":"...","model":"gpt-3.5-turbo","timestamp":1234567890}
{"type":"content","delta":" How","content":"Hello! How","id":"...","model":"gpt-3.5-turbo","timestamp":1234567890}
{"type":"done","finishReason":"stop","usage":{"promptTokens":10,"completionTokens":5,"totalTokens":15},"id":"...","model":"gpt-3.5-turbo","timestamp":1234567890}

--- End of Stream ---

Full response: Hello! How can I help you today?
```

## 📊 Benefits Over Vercel's AI SDK

1. **True Open Source**: No vendor lock-in or future enshittification
2. **Universal Streaming**: Works the same across ALL providers
3. **Structured Format**: Type-safe JSON chunks, not string concatenation
4. **Token Visibility**: See exactly what you're being charged for
5. **Tool-Ready**: Built for function calling from day one
6. **Provider Agnostic**: Switch providers without code changes

## 🚀 Usage Examples

### Basic Streaming (Any Provider)

```typescript
import { AI } from "@tanstack/ai";
import { OpenAIAdapter } from "@tanstack/ai-openai";
import { AnthropicAdapter } from "@tanstack/ai-anthropic";
import { OllamaAdapter } from "@tanstack/ai-ollama";
import { GeminiAdapter } from "@tanstack/ai-gemini";

// Pick any adapter
const ai = new AI(new OpenAIAdapter({ apiKey: "..." }));

// Stream with structured chunks
for await (const chunk of ai.streamChat({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Explain TypeScript" }],
})) {
  switch (chunk.type) {
    case "content":
      process.stdout.write(chunk.delta);
      break;
    case "tool_call":
      console.log(`Calling: ${chunk.toolCall.function.name}`);
      break;
    case "done":
      console.log(`\nUsed ${chunk.usage?.totalTokens} tokens`);
      break;
    case "error":
      console.error(`Error: ${chunk.error.message}`);
      break;
  }
}
```

### Switch Providers - Same Code Works!

```typescript
const ai = new AI(new OpenAIAdapter({ apiKey: "..." }));

// This exact same streaming code works after switching:
ai.setAdapter(new AnthropicAdapter({ apiKey: "..." }));
ai.setAdapter(new OllamaAdapter());
ai.setAdapter(new GeminiAdapter({ apiKey: "..." }));

// All use the same streamChat() API!
```

## 🎨 CLI Features

- ✅ Interactive chat with conversation history
- ✅ Real-time streaming (all providers)
- ✅ Automatic API key prompting
- ✅ API key validation
- ✅ Save keys to .env file
- ✅ Debug mode for JSON chunk inspection
- ✅ Token usage tracking
- ✅ Tool call visualization (when used)
- ✅ Error handling with helpful messages

## 🔜 Future Enhancements

- [ ] Native structured streaming for Anthropic (currently uses converter)
- [ ] Native structured streaming for Ollama (currently uses converter)
- [ ] Native structured streaming for Gemini (currently uses converter)
- [ ] Interactive tool calling demo in CLI
- [ ] Multi-turn conversations with tool results
- [ ] Streaming to file/database examples
- [ ] Rate limiting and retry logic
- [ ] Caching layer for embeddings

## 💡 Philosophy

Unlike proprietary SDKs that use open source as marketing then lock you into paid services, TanStack AI is:

- **Truly Open**: MIT licensed, forever
- **Community Driven**: By developers, for developers
- **No Hidden Costs**: Use any provider, no forced upgrades
- **Transparent**: See exactly what's being sent/received
- **Educational**: Debug mode shows you how streaming works

---

**The open-source community deserves better than vendor lock-in disguised as open source.**
