
interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    category: "Geography"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    category: "Space"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au",
    category: "Science"
  },
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    category: "Geography"
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
    correctAnswer: "Albert Einstein",
    category: "Science"
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
    correctAnswer: "Skin",
    category: "Health"
  },
  {
    question: "Which vitamin is produced by the skin when exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correctAnswer: "Vitamin D",
    category: "Health"
  },
  {
    question: "What is the recommended daily water intake for adults?",
    options: ["1-2 liters", "2-3 liters", "3-4 liters", "4-5 liters"],
    correctAnswer: "2-3 liters",
    category: "Health"
  },
  {
    question: "Which of these foods is highest in protein?",
    options: ["Broccoli", "Chicken", "Rice", "Potato"],
    correctAnswer: "Chicken",
    category: "Nutrition"
  },
  {
    question: "How many hours of sleep are recommended for adults?",
    options: ["4-5 hours", "6-7 hours", "7-9 hours", "10-12 hours"],
    correctAnswer: "7-9 hours",
    category: "Health"
  }
];

export const getRandomQuestion = (): TriviaQuestion => {
  const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
  return triviaQuestions[randomIndex];
};

export const getQuestionsByCategory = (category: string): TriviaQuestion[] => {
  return triviaQuestions.filter(question => 
    question.category.toLowerCase() === category.toLowerCase()
  );
};

export const checkAnswer = (question: TriviaQuestion, userAnswer: string): boolean => {
  return question.correctAnswer.toLowerCase() === userAnswer.toLowerCase();
};

// Word Guess Game
const wordList = [
  "happiness", "mindfulness", "meditation", "wellness", "serenity", 
  "peaceful", "harmony", "balance", "vitality", "strength",
  "nutrition", "hydration", "exercise", "gratitude", "compassion",
  "laughter", "healing", "recovery", "therapy", "breathe"
];

export const getWordToGuess = (): string => {
  return wordList[Math.floor(Math.random() * wordList.length)];
};

// Memory Match Game
export interface MemoryCard {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

export const generateMemoryCards = (): MemoryCard[] => {
  const values = ["🧘", "🏃", "💧", "🥗", "😊", "💤", "🌱", "❤️"];
  const cards: MemoryCard[] = [];
  
  // Create pairs of cards
  values.forEach((value, index) => {
    // Add two of each card
    cards.push({ id: index * 2, value, flipped: false, matched: false });
    cards.push({ id: index * 2 + 1, value, flipped: false, matched: false });
  });
  
  // Shuffle the cards
  return cards.sort(() => Math.random() - 0.5);
};

// Riddle Game
export interface Riddle {
  question: string;
  answer: string;
  hint: string;
}

export const riddles: Riddle[] = [
  {
    question: "I'm tall when I'm young, and short when I'm old. What am I?",
    answer: "candle",
    hint: "I provide light"
  },
  {
    question: "What has a heart that doesn't beat?",
    answer: "artichoke",
    hint: "I'm something you can eat"
  },
  {
    question: "What gets wetter as it dries?",
    answer: "towel",
    hint: "You use me after a shower"
  },
  {
    question: "What has hands but cannot clap?",
    answer: "clock",
    hint: "I help you keep track of time"
  },
  {
    question: "What has many keys but can't open any doors?",
    answer: "piano",
    hint: "I make music"
  }
];

export const getRandomRiddle = (): Riddle => {
  const randomIndex = Math.floor(Math.random() * riddles.length);
  return riddles[randomIndex];
};

// Health Tips
export const healthTips = [
  "Drink water first thing in the morning to jumpstart your metabolism.",
  "Practice deep breathing for 5 minutes when feeling stressed.",
  "Take a 5-minute stretching break for every hour you sit.",
  "Try to eat at least 5 different colored fruits and vegetables daily.",
  "Aim for 10,000 steps a day for improved cardiovascular health.",
  "Spend at least 20 minutes outside each day for vitamin D and improved mood.",
  "Replace sugary drinks with water, herbal tea, or infused water.",
  "Try to meditate for 10 minutes daily to reduce stress and improve focus.",
  "Keep a gratitude journal to boost mental wellbeing.",
  "Get 7-9 hours of quality sleep each night.",
  "Practice the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
  "Add strength training to your routine at least twice a week.",
  "Eat mindfully by putting away screens during meals.",
  "Stay hydrated by drinking half your body weight in ounces of water daily.",
  "Try a new healthy recipe each week to keep your meals interesting."
];

export const getRandomHealthTip = (): string => {
  return healthTips[Math.floor(Math.random() * healthTips.length)];
};

export const getAllHealthTips = (): string[] => {
  return healthTips;
};

// General Knowledge Questions for Daily Reflection
export const dailyReflectionQuestions = [
  "What's one thing you're grateful for today?",
  "What made you smile today?",
  "What's something you're looking forward to?",
  "Who had a positive impact on your day?",
  "What was a small win you had today?",
  "What's something you learned today?",
  "What made you proud of yourself today?",
  "What was the best part of your day?",
  "How did you practice self-care today?",
  "What was challenging today and how did you handle it?",
  "What made you laugh today?",
  "What's something you did today that was just for you?",
  "How did you connect with someone today?",
  "What's a boundary you honored today?",
  "What would you like to improve tomorrow?",
  "What's something that brought you peace today?",
  "How did you move your body today?",
  "What's something you're letting go of?",
  "What's one word to describe how you feel right now?",
  "What's something you're looking forward to tomorrow?"
];

export const getRandomReflectionQuestion = (): string => {
  return dailyReflectionQuestions[Math.floor(Math.random() * dailyReflectionQuestions.length)];
};

export const getAllReflectionQuestions = (): string[] => {
  return dailyReflectionQuestions;
};
