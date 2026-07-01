import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    tokens?: { input: number; output: number };
  }>;
  metadata?: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  isTestingMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
    },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'] },
        content: String,
        timestamp: { type: Date, default: Date.now },
        tokens: {
          input: Number,
          output: Number,
        },
      },
    ],
    metadata: {
      model: String,
      temperature: Number,
      maxTokens: Number,
    },
    isTestingMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>('Conversation', conversationSchema);
