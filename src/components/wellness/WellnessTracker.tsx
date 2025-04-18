
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { 
  CalendarCheck, 
  LineChart, 
  Smile, 
  Frown, 
  Meh, 
  CheckCircle2,
  HeartPulse,
  Brain,
  Coffee,
  Moon
} from "lucide-react";
import { toast } from "sonner";

type DailyEntry = {
  date: string;
  mood: number;
  sleep: number;
  water: number;
  stress: number;
  exercise: boolean;
  meditation: boolean;
  gratitude: string;
};

const defaultDailyQuestions = [
  "What's one thing you're grateful for today?",
  "What made you smile today?",
  "What's something you're looking forward to?",
  "Who had a positive impact on your day?",
  "What was a small win you had today?",
  "What's something you learned today?",
  "What made you proud of yourself today?"
];

export const WellnessTracker = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  
  const [mood, setMood] = useState<number>(3);
  const [sleep, setSleep] = useState<number>(7);
  const [water, setWater] = useState<number>(4);
  const [stress, setStress] = useState<number>(3);
  const [exercise, setExercise] = useState<boolean>(false);
  const [meditation, setMeditation] = useState<boolean>(false);
  const [gratitude, setGratitude] = useState<string>("");
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState("");
  
  const moods = ["Very Low", "Low", "Neutral", "Good", "Excellent"];

  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem("wellnessEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    // Set random daily question
    setDailyQuestion(
      defaultDailyQuestions[Math.floor(Math.random() * defaultDailyQuestions.length)]
    );
    
    // Check if we already have an entry for today
    const todayEntry = savedEntries 
      ? JSON.parse(savedEntries).find((entry: DailyEntry) => entry.date === today)
      : null;
      
    // If we have an entry for today, load it
    if (todayEntry) {
      setMood(todayEntry.mood);
      setSleep(todayEntry.sleep || 7);
      setWater(todayEntry.water || 4);
      setStress(todayEntry.stress || 3);
      setExercise(todayEntry.exercise || false);
      setMeditation(todayEntry.meditation || false);
      setGratitude(todayEntry.gratitude || "");
    }
  }, []);

  const saveEntry = () => {
    const newEntry: DailyEntry = {
      date: today,
      mood,
      sleep,
      water,
      stress,
      exercise,
      meditation,
      gratitude
    };
    
    // Remove any existing entry for today
    const filteredEntries = entries.filter(entry => entry.date !== today);
    
    // Add new entry
    const newEntries = [...filteredEntries, newEntry];
    setEntries(newEntries);
    
    // Save to localStorage
    localStorage.setItem("wellnessEntries", JSON.stringify(newEntries));
    
    toast.success("Wellness data saved!");
  };

  const getWellnessTip = () => {
    const tips = [
      "Remember to take deep breaths throughout the day. It's a simple but effective way to reduce stress and stay centered.",
      "Try to get at least 7-8 hours of sleep tonight for better mood and cognitive function tomorrow.",
      "Consider a short 5-minute meditation session to clear your mind before bed.",
      "Stay hydrated! Aim for 8 glasses of water today.",
      "Take short movement breaks if you've been sitting for a long time.",
      "Practice gratitude by noting three good things that happened today.",
      "Connect with a friend or loved one today - social connections boost mental health.",
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Tabs defaultValue="track">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="track">Track Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="track" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>How are you feeling today?</Label>
              <div className="flex justify-between gap-2">
                {moods.map((moodText, index) => (
                  <Button
                    key={index}
                    variant={mood === index ? "default" : "outline"}
                    onClick={() => setMood(index)}
                    className="flex-1 flex flex-col items-center py-3"
                  >
                    {index === 0 && <Frown className="mb-1 h-4 w-4" />}
                    {index === 1 && <Frown className="mb-1 h-4 w-4" />}
                    {index === 2 && <Meh className="mb-1 h-4 w-4" />}
                    {index === 3 && <Smile className="mb-1 h-4 w-4" />}
                    {index === 4 && <Smile className="mb-1 h-4 w-4" />}
                    {moodText}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Hours of sleep: {sleep}
              </Label>
              <Slider
                defaultValue={[sleep]}
                min={0}
                max={12}
                step={0.5}
                onValueChange={(value) => setSleep(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Glasses of water: {water}
              </Label>
              <Slider
                defaultValue={[water]}
                min={0}
                max={12}
                step={1}
                onValueChange={(value) => setWater(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Stress level: {["Very Low", "Low", "Moderate", "High", "Very High"][stress]}
              </Label>
              <Slider
                defaultValue={[stress]}
                min={0}
                max={4}
                step={1}
                onValueChange={(value) => setStress(value[0])}
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                variant={exercise ? "default" : "outline"}
                onClick={() => setExercise(!exercise)}
                className="flex-1"
              >
                <HeartPulse className="mr-2 h-4 w-4" />
                Exercise
                {exercise && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
              
              <Button
                variant={meditation ? "default" : "outline"}
                onClick={() => setMeditation(!meditation)}
                className="flex-1"
              >
                <Brain className="mr-2 h-4 w-4" />
                Meditation
                {meditation && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>{dailyQuestion}</Label>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                rows={3}
              />
            </div>
            
            <Button onClick={saveEntry} className="w-full">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Save Today's Entry
            </Button>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Daily Tip</h3>
            <p className="text-sm text-muted-foreground">
              {getWellnessTip()}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Your Wellness History</h3>
            <Button variant="outline" size="sm">
              <LineChart className="h-4 w-4 mr-2" />
              View Trends
            </Button>
          </div>
          
          {entries.length > 0 ? (
            <div className="space-y-4">
              {[...entries].reverse().slice(0, 7).map((entry, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="flex items-center">
                      {entry.mood <= 1 && <Frown className="h-4 w-4 mr-1" />}
                      {entry.mood === 2 && <Meh className="h-4 w-4 mr-1" />}
                      {entry.mood >= 3 && <Smile className="h-4 w-4 mr-1" />}
                      {moods[entry.mood]}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>Sleep: {entry.sleep}h</div>
                    <div>Water: {entry.water}</div>
                    <div>Stress: {["Very Low", "Low", "Moderate", "High", "Very High"][entry.stress]}</div>
                  </div>
                  {entry.gratitude && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Reflection:</span> {entry.gratitude}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No entries yet. Start tracking your wellness today!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
