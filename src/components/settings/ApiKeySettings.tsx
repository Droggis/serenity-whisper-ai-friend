
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setApiKey, getApiKey } from "@/services/aiService";
import { setVoiceApiKey, getVoiceApiKey } from "@/services/voiceService";
import { toast } from "sonner";

export const ApiKeySettings = () => {
  const [perplexityKey, setPerplexityKey] = useState(getApiKey() || "");
  const [elevenLabsKey, setElevenLabsKey] = useState(getVoiceApiKey() || "");
  const [showKeys, setShowKeys] = useState(false);

  const handleSavePerplexity = () => {
    if (!perplexityKey.trim()) {
      toast.error("Please enter a valid Perplexity API key");
      return;
    }

    setApiKey(perplexityKey);
    toast.success("Perplexity API key saved");
  };

  const handleSaveElevenLabs = () => {
    if (!elevenLabsKey.trim()) {
      toast.error("Please enter a valid ElevenLabs API key");
      return;
    }

    setVoiceApiKey(elevenLabsKey);
    toast.success("ElevenLabs API key saved");
  };

  return (
    <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
      <h3 className="text-lg font-medium">API Keys</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="perplexity-key">Perplexity API Key</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => setShowKeys(!showKeys)}
            >
              {showKeys ? "Hide" : "Show"}
            </Button>
          </div>
          <Input
            id="perplexity-key"
            value={perplexityKey}
            onChange={(e) => setPerplexityKey(e.target.value)}
            type={showKeys ? "text" : "password"}
            placeholder="Enter your Perplexity API key"
          />
          <Button size="sm" onClick={handleSavePerplexity}>Save Perplexity Key</Button>
          <p className="text-xs text-muted-foreground mt-1">
            Get your API key from <a href="https://www.perplexity.ai/api" target="_blank" rel="noreferrer" className="underline">Perplexity</a>
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
          <Input
            id="elevenlabs-key"
            value={elevenLabsKey}
            onChange={(e) => setElevenLabsKey(e.target.value)}
            type={showKeys ? "text" : "password"}
            placeholder="Enter your ElevenLabs API key"
          />
          <Button size="sm" onClick={handleSaveElevenLabs}>Save ElevenLabs Key</Button>
          <p className="text-xs text-muted-foreground mt-1">
            Get your API key from <a href="https://elevenlabs.io/speech-synthesis" target="_blank" rel="noreferrer" className="underline">ElevenLabs</a>
          </p>
        </div>
      </div>
    </div>
  );
};
