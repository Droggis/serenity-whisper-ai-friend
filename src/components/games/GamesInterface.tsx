
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getRandomQuestion, 
  triviaQuestions, 
  checkAnswer, 
  generateMemoryCards, 
  MemoryCard, 
  getRandomRiddle, 
  Riddle 
} from "@/services/gamesService";
import { 
  Trophy, 
  ThumbsUp, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw, 
  Brain, 
  Gamepad2
} from "lucide-react";
import { toast } from "sonner";

export const GamesInterface = () => {
  // Trivia Game State
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  
  // Memory Match Game State
  const [cards, setCards] = useState<MemoryCard[]>(generateMemoryCards());
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  
  // Riddle Game State
  const [currentRiddle, setCurrentRiddle] = useState<Riddle>(getRandomRiddle());
  const [riddleGuess, setRiddleGuess] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [riddleResult, setRiddleResult] = useState<'correct' | 'incorrect' | null>(null);
  const [riddleScore, setRiddleScore] = useState(0);
  
  // Trivia Game Functions
  const handleTriviaSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const checkTriviaAnswer = () => {
    if (!selectedOption) return;
    
    const result = checkAnswer(currentQuestion, selectedOption);
    setIsCorrect(result);
    
    if (result) {
      setTriviaScore(prev => prev + 1);
      toast.success("Correct answer!");
    } else {
      toast.error(`Incorrect. The answer was ${currentQuestion.correctAnswer}`);
    }
  };
  
  const nextTriviaQuestion = () => {
    setCurrentQuestion(getRandomQuestion());
    setSelectedOption(null);
    setIsCorrect(null);
  };
  
  // Memory Match Game Functions
  const handleCardClick = (index: number) => {
    // Don't allow flipping if card is already flipped or matched
    if (cards[index].flipped || cards[index].matched) return;
    
    // Don't allow more than 2 cards to be flipped
    if (flippedIndexes.length === 2) return;
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);
    
    // Check for match if 2 cards are flipped
    if (newFlippedIndexes.length === 2) {
      setMoveCount(prev => prev + 1);
      
      const [first, second] = newFlippedIndexes;
      
      if (newCards[first].value === newCards[second].value) {
        // Match found
        newCards[first].matched = true;
        newCards[second].matched = true;
        setMatchCount(prev => prev + 1);
        setFlippedIndexes([]);
        toast.success("Match found!");
        
        // Check if all matches found
        if (matchCount + 1 === cards.length / 2) {
          toast.success("You've matched all the cards! Great job!");
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };
  
  const resetMemoryGame = () => {
    setCards(generateMemoryCards());
    setFlippedIndexes([]);
    setMatchCount(0);
    setMoveCount(0);
  };
  
  // Riddle Game Functions
  const checkRiddleAnswer = () => {
    if (!riddleGuess) return;
    
    const isRightAnswer = currentRiddle.answer.toLowerCase() === riddleGuess.toLowerCase();
    setRiddleResult(isRightAnswer ? 'correct' : 'incorrect');
    
    if (isRightAnswer) {
      setRiddleScore(prev => prev + 1);
      toast.success("That's correct! Well done!");
    } else {
      toast.error(`Sorry, that's not right. The answer was "${currentRiddle.answer}".`);
    }
  };
  
  const nextRiddle = () => {
    setCurrentRiddle(getRandomRiddle());
    setRiddleGuess("");
    setShowHint(false);
    setRiddleResult(null);
  };
  
  const showRiddleHint = () => {
    setShowHint(true);
    toast.info(`Hint: ${currentRiddle.hint}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="trivia" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="trivia">Trivia</TabsTrigger>
          <TabsTrigger value="memory">Memory Match</TabsTrigger>
          <TabsTrigger value="riddles">Riddles</TabsTrigger>
        </TabsList>
        
        {/* Trivia Game Tab */}
        <TabsContent value="trivia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Wellness Trivia</span>
                <span className="text-sm font-normal flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                  Score: {triviaScore}
                </span>
              </CardTitle>
              <CardDescription>Test your knowledge with these wellness questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-lg font-medium mb-4">{currentQuestion.question}</p>
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedOption === option ? "default" : "outline"}
                      className="w-full justify-start text-left"
                      onClick={() => handleTriviaSelect(option)}
                      disabled={isCorrect !== null}
                    >
                      {option}
                      {isCorrect !== null && option === currentQuestion.correctAnswer && (
                        <ThumbsUp className="h-4 w-4 ml-auto text-green-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isCorrect === null ? (
                <Button onClick={checkTriviaAnswer} disabled={!selectedOption}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextTriviaQuestion}>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Memory Match Game Tab */}
        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Memory Match</span>
                <Button variant="outline" size="sm" onClick={resetMemoryGame}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </CardTitle>
              <CardDescription>
                Matches: {matchCount}/{cards.length/2} | Moves: {moveCount}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`h-16 flex items-center justify-center text-2xl rounded-md cursor-pointer transition-all duration-300 ${
                      card.flipped || card.matched
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } ${card.matched ? "opacity-60" : ""}`}
                    onClick={() => handleCardClick(index)}
                  >
                    {card.flipped || card.matched ? card.value : "?"}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              {matchCount === cards.length / 2 ? (
                <p className="w-full text-center text-green-500 font-bold">
                  Congratulations! You've completed the game in {moveCount} moves!
                </p>
              ) : (
                <p className="w-full text-center">Find all matching pairs of wellness symbols</p>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Riddles Game Tab */}
        <TabsContent value="riddles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Brain Teasers</span>
                <span className="text-sm font-normal flex items-center">
                  <Brain className="h-4 w-4 mr-1 text-blue-500" />
                  Score: {riddleScore}
                </span>
              </CardTitle>
              <CardDescription>Test your problem solving with these riddles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-lg font-medium mb-4">{currentRiddle.question}</p>
                
                {showHint && (
                  <div className="p-2 bg-primary/10 rounded mb-4 text-sm">
                    <span className="font-medium">Hint:</span> {currentRiddle.hint}
                  </div>
                )}
                
                {riddleResult === null ? (
                  <div className="space-y-2">
                    <Input
                      value={riddleGuess}
                      onChange={(e) => setRiddleGuess(e.target.value)}
                      placeholder="Type your answer..."
                      className="mb-2"
                      onKeyDown={(e) => e.key === 'Enter' && checkRiddleAnswer()}
                    />
                    <div className="flex gap-2">
                      <Button onClick={checkRiddleAnswer} disabled={!riddleGuess}>
                        Submit Answer
                      </Button>
                      <Button variant="outline" onClick={showRiddleHint}>
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Hint
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-3 rounded ${
                      riddleResult === 'correct' ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                    }`}>
                      {riddleResult === 'correct'
                        ? "That's correct! Well done!"
                        : `The correct answer was: "${currentRiddle.answer}"`}
                    </div>
                    <Button onClick={nextRiddle}>
                      Next Riddle
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
