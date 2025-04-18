// API Key handling - in a production app, this would be handled server-side
let apiKey: string | null = localStorage.getItem('perplexity_api_key');

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const setApiKey = (key: string) => {
  localStorage.setItem('perplexity_api_key', key);
  apiKey = key;
};

export const getApiKey = () => apiKey;

export const sendMessageToAI = async (message: string, conversationHistory: Message[] = []): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  // Check for game commands
  const lowerMessage = message.toLowerCase();
  if (lowerMessage === "play trivia" || lowerMessage === "let's play trivia") {
    const question = getRandomQuestion();
    return `Let's play trivia! 🎮\n\n${question.question}\n\nOptions:\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}\n\nJust type your answer!`;
  }

  if (lowerMessage === "play word guess" || lowerMessage === "let's play word guess") {
    const word = getWordToGuess();
    return `Let's play Word Guess! 🎯\nI'm thinking of a wellness-related word with ${word.length} letters.\nTry to guess it! Here's your hint: ${word.charAt(0)}${'_'.repeat(word.length - 1)}`;
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are Serenity, an AI mental wellness companion. 
                      Respond with empathy and compassion. 
                      Keep responses concise and helpful. 
                      Offer practical wellness advice when appropriate.
                      You can also play games! Respond to "play trivia" or "play word guess" commands.
                      If someone appears to be in crisis, encourage them to seek professional help.
                      When users want to play games, remind them they can say "play trivia" or "play word guess".`
          },
          ...conversationHistory.map(msg => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.text
          })),
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

// Used for fallback to static responses if API fails
const staticResponses = [
  "I'm here to listen whenever you need to talk.",
  "That sounds challenging. How can I help support you?",
  "Remember to take care of yourself today - even small acts of self-care matter.",
  "Deep breathing can help in moments of stress. Would you like me to guide you through a quick exercise?",
  "It's important to acknowledge your feelings. Would you like to discuss them further?",
  "What's one small positive thing you've experienced recently?",
  "Sometimes writing down your thoughts can help process them. Have you tried journaling?",
];

export const getStaticResponse = () => {
  return staticResponses[Math.floor(Math.random() * staticResponses.length)];
};
import { getRandomQuestion, getWordToGuess } from './gamesService';
