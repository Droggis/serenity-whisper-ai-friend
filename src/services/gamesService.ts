
interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

const triviaQuestions: TriviaQuestion[] = [
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
  }
];

export const getRandomQuestion = (): TriviaQuestion => {
  const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
  return triviaQuestions[randomIndex];
};

export const checkAnswer = (question: TriviaQuestion, userAnswer: string): boolean => {
  return question.correctAnswer.toLowerCase() === userAnswer.toLowerCase();
};

const wordList = ["happiness", "mindfulness", "meditation", "wellness", "serenity", "peaceful", "harmony", "balance"];

export const getWordToGuess = (): string => {
  return wordList[Math.floor(Math.random() * wordList.length)];
};

