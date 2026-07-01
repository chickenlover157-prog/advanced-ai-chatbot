import logger from '../utils/logger';
import OpenAIService from './OpenAIService';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';

interface TestQuery {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  metadata?: any;
}

class TestingService {
  private sessions: Map<string, TestQuery[]> = new Map();

  isTestingModeEnabled(): boolean {
    return config.testing.enabled && config.testing.unrestricted;
  }

  async executeTestQuery(
    sessionId: string,
    query: string,
    systemPrompt?: string
  ): Promise<{ response: string; queryId: string }> {
    if (!this.isTestingModeEnabled()) {
      throw new Error('Testing mode is not enabled');
    }

    try {
      logger.info(`[TESTING] Executing unrestricted query: ${query}`);

      const messages: Array<{ role: string; content: string }> = [];

      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      messages.push({ role: 'user', content: query });

      const response = await OpenAIService.generateResponse(messages, {
        temperature: 1.0, // Maximum creativity
        maxTokens: 4000, // More tokens for unrestricted mode
      });

      const queryId = uuidv4();
      const testQuery: TestQuery = {
        id: queryId,
        query,
        response: response.content,
        timestamp: new Date(),
        metadata: {
          tokens: response.usage,
          unrestricted: true,
        },
      };

      if (!this.sessions.has(sessionId)) {
        this.sessions.set(sessionId, []);
      }
      this.sessions.get(sessionId)!.push(testQuery);

      logger.info(`[TESTING] Query executed successfully`);

      return {
        response: response.content,
        queryId,
      };
    } catch (error) {
      logger.error('[TESTING] Query execution failed:', error);
      throw error;
    }
  }

  getSessionQueries(sessionId: string): TestQuery[] {
    return this.sessions.get(sessionId) || [];
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getAllSessions(): Map<string, TestQuery[]> {
    return this.sessions;
  }
}

export default new TestingService();
