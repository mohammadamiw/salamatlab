import OpenAI from 'openai';
import { CHATBOT_SYSTEM_PROMPT } from '@/data/chatbotKnowledge';

// Liara AI Service Configuration
const LIARA_BASE_URL = 'https://ai.liara.ir/api/v1/68caae6a50d5b2a15f00deff';
const LIARA_MODEL = 'openai/gpt-4o-mini';

// Initialize OpenAI client with Liara configuration
const openai = new OpenAI({
  baseURL: LIARA_BASE_URL,
  apiKey: import.meta.env.VITE_LIARA_API_KEY || '',
  dangerouslyAllowBrowser: true
});

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
    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_LIARA_API_KEY;
      if (!apiKey) {
        console.warn('Liara API key not found, using fallback responses');
        return this.getFallbackResponse(userMessage);
      }

      // Add user message to history
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMsg);

      // Trim history if too long
      if (this.conversationHistory.length > this.maxHistoryLength) {
        // Keep system message and most recent messages
        this.conversationHistory = [
          this.conversationHistory[0], // system message
          ...this.conversationHistory.slice(-this.maxHistoryLength + 1)
        ];
      }

      // Send message to Liara AI
      const completion = await openai.chat.completions.create({
        model: LIARA_MODEL,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 300,
        temperature: 0.7
      });

      const assistantResponse = completion.choices[0]?.message?.content || 
        'متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.';

      // Add assistant message to history
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMsg);

      return {
        message: assistantResponse,
        success: true
      };

    } catch (error) {
      console.error('Liara AI Error:', error);
      
      // Remove the failed user message from history
      if (this.conversationHistory[this.conversationHistory.length - 1]?.role === 'user') {
        this.conversationHistory.pop();
      }
      
      // Use fallback response
      return this.getFallbackResponse(userMessage);
    }
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
