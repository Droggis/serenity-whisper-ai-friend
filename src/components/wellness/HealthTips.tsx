
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllHealthTips, getRandomHealthTip } from "@/services/gamesService";
import { Dices, Heart, Bookmark, BookmarkCheck, Filter } from "lucide-react";

export const HealthTips = () => {
  const [tips, setTips] = useState<string[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [currentTip, setCurrentTip] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  
  useEffect(() => {
    // Get all tips
    setTips(getAllHealthTips());
    
    // Get a random tip to start
    setCurrentTip(getRandomHealthTip());
    
    // Load saved tips from localStorage
    const saved = localStorage.getItem("savedHealthTips");
    if (saved) {
      setSavedTips(JSON.parse(saved));
    }
  }, []);
  
  const getNewTip = () => {
    setCurrentTip(getRandomHealthTip());
  };
  
  const saveTip = () => {
    if (!savedTips.includes(currentTip)) {
      const newSavedTips = [...savedTips, currentTip];
      setSavedTips(newSavedTips);
      localStorage.setItem("savedHealthTips", JSON.stringify(newSavedTips));
    }
  };
  
  const removeSavedTip = (tip: string) => {
    const newSavedTips = savedTips.filter(t => t !== tip);
    setSavedTips(newSavedTips);
    localStorage.setItem("savedHealthTips", JSON.stringify(newSavedTips));
  };
  
  const categories = [
    "Nutrition", "Exercise", "Sleep", "Mental Health", "Hydration", "Posture", "Mindfulness"
  ];
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Categories
              </CardTitle>
              <CardDescription>Filter tips by topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map(category => (
                <Badge key={category} variant="outline" className="mr-2 mb-2 cursor-pointer">
                  {category}
                </Badge>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowSaved(!showSaved)}
                className="text-primary flex items-center"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {showSaved ? "Show Random Tips" : `View Saved Tips (${savedTips.length})`}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-4">
          {!showSaved ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Daily Health Tip
                  </span>
                </CardTitle>
                <CardDescription>Simple ways to improve your wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg mb-4 text-lg">
                  "{currentTip}"
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={getNewTip}>
                  <Dices className="h-4 w-4 mr-2" />
                  New Tip
                </Button>
                
                <Button onClick={saveTip} disabled={savedTips.includes(currentTip)}>
                  {savedTips.includes(currentTip) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save This Tip
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookmarkCheck className="h-5 w-5 mr-2 text-primary" />
                  Your Saved Tips
                </CardTitle>
                <CardDescription>Tips you've saved for future reference</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {savedTips.length > 0 ? (
                  <div className="space-y-3">
                    {savedTips.map((tip, index) => (
                      <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="pr-3">"{tip}"</div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSavedTip(tip)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    You haven't saved any tips yet.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
