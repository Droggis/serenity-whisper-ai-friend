
let apiKey: string | null = localStorage.getItem('elevenlabs_api_key');
let audioElement: HTMLAudioElement | null = null;

export const setVoiceApiKey = (key: string) => {
  localStorage.setItem('elevenlabs_api_key', key);
  apiKey = key;
};

export const getVoiceApiKey = () => apiKey;

export const speakText = async (text: string): Promise<void> => {
  if (!apiKey) {
    // Use browser's built-in speech synthesis as fallback
    useFallbackSpeech(text);
    return;
  }

  try {
    stopSpeaking(); // Stop any current audio

    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Voice API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    audioElement = new Audio(audioUrl);
    audioElement.play();
  } catch (error) {
    console.error("Error with ElevenLabs API:", error);
    useFallbackSpeech(text);
  }
};

export const stopSpeaking = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
  
  // Also stop browser speech synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// Fallback using browser's built-in speech synthesis
const useFallbackSpeech = (text: string) => {
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};
