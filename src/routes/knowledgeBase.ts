import { Router, Request, Response } from 'express';
import multer from 'multer';
import RAGService from '../services/RAGService';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ dest: 'uploads/' });

interface KnowledgeBase {
  id: string;
  userId: string;
  documents: any[];
  createdAt: Date;
}

const knowledgeBases = new Map<string, KnowledgeBase>();

// Create knowledge base
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const kb: KnowledgeBase = {
      id: uuidv4(),
      userId: req.userId!,
      documents: [],
      createdAt: new Date(),
    };
    knowledgeBases.set(kb.id, kb);
    res.status(201).json(kb);
  } catch (error) {
    logger.error('Create knowledge base error:', error);
    res.status(500).json({ error: 'Failed to create knowledge base' });
  }
});

// Upload document to knowledge base
router.post('/:kbId/documents', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { kbId } = req.params;
    const kb = knowledgeBases.get(kbId);

    if (!kb || kb.userId !== req.userId) {
      return res.status(404).json({ error: 'Knowledge base not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const docId = uuidv4();
    const content = `Sample content from ${req.file.filename}`;

    await RAGService.indexDocument(docId, content, req.file.filename);

    kb.documents.push({
      id: docId,
      filename: req.file.filename,
      uploadedAt: new Date(),
    });

    res.json({
      documentId: docId,
      filename: req.file.filename,
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get knowledge base documents
router.get('/:kbId', async (req: Request, res: Response) => {
  try {
    const kb = knowledgeBases.get(req.params.kbId);
    if (!kb || kb.userId !== req.userId) {
      return res.status(404).json({ error: 'Knowledge base not found' });
    }
    res.json(kb);
  } catch (error) {
    logger.error('Get knowledge base error:', error);
    res.status(500).json({ error: 'Failed to get knowledge base' });
  }
});

export default router;
