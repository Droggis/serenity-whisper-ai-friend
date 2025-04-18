
import { useState, useRef, useEffect } from "react";
import { Send, Mic, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageToAI, getApiKey, getStaticResponse } from "@/services/aiService";
import { speakText, stopSpeaking, getVoiceApiKey } from "@/services/voiceService";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Serenity, your AI wellness companion. How are you feeling today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Automatically scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Check if voice API key is available
    setIsVoiceEnabled(!!getVoiceApiKey());
    
    // If AI API key is not set, speak the initial greeting
    if (isVoiceEnabled) {
      handleSpeak(messages[0].text);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setIsProcessing(true);

    try {
      let response: string;

      if (getApiKey()) {
        // Convert messages to format expected by API
        const messageHistory = messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));
        
        response = await sendMessageToAI(userMessage, messageHistory);
      } else {
        // Use static response if no API key
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        response = getStaticResponse();
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      
      // Speak the response if voice is enabled
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
      // Speak the last assistant message
      const lastAssistantMessage = [...messages].reverse().find(msg => !msg.isUser);
      if (lastAssistantMessage) {
        handleSpeak(lastAssistantMessage.text);
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
        
        // TODO: Add proper speech-to-text conversion here
        // For now, we'll just add a placeholder message
        setInput("I'm feeling a bit stressed today");
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop recording after 5 seconds
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
      
      // Stop all tracks on the stream
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
              {message.text}
              {!message.isUser && isVoiceEnabled && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 ml-2 opacity-50 hover:opacity-100"
                  onClick={() => handleSpeak(message.text)}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
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
  );
};
