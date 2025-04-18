
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const WellnessTracker = () => {
  const [mood, setMood] = useState<number>(3);
  const moods = ["Very Low", "Low", "Neutral", "Good", "Excellent"];

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Label>How are you feeling today?</Label>
        <div className="flex justify-between gap-2">
          {moods.map((moodText, index) => (
            <Button
              key={index}
              variant={mood === index ? "default" : "outline"}
              onClick={() => setMood(index)}
              className="flex-1"
            >
              {moodText}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Daily Tip</h3>
        <p className="text-sm text-muted-foreground">
          Remember to take deep breaths throughout the day. It's a simple but
          effective way to reduce stress and stay centered.
        </p>
      </div>
    </div>
  );
};
