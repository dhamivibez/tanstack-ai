# Structured Streaming Implementation

## Overview

We've implemented a new structured streaming API for @tanstack/ai that returns JSON chunks with detailed token information and support for tool calling.

## What's Been Implemented

### 1. **New Types** (`packages/ai/src/types.ts`)

Added comprehensive types for structured streaming:

- `StreamChunk` - Union type for all chunk types:

  - `ContentStreamChunk` - Content tokens with delta and accumulated content
  - `ToolCallStreamChunk` - Tool/function call information
  - `DoneStreamChunk` - Completion signal with usage stats
  - `ErrorStreamChunk` - Error information

- `Tool` & `ToolCall` - Support for function calling
- Enhanced `Message` to support tool roles and tool calls
- Enhanced `ChatCompletionOptions` to accept tools and toolChoice

### 2. **Core Library Updates**

**`AI` class** (`packages/ai/src/ai.ts`):

- Added `streamChat()` method - Returns structured `StreamChunk` objects
- Kept `chatStream()` for backwards compatibility (marked as deprecated)

**`BaseAdapter`** (`packages/ai/src/base-adapter.ts`):

- Added abstract `chatStream()` method that adapters must implement

**Stream Utils** (`packages/ai/src/stream-utils.ts`):

- Added `convertLegacyStream()` helper to convert old format to new

### 3. **OpenAI Adapter** (✅ Fully Implemented)

The OpenAI adapter has full native implementation of structured streaming:

- Handles content deltas properly
- Supports tool calls in streaming
- Provides usage statistics
- Error handling with structured error chunks

### 4. **Other Adapters** (⚠️ Using Conversion)

Anthropic, Ollama, and Gemini adapters currently use the legacy-to-new converter:

- They have stub implementations using `convertLegacyStream()`
- TODO comments indicate where native implementations should go

## Stream Chunk Format

Each chunk is a JSON object with these properties:

```typescript
// Content chunk
{
  type: "content",
  id: "chatcmpl-123",
  model: "gpt-3.5-turbo",
  timestamp: 1234567890,
  delta: "Hello",      // The new token(s)
  content: "Hello",    // Accumulated content so far
  role: "assistant"
}

// Tool call chunk
{
  type: "tool_call",
  id: "chatcmpl-123",
  model: "gpt-3.5-turbo",
  timestamp: 1234567890,
  toolCall: {
    id: "call_abc123",
    type: "function",
    function: {
      name: "get_weather",
      arguments: "{\"location\":" // Incremental JSON
    }
  },
  index: 0
}

// Done chunk
{
  type: "done",
  id: "chatcmpl-123",
  model: "gpt-3.5-turbo",
  timestamp: 1234567890,
  finishReason: "stop",
  usage: {
    promptTokens: 10,
    completionTokens: 20,
    totalTokens: 30
  }
}

// Error chunk
{
  type: "error",
  id: "error-123",
  model: "gpt-3.5-turbo",
  timestamp: 1234567890,
  error: {
    message: "Rate limit exceeded",
    code: "rate_limit_error"
  }
}
```

## Usage Example

```typescript
import { AI } from "@tanstack/ai";
import { OpenAIAdapter } from "@tanstack/ai-openai";

const ai = new AI(new OpenAIAdapter({ apiKey: "..." }));

for await (const chunk of ai.streamChat({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello!" }],
})) {
  if (chunk.type === "content") {
    // Stream the delta to UI
    process.stdout.write(chunk.delta);
    // Or use accumulated content
    console.log("Full text so far:", chunk.content);
  } else if (chunk.type === "tool_call") {
    console.log("Tool being called:", chunk.toolCall.function.name);
  } else if (chunk.type === "done") {
    console.log("Tokens used:", chunk.usage);
  } else if (chunk.type === "error") {
    console.error("Error:", chunk.error.message);
  }
}
```

## Next Steps

1. **Fix Build Errors**: Need to handle `content: string | null` in adapters
2. **Update CLI**: Modify CLI to use new streaming format and display JSON chunks
3. **Complete Native Implementations**: Implement native streaming for Anthropic, Ollama, and Gemini
4. **Add Tool Support**: Extend CLI to demonstrate tool calling capabilities

## Build Status

✅ **All packages build successfully!**

All adapters now properly handle `content: string | null` and implement the `chatStream()` method.

## CLI Integration

The CLI now uses `streamChat()` for **ALL providers**:

```bash
# Normal mode - streams content in real-time
pnpm cli chat --provider openai
pnpm cli chat --provider anthropic
pnpm cli chat --provider ollama
pnpm cli chat --provider gemini

# Debug mode - shows raw JSON chunks
pnpm cli chat --provider openai --debug
```

### Debug Mode Output Example

```json
{"type":"content","delta":"Hello","content":"Hello","timestamp":1234567890,...}
{"type":"content","delta":" there","content":"Hello there","timestamp":1234567890,...}
{"type":"done","finishReason":"stop","usage":{"totalTokens":25},...}
```

### Normal Mode

Just shows the streaming text with token count at the end - works beautifully with all providers!
