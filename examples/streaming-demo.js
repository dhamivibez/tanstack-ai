#!/usr/bin/env node

/**
 * TanStack AI - Structured Streaming Demo
 *
 * This demonstrates the new JSON-based streaming API that works with ALL providers:
 * - OpenAI
 * - Anthropic
 * - Ollama
 * - Google Gemini
 */

import { AI } from "../packages/ai/dist/index.js";
import { OpenAIAdapter } from "../packages/ai-openai/dist/index.js";

async function demoStructuredStreaming() {
  console.log("🚀 TanStack AI - Structured Streaming Demo\n");
  console.log("This shows the JSON chunks being streamed in real-time:\n");

  const ai = new AI(
    new OpenAIAdapter({
      apiKey: process.env.OPENAI_API_KEY || "demo-key",
    })
  );

  try {
    console.log("📡 Starting stream...\n");

    for await (const chunk of ai.streamChat({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello in 3 words" }],
    })) {
      // Each chunk is a structured JSON object
      console.log("📦 Chunk:", JSON.stringify(chunk, null, 2));
      console.log(""); // Blank line for readability
    }
  } catch (error) {
    console.error("❌ Error (expected without API key):", error.message);
  }

  console.log("\n✨ Key Features:");
  console.log(
    "  • Works with ALL providers (OpenAI, Anthropic, Ollama, Gemini)"
  );
  console.log("  • Returns structured JSON chunks with type discrimination");
  console.log("  • Includes token deltas AND accumulated content");
  console.log("  • Supports tool calling (function streaming)");
  console.log("  • Provides usage statistics in 'done' chunk");
  console.log("  • Error handling with 'error' chunks");
}

demoStructuredStreaming();
