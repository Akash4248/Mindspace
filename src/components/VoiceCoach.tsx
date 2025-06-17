import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Activity } from "lucide-react";

interface VoiceCoachProps {
  isActive: boolean;
  onVoiceAnalysis: (analysis: VoiceAnalysis) => void;
  environment: string;
  sessionDuration: number;
}

interface VoiceAnalysis {
  stressLevel: number;
  breathingRate: number;
  emotionalState: "calm" | "anxious" | "neutral" | "peaceful";
  voiceStability: number;
  backgroundNoise: number;
}

const VoiceCoach = ({
  isActive,
  onVoiceAnalysis,
  environment,
  sessionDuration,
}: VoiceCoachProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState("");
  const [voiceAnalysis, setVoiceAnalysis] = useState<VoiceAnalysis | null>(
    null,
  );
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const guidanceTexts = {
    "forest-sanctuary": [
      "Feel the gentle breeze rustling through the leaves around you.",
      "Breathe in the fresh forest air, and let nature's energy fill your lungs.",
      "Imagine roots growing from your feet, connecting you to the earth.",
      "Listen to the peaceful sounds of flowing water in the distance.",
      "Feel completely safe and protected in this natural sanctuary.",
    ],
    "crystal-cave": [
      "Allow the crystal energy to flow through your body, cleansing and healing.",
      "Visualize brilliant light emanating from the crystals, surrounding you with peace.",
      "Feel the ancient wisdom of the earth supporting your meditation.",
      "Let the harmonic vibrations of the crystals align your chakras.",
      "Experience the profound stillness found deep within the earth.",
    ],
    "ocean-depths": [
      "Let the rhythm of the waves guide your breathing naturally.",
      "Feel yourself floating peacefully in the vast, gentle ocean.",
      "Allow the water to wash away all tension and stress from your body.",
      "Connect with the ancient wisdom of the sea.",
      "Feel the supportive embrace of the ocean surrounding you completely.",
    ],
    "space-nebula": [
      "Expand your consciousness into the infinite cosmos around you.",
      "Feel yourself floating weightlessly among the stars.",
      "Let the cosmic energy fill you with wonder and perspective.",
      "Connect with the vastness of the universe and your place within it.",
      "Experience the profound peace of infinite space.",
    ],
    "zen-garden": [
      "Feel the simplicity and order of this peaceful space.",
      "Let go of complexity and find beauty in minimalism.",
      "Breathe with the rhythm of the bamboo fountain.",
      "Feel the careful balance and harmony in every element around you.",
      "Experience the deep tranquility that comes from mindful simplicity.",
    ],
  };

  useEffect(() => {
    if (isActive) {
      startVoiceCoaching();
    } else {
      stopVoiceCoaching();
    }

    return () => {
      stopVoiceCoaching();
    };
  }, [isActive]);

  const startVoiceCoaching = async () => {
    try {
      // Request microphone access for voice analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      source.connect(analyserRef.current);

      // Setup media recorder for voice analysis
      mediaRecorderRef.current = new MediaRecorder(stream);

      setIsListening(true);
      startAudioAnalysis();
      startGuidedSession();
    } catch (error) {
      console.error("Voice coaching unavailable:", error);
      // Continue with guidance only
      startGuidedSession();
    }
  };

  const stopVoiceCoaching = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  const startAudioAnalysis = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      if (!analyserRef.current || !isListening) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate audio level
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      setAudioLevel(average);

      // Analyze voice characteristics (simplified simulation)
      const analysis: VoiceAnalysis = {
        stressLevel: Math.max(0, 100 - average * 2), // Higher audio = lower stress
        breathingRate: 12 + Math.random() * 8, // 12-20 breaths per minute
        emotionalState:
          average > 50 ? "calm" : average > 30 ? "neutral" : "anxious",
        voiceStability: Math.min(100, average * 3),
        backgroundNoise: Math.random() * 30,
      };

      setVoiceAnalysis(analysis);
      onVoiceAnalysis(analysis);

      requestAnimationFrame(analyze);
    };

    analyze();
  };

  const startGuidedSession = () => {
    const texts =
      guidanceTexts[environment as keyof typeof guidanceTexts] ||
      guidanceTexts["zen-garden"];

    let currentIndex = 0;
    const speakGuidance = () => {
      if (!isActive) return;

      const text = texts[currentIndex % texts.length];
      setCurrentGuidance(text);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        utterance.volume = 0.8;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          currentIndex++;

          // Schedule next guidance
          setTimeout(speakGuidance, 30000 + Math.random() * 20000); // 30-50 seconds
        };

        speechSynthesisRef.current = utterance;
        speechSynthesis.speak(utterance);
      } else {
        // Fallback for browsers without speech synthesis
        setTimeout(() => {
          currentIndex++;
          speakGuidance();
        }, 45000);
      }
    };

    // Start first guidance after a short delay
    setTimeout(speakGuidance, 5000);
  };

  const toggleListening = () => {
    if (isListening) {
      stopVoiceCoaching();
    } else {
      startVoiceCoaching();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (speechSynthesisRef.current) {
      speechSynthesis.speak(speechSynthesisRef.current);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-20 left-6 right-6 z-40 max-w-md mx-auto">
      <Card className="glass-dark border-white/10 p-4">
        <div className="space-y-4">
          {/* Voice Analysis Display */}
          {voiceAnalysis && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-300">Stress Level</p>
                <Progress
                  value={100 - voiceAnalysis.stressLevel}
                  className="h-2 mt-1"
                />
                <p className="text-xs text-emerald-400 mt-1">
                  {voiceAnalysis.emotionalState.toUpperCase()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-300">Breathing</p>
                <div className="flex items-center justify-center mt-1">
                  <Activity className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-white">
                    {Math.round(voiceAnalysis.breathingRate)}/min
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Audio Level Indicator */}
          {isListening && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-1 h-6 rounded-full transition-colors ${
                      audioLevel > i * 20 ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300">
                Listening
              </Badge>
            </div>
          )}

          {/* Current Guidance */}
          {currentGuidance && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-200 text-sm italic leading-relaxed">
                "{currentGuidance}"
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              className={`text-white hover:bg-white/20 ${
                isListening ? "bg-emerald-500/20" : ""
              }`}
            >
              {isListening ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSpeech}
              className={`text-white hover:bg-white/20 ${
                isSpeaking ? "bg-blue-500/20" : ""
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Breathing Cue */}
          {voiceAnalysis && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-blue-400/30 flex items-center justify-center">
                <div
                  className="w-10 h-10 rounded-full bg-blue-400/50 animate-pulse"
                  style={{
                    animationDuration: `${60 / voiceAnalysis.breathingRate}s`,
                  }}
                />
              </div>
              <p className="text-xs text-blue-300 mt-2">
                Breathe with the circle
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VoiceCoach;
