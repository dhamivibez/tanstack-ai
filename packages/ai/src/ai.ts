import type {
  AIAdapter,
  ChatCompletionOptions,
  ChatCompletionResult,
  ChatCompletionChunk,
  StreamChunk,
  TextGenerationOptions,
  TextGenerationResult,
  SummarizationOptions,
  SummarizationResult,
  EmbeddingOptions,
  EmbeddingResult,
} from "./types";

export class AI {
  private adapter: AIAdapter;

  constructor(adapter: AIAdapter) {
    this.adapter = adapter;
  }

  /**
   * Get the current adapter name
   */
  get adapterName(): string {
    return this.adapter.name;
  }

  /**
   * Complete a chat conversation
   */
  async chat(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    return this.adapter.chatCompletion(options);
  }

  /**
   * Complete a chat conversation with streaming (legacy)
   * @deprecated Use streamChat() for structured streaming with JSON chunks
   */
  async *chatStream(
    options: ChatCompletionOptions
  ): AsyncIterable<ChatCompletionChunk> {
    yield* this.adapter.chatCompletionStream({ ...options, stream: true });
  }

  /**
   * Stream chat with structured JSON chunks (supports tools and detailed token info)
   */
  async *streamChat(
    options: ChatCompletionOptions
  ): AsyncIterable<StreamChunk> {
    yield* this.adapter.chatStream({ ...options, stream: true });
  }

  /**
   * Generate text from a prompt
   */
  async generateText(
    options: TextGenerationOptions
  ): Promise<TextGenerationResult> {
    return this.adapter.generateText(options);
  }

  /**
   * Generate text from a prompt with streaming
   */
  async *generateTextStream(
    options: TextGenerationOptions
  ): AsyncIterable<string> {
    yield* this.adapter.generateTextStream({ ...options, stream: true });
  }

  /**
   * Summarize text
   */
  async summarize(options: SummarizationOptions): Promise<SummarizationResult> {
    return this.adapter.summarize(options);
  }

  /**
   * Create embeddings for text
   */
  async embed(options: EmbeddingOptions): Promise<EmbeddingResult> {
    return this.adapter.createEmbeddings(options);
  }

  /**
   * Set a new adapter
   */
  setAdapter(adapter: AIAdapter): void {
    this.adapter = adapter;
  }
}
