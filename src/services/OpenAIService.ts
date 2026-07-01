import OpenAI from 'openai';
import config from '../config';
import logger from '../utils/logger';
import { AIResponse } from '../types';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      functions?: any[];
    }
  ): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: messages as any,
        temperature: options?.temperature ?? config.openai.temperature,
        max_tokens: options?.maxTokens ?? config.openai.maxTokens,
        functions: options?.functions,
      });

      const content = response.choices[0].message.content || '';
      const usage = response.usage!;

      return {
        id: response.id,
        content,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        },
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error('Embedding generation error:', error);
      throw error;
    }
  }

  async streamResponse(
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: messages as any,
        temperature: options?.temperature ?? config.openai.temperature,
        max_tokens: options?.maxTokens ?? config.openai.maxTokens,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }

      return fullResponse;
    } catch (error) {
      logger.error('Stream response error:', error);
      throw error;
    }
  }
}

export default new OpenAIService();
