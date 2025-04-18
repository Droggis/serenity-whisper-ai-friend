
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRandomReflectionQuestion } from "@/services/gamesService";
import { CalendarIcon, Save, Book, PenLine } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface DiaryEntryData {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number;
  reflectionQuestion?: string;
  reflectionAnswer?: string;
}

export const DiaryEntry = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntryData>({
    id: crypto.randomUUID(),
    date: today,
    title: "",
    content: "",
    mood: 3,
    reflectionQuestion: getRandomReflectionQuestion(),
    reflectionAnswer: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    // Check if we already have an entry for today
    const todayEntry = savedEntries 
      ? JSON.parse(savedEntries).find((entry: DiaryEntryData) => entry.date === today)
      : null;
      
    // If we have an entry for today, load it
    if (todayEntry) {
      setCurrentEntry(todayEntry);
      setIsEditing(true);
    }
  }, []);
  
  const saveEntry = () => {
    if (!currentEntry.title.trim()) {
      toast.error("Please add a title for your entry");
      return;
    }
    
    if (!currentEntry.content.trim()) {
      toast.error("Please write something in your diary entry");
      return;
    }
    
    const entryToSave = {
      ...currentEntry,
      date: today
    };
    
    // Remove any existing entry for today
    const filteredEntries = entries.filter(entry => entry.date !== today);
    
    // Add new entry
    const newEntries = [...filteredEntries, entryToSave];
    setEntries(newEntries);
    
    // Save to localStorage
    localStorage.setItem("diaryEntries", JSON.stringify(newEntries));
    
    setIsEditing(true);
    toast.success("Diary entry saved!");
  };
  
  const createNewEntry = () => {
    setCurrentEntry({
      id: crypto.randomUUID(),
      date: today,
      title: "",
      content: "",
      mood: 3,
      reflectionQuestion: getRandomReflectionQuestion(),
      reflectionAnswer: ""
    });
    setIsEditing(false);
  };
  
  const viewEntry = (entry: DiaryEntryData) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };
  
  const moodEmojis = ["😔", "😐", "🙂", "😊", "😁"];
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-5">
        {/* Previous Entries Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Book className="h-4 w-4 mr-2" />
                Your Diary
              </CardTitle>
              <CardDescription>Capture your thoughts and feelings</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={createNewEntry}
              >
                <PenLine className="h-4 w-4 mr-2" />
                Write new entry
              </Button>
              
              {entries.length > 0 ? (
                [...entries]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(entry => (
                    <Button
                      key={entry.id}
                      variant="ghost"
                      className={`w-full justify-start ${entry.date === currentEntry.date && isEditing ? "bg-muted" : ""}`}
                      onClick={() => viewEntry(entry)}
                    >
                      <div className="flex flex-col items-start text-left">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <span>{moodEmojis[entry.mood]}</span>
                        </div>
                        <span className="truncate max-w-[180px]">{entry.title}</span>
                      </div>
                    </Button>
                  ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No entries yet. Start writing!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Entry Area */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {isEditing ? (
                    <span>
                      {new Date(currentEntry.date).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>New Entry</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {moodEmojis.map((emoji, idx) => (
                    <Button
                      key={idx}
                      variant={currentEntry.mood === idx ? "default" : "ghost"}
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentEntry({...currentEntry, mood: idx})}
                      disabled={isEditing && currentEntry.date !== today}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                  placeholder="Enter a title for your entry..."
                  disabled={isEditing && currentEntry.date !== today}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Journal Entry</Label>
                <Textarea
                  id="content"
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                  placeholder="Write your thoughts here..."
                  rows={8}
                  disabled={isEditing && currentEntry.date !== today}
                />
              </div>
              
              <div className="border-t pt-4">
                <Label htmlFor="reflection">
                  Daily Reflection: {currentEntry.reflectionQuestion}
                </Label>
                <Textarea
                  id="reflection"
                  value={currentEntry.reflectionAnswer || ""}
                  onChange={(e) => setCurrentEntry({...currentEntry, reflectionAnswer: e.target.value})}
                  placeholder="Reflect on this question..."
                  rows={3}
                  disabled={isEditing && currentEntry.date !== today}
                />
              </div>
            </CardContent>
            
            {(!isEditing || currentEntry.date === today) && (
              <CardFooter>
                <Button onClick={saveEntry} className="ml-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
