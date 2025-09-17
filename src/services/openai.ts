import OpenAI from 'openai';
import { CHATBOT_SYSTEM_PROMPT } from '@/data/chatbotKnowledge';

// OpenAI configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Only for demo purposes - in production, use a backend
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
      // Add user message to history
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      
      this.conversationHistory.push(userMsg);

      // Keep conversation history manageable
      if (this.conversationHistory.length > this.maxHistoryLength + 1) { // +1 for system message
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system message
          ...this.conversationHistory.slice(-this.maxHistoryLength)
        ];
      }

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const assistantMessage = completion.choices[0]?.message?.content || 'متأسفانه نتوانستم پاسخ مناسبی تولید کنم. لطفاً دوباره تلاش کنید.';

      // Add assistant response to history
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      };
      
      this.conversationHistory.push(assistantMsg);

      return {
        message: assistantMessage,
        success: true
      };

    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      
      let errorMessage = 'خطایی در ارتباط با سرور رخ داده است.';
      
      if (error?.error?.code === 'invalid_api_key') {
        errorMessage = 'کلید API معتبر نیست.';
      } else if (error?.error?.code === 'insufficient_quota') {
        errorMessage = 'سهمیه API تمام شده است.';
      } else if (error?.message?.includes('network')) {
        errorMessage = 'خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.';
      }

      return {
        message: errorMessage,
        success: false,
        error: error.message
      };
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
