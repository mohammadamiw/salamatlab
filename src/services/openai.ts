import OpenAI from 'openai';
import { CHATBOT_SYSTEM_PROMPT } from '@/data/chatbotKnowledge';

// OpenAI disabled for production deployment (removed API key)
// const openai = new OpenAI({
//   apiKey: '',
//   dangerouslyAllowBrowser: true
// });

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

class OpenAIService {
  private conversationHistory: ChatMessage[] = [];
  private maxHistoryLength = 10; // Keep last 10 messages for context

  constructor() {
    // Initialize with system prompt
    this.conversationHistory = [
      {
        role: 'system',
        content: CHATBOT_SYSTEM_PROMPT,
        timestamp: new Date()
      }
    ];
  }

  async sendMessage(userMessage: string): Promise<ChatResponse> {
    // Always use fallback responses (OpenAI disabled for production)
    return this.getFallbackResponse(userMessage);
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory.filter(msg => msg.role !== 'system');
  }

  // Clear conversation history (keep system prompt)
  clearHistory(): void {
    this.conversationHistory = [this.conversationHistory[0]]; // Keep only system message
  }

  // Get a fallback response for when OpenAI is not available
  getFallbackResponse(userMessage: string): ChatResponse {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (message.includes('سلام') || message.includes('درود')) {
      return {
        message: 'سلام! خوش آمدید به آزمایشگاه سلامت. چطور می‌تونم کمکتون کنم؟',
        success: true
      };
    }
    
    if (message.includes('ساعت کار') || message.includes('زمان')) {
      return {
        message: 'آزمایشگاه سلامت از شنبه تا پنج‌شنبه از ساعت 7 صبح تا 7 عصر فعال است.',
        success: true
      };
    }
    
    if (message.includes('تلفن') || message.includes('تماس')) {
      return {
        message: 'شماره تماس آزمایشگاه: 021-46833010 و 021-46833011',
        success: true
      };
    }
    
    if (message.includes('آدرس') || message.includes('نشانی')) {
      return {
        message: 'آدرس آزمایشگاه: شهرقدس، میدان مصلی',
        success: true
      };
    }
    
    if (message.includes('نتیجه') || message.includes('جواب')) {
      return {
        message: 'برای دریافت نتیجه آزمایش به آدرس http://93.114.111.53:8086/Login مراجعه کنید.',
        success: true
      };
    }

    return {
      message: 'متأسفانه در حال حاضر امکان پاسخ‌دهی وجود ندارد. لطفاً با شماره 021-46833010 تماس بگیرید.',
      success: false
    };
  }
}

// Create singleton instance
export const openaiService = new OpenAIService();
export default openaiService;
