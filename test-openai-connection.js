// Test script to verify OpenAI API connection
// Run with: node test-openai-connection.js

import OpenAI from 'openai';
import { config } from 'dotenv';

// Load environment variables
config();

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
});

async function testOpenAIConnection() {
  try {
    console.log('🔄 Testing OpenAI API connection...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'شما دستیار آزمایشگاه سلامت هستید. به سادگی و مختصر پاسخ دهید.'
        },
        {
          role: 'user',
          content: 'سلام، آزمایشگاه سلامت چه خدماتی ارائه می‌دهد؟'
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    console.log('✅ OpenAI API connection successful!');
    console.log('📝 Test Response:');
    console.log(completion.choices[0].message.content);
    
    console.log('\n📊 Usage Stats:');
    console.log(`- Model: ${completion.model}`);
    console.log(`- Tokens used: ${completion.usage?.total_tokens || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ OpenAI API connection failed:');
    console.error('Error:', error.message);
    
    if (error.error?.code === 'invalid_api_key') {
      console.error('🔑 Invalid API key. Please check your .env file.');
    } else if (error.error?.code === 'insufficient_quota') {
      console.error('💳 Insufficient quota. Please check your OpenAI account.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network connection issue. Please check your internet.');
    }
  }
}

// Run the test
testOpenAIConnection();
