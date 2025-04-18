
import { useState, useRef, useEffect } from "react";
import { Send, Mic, Volume2, VolumeX, Loader2, Gamepad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageToAI, getApiKey, getStaticResponse } from "@/services/aiService";
import { speakText, stopSpeaking, getVoiceApiKey } from "@/services/voiceService";
import { getRandomQuestion, checkAnswer, getWordToGuess, getRandomRiddle } from "@/services/gamesService";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
  role: "system" | "user" | "assistant";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! I'm Serenity, your AI wellness companion. How are you feeling today?", 
      isUser: false, 
      role: "system",
      content: "Hello! I'm Serenity, your AI wellness companion. How are you feeling today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [currentGame, setCurrentGame] = useState<{
    type: "trivia" | "word-guess" | "riddles" | null;
    question?: any;
    word?: string;
    riddle?: any;
  }>({ type: null });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setIsVoiceEnabled(!!getVoiceApiKey());
    
    if (isVoiceEnabled) {
      handleSpeak(messages[0].content);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { 
      text: userMessage, 
      isUser: true, 
      role: "user",
      content: userMessage 
    }]);
    setInput("");
    setIsProcessing(true);

    try {
      let response: string;

      if (currentGame.type === "trivia" && currentGame.question) {
        if (checkAnswer(currentGame.question, userMessage)) {
          response = "🎉 Correct! Well done! Would you like another question? Just say 'play trivia'!";
        } else {
          response = `Sorry, that's not correct. The right answer was ${currentGame.question.correctAnswer}. Want to try another? Say 'play trivia'!`;
        }
        setCurrentGame({ type: null });
      } else if (currentGame.type === "word-guess" && currentGame.word) {
        if (userMessage.toLowerCase() === currentGame.word.toLowerCase()) {
          response = "🎉 You got it! That's the correct word! Want to play again? Just say 'play word guess'!";
          setCurrentGame({ type: null });
        } else {
          response = `Not quite! Here's another hint: ${currentGame.word.split('').map((letter: string, idx: number) => 
            idx === 0 || currentGame.word[idx] === userMessage[idx] ? letter : '_').join('')}`;
        }
      } else if (currentGame.type === "riddles" && currentGame.riddle) {
        if (userMessage.toLowerCase() === currentGame.riddle.answer.toLowerCase()) {
          response = "🎉 That's correct! You solved the riddle! Want another one? Just say 'play riddles'!";
          setCurrentGame({ type: null });
        } else if (userMessage.toLowerCase().includes("hint")) {
          response = `Here's a hint: ${currentGame.riddle.hint}`;
        } else {
          response = `That's not it. Would you like a hint? Just ask for one, or try another guess!`;
        }
      } else {
        const gameResponse = handleGameCommand(userMessage);
        if (gameResponse) {
          response = gameResponse;
        } else if (getApiKey()) {
          const messageHistory = messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          
          response = await sendMessageToAI(userMessage, messageHistory);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
          response = getStaticResponse();
        }
      }

      setMessages(prev => [...prev, { 
        text: response, 
        isUser: false, 
        role: "assistant",
        content: response 
      }]);
      
      if (isVoiceEnabled) {
        handleSpeak(response);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!isVoiceEnabled) {
      toast.error("Voice is not enabled. Please add your ElevenLabs API key in settings.");
      return;
    }
    
    setIsSpeaking(true);
    speakText(text).finally(() => {
      setIsSpeaking(false);
    });
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(msg => !msg.isUser);
      if (lastAssistantMessage) {
        handleSpeak(lastAssistantMessage.content);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        
        setInput("I'm feeling a bit stressed today");
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording();
        }
      }, 5000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Unable to access microphone. Please check your settings.");
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleGameCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage === "play trivia" || lowerMessage === "let's play trivia") {
      const question = getRandomQuestion();
      setCurrentGame({ type: "trivia", question });
      return `Let's play trivia! 🎮\n\n${question.question}\n\nOptions:\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}\n\nJust type your answer!`;
    }
    
    if (lowerMessage === "play word guess" || lowerMessage === "let's play word guess") {
      const word = getWordToGuess();
      setCurrentGame({ type: "word-guess", word });
      return `Let's play Word Guess! 🎯\nI'm thinking of a wellness-related word with ${word.length} letters.\nTry to guess it! Here's your hint: ${word.charAt(0)}${'_'.repeat(word.length - 1)}`;
    }
    
    if (lowerMessage === "play riddles" || lowerMessage === "let's play riddles") {
      const riddle = getRandomRiddle();
      setCurrentGame({ type: "riddles", riddle });
      return `Let's play Riddles! 🧩\n\n${riddle.question}\n\nType your answer or ask for a hint!`;
    }
    
    if (lowerMessage === "list games" || lowerMessage === "what games can we play") {
      return `I can play these games with you:\n
1. Trivia - test your knowledge with multiple choice questions! Say "play trivia"
2. Word Guess - guess the wellness-related word! Say "play word guess" 
3. Riddles - solve fun brain teasers! Say "play riddles"
4. Memory Match - find matching pairs (available in the Games tab)`;
    }
    
    return null;
  };

  const startGame = (gameType: string) => {
    setInput(`play ${gameType}`);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
              {!message.isUser && isVoiceEnabled && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 ml-2 opacity-50 hover:opacity-100"
                  onClick={() => handleSpeak(message.content)}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-none">
        <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => startGame("trivia")}
          >
            Play Trivia
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => startGame("word guess")}
          >
            Word Guess
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => startGame("riddles")}
          >
            Riddles
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInput("Tell me a health tip")}
          >
            Health Tip
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setInput("list games")}
            title="Games"
          >
            <Gamepad className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleMicClick}
            className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          {isVoiceEnabled && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleSpeaking}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          )}
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isProcessing}
          />
          <Button onClick={handleSend} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
