import logger from '../utils/logger';
import OpenAIService from './OpenAIService';
import { RAGContext } from '../types';

class RAGService {
  // Simulated vector store - replace with Pinecone in production
  private vectorStore: Map<string, { embedding: number[]; content: string; source: string }> = new Map();

  async indexDocument(
    docId: string,
    content: string,
    source: string
  ): Promise<void> {
    try {
      const embedding = await OpenAIService.generateEmbedding(content);
      this.vectorStore.set(docId, { embedding, content, source });
      logger.info(`Document indexed: ${docId}`);
    } catch (error) {
      logger.error('Document indexing error:', error);
      throw error;
    }
  }

  async searchSimilarDocuments(
    query: string,
    limit: number = 5
  ): Promise<RAGContext> {
    try {
      const queryEmbedding = await OpenAIService.generateEmbedding(query);

      const results = Array.from(this.vectorStore.entries())
        .map(([, doc]) => ({
          content: doc.content,
          score: this.cosineSimilarity(queryEmbedding, doc.embedding),
          source: doc.source,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      const relevanceScore = results.length > 0 ? results[0].score : 0;

      return {
        documents: results,
        relevanceScore,
      };
    } catch (error) {
      logger.error('RAG search error:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

export default new RAGService();
