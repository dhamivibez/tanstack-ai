# Quick Start Guide - TanStack AI

## Installation

```bash
# Clone/navigate to the project
cd tanstack-ai

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Try It Now (No Configuration Needed!)

```bash
# Start interactive chat - it will prompt for API keys
pnpm cli chat --provider openai

# Or try other providers
pnpm cli chat --provider anthropic
pnpm cli chat --provider gemini
pnpm cli chat --provider ollama  # Requires local Ollama
```

The CLI will:

1. Prompt for your API key (if not in environment)
2. Validate the key
3. Offer to save it to `.env`
4. Start streaming chat immediately!

## See the Magic - Debug Mode

```bash
# Watch the JSON chunks stream in real-time
pnpm cli chat --provider openai --debug
```

This shows you exactly what's being streamed:

- `content` chunks with token deltas
- `tool_call` chunks (when using tools)
- `done` chunk with usage statistics
- `error` chunks if something goes wrong

## Code Examples

### Basic Streaming

```typescript
import { AI } from "@tanstack/ai";
import { OpenAIAdapter } from "@tanstack/ai-openai";

const ai = new AI(
  new OpenAIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Stream with structured JSON chunks
for await (const chunk of ai.streamChat({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Write a haiku" }],
})) {
  if (chunk.type === "content") {
    process.stdout.write(chunk.delta); // Real-time output
  } else if (chunk.type === "done") {
    console.log(`\n\nTokens used: ${chunk.usage?.totalTokens}`);
  }
}
```

### Switch Providers On the Fly

```typescript
import { AI } from "@tanstack/ai";
import { OpenAIAdapter } from "@tanstack/ai-openai";
import { AnthropicAdapter } from "@tanstack/ai-anthropic";

const ai = new AI(new OpenAIAdapter({ apiKey: "..." }));

// Use OpenAI
await ai.chat({ model: "gpt-3.5-turbo", messages: [...] });

// Switch to Claude
ai.setAdapter(new AnthropicAdapter({ apiKey: "..." }));
await ai.chat({ model: "claude-3-sonnet-20240229", messages: [...] });

// Same code, different provider!
```

## What Makes This Special

### 1. Universal Streaming

**ALL providers stream the same way:**

- OpenAI ✅
- Anthropic ✅
- Ollama ✅
- Google Gemini ✅

### 2. Structured Data

Instead of just strings, you get:

```typescript
type StreamChunk =
  | ContentStreamChunk // Text tokens
  | ToolCallStreamChunk // Function calls
  | DoneStreamChunk // Completion + usage
  | ErrorStreamChunk; // Errors
```

### 3. Zero Lock-in

- MIT licensed
- Provider agnostic
- No forced services
- Your code, your choice

## CLI Commands

```bash
# Interactive chat (all providers support streaming!)
pnpm cli chat --provider <openai|anthropic|ollama|gemini>

# Text generation
pnpm cli generate --provider openai --prompt "Once upon a time..."

# Summarization
pnpm cli summarize --provider anthropic --text "Long text..." --style bullet-points

# Embeddings
pnpm cli embed --provider openai --text "Text to embed"

# Debug mode - see JSON chunks
pnpm cli chat --provider openai --debug
```

## Development

```bash
# Watch mode (no build needed)
cd examples/cli
pnpm dev chat --provider openai

# Or from root
pnpm cli chat --provider openai
```

## Environment Variables

Create `.env` in the CLI directory:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
OLLAMA_HOST=http://localhost:11434
```

Or just run the CLI and it will prompt you!

## Next Steps

1. ⭐ Star the repo (when it's on GitHub)
2. 🔧 Try different providers
3. 🐛 Report issues
4. 💡 Contribute features
5. 📢 Tell others about it

## Philosophy

This project exists because:

- ❌ Vercel uses OSS as marketing then locks you in
- ❌ "Open source" shouldn't mean "open until we want your money"
- ✅ Developers deserve truly open, honest tools
- ✅ No enshittification. Ever.

---

**Built by the community, for the community. GLHF! 🚀**
