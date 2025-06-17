import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ARVRController, {
  BiometricData,
  ARVRCapabilities,
} from "@/lib/arvrController";
import { MeditationEnvironment } from "@/lib/meditation";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  Camera,
  Eye,
  Heart,
  Activity,
  Waves,
  Maximize,
  Minimize,
  Smartphone,
  Monitor,
  Headphones,
} from "lucide-react";

interface ImmersiveMeditationSessionProps {
  environment: MeditationEnvironment;
  duration: number;
  onComplete: () => void;
  onExit: () => void;
}

interface SessionMetrics {
  heartRate: number;
  stressLevel: number;
  breathingRate: number;
  focusScore: number;
  mindfulnessLevel: number;
}

const ImmersiveMeditationSession = ({
  environment,
  duration,
  onComplete,
  onExit,
}: ImmersiveMeditationSessionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arvrControllerRef = useRef<ARVRController | null>(null);
  const { toast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [capabilities, setCapabilities] = useState<ARVRCapabilities | null>(
    null,
  );
  const [biometrics, setBiometrics] = useState<BiometricData | null>(null);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    heartRate: 72,
    stressLevel: 45,
    breathingRate: 16,
    focusScore: 85,
    mindfulnessLevel: 78,
  });

  useEffect(() => {
    if (containerRef.current) {
      const controller = new ARVRController();
      arvrControllerRef.current = controller;
      setCapabilities(controller.getCapabilities());

      // Start biometric simulation
      controller.startBiometricSimulation((data) => {
        setBiometrics(data);
        setSessionMetrics((prev) => ({
          heartRate: data.heartRate,
          stressLevel: data.stressLevel,
          breathingRate: data.breathingRate,
          focusScore: Math.max(
            0,
            Math.min(100, prev.focusScore + (Math.random() - 0.5) * 10),
          ),
          mindfulnessLevel: Math.max(
            0,
            Math.min(100, prev.mindfulnessLevel + (Math.random() - 0.5) * 5),
          ),
        }));
      });

      // Create meditation environment
      controller.createMeditationEnvironment(environment.id);
    }

    return () => {
      arvrControllerRef.current?.stopARVR();
    };
  }, [environment.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeElapsed < duration * 60) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          if (newTime >= duration * 60) {
            setIsPlaying(false);
            handleSessionComplete();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeElapsed, duration]);

  const handleSessionComplete = () => {
    toast({
      title: "Meditation Complete! 🧘‍♀️",
      description: `You've completed a ${duration}-minute session in ${environment.name}. Great job!`,
    });
    onComplete();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeElapsed(0);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setTimeElapsed(0);
  };

  const toggleAR = async () => {
    if (!arvrControllerRef.current || !containerRef.current) return;

    if (isARMode) {
      arvrControllerRef.current.stopARVR();
      setIsARMode(false);
      toast({
        title: "AR Mode Disabled",
        description: "Switched back to standard view",
      });
    } else {
      try {
        const success = await arvrControllerRef.current.startARMode(
          containerRef.current,
        );
        if (success) {
          setIsARMode(true);
          setIsVRMode(false);
          toast({
            title: "AR Mode Activated! 📱",
            description: "Move your device to explore the meditation space",
          });
        }
      } catch (error) {
        toast({
          title: "AR Not Available",
          description: "Camera access required for AR mode",
          variant: "destructive",
        });
      }
    }
  };

  const toggleVR = async () => {
    if (!arvrControllerRef.current || !containerRef.current) return;

    if (isVRMode) {
      arvrControllerRef.current.stopARVR();
      setIsVRMode(false);
      toast({
        title: "VR Mode Disabled",
        description: "Switched back to standard view",
      });
    } else {
      const success = await arvrControllerRef.current.startVRMode(
        containerRef.current,
      );
      if (success) {
        setIsVRMode(true);
        setIsARMode(false);
        setIsFullscreen(true);
        toast({
          title: "VR Mode Activated! 🥽",
          description: "Use mouse/touch to look around the virtual space",
        });
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const progress = (timeElapsed / (duration * 60)) * 100;
  const remainingTime = Math.max(0, duration * 60 - timeElapsed);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const getStressColor = (level: number) => {
    if (level < 30) return "text-emerald-400";
    if (level < 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getHeartRateColor = (rate: number) => {
    if (rate < 70) return "text-blue-400";
    if (rate < 90) return "text-emerald-400";
    if (rate < 110) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden"
    >
      {/* AR/VR Mode Indicators */}
      {(isARMode || isVRMode) && (
        <div className="absolute top-4 left-4 z-50 flex space-x-2">
          {isARMode && (
            <Badge className="bg-emerald-500 text-white">
              <Camera className="h-4 w-4 mr-2" />
              AR Active
            </Badge>
          )}
          {isVRMode && (
            <Badge className="bg-blue-500 text-white">
              <Eye className="h-4 w-4 mr-2" />
              VR Active
            </Badge>
          )}
        </div>
      )}

      {/* Top Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/60 to-transparent p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {environment.name}
            </h1>
            <p className="text-gray-300 text-sm">{environment.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {capabilities?.hasCamera && (
              <Button
                variant={isARMode ? "default" : "ghost"}
                size="sm"
                onClick={toggleAR}
                className="text-white hover:bg-white/20"
              >
                <Camera className="h-4 w-4 mr-2" />
                AR
              </Button>
            )}
            {capabilities?.hasWebXR && (
              <Button
                variant={isVRMode ? "default" : "ghost"}
                size="sm"
                onClick={toggleVR}
                className="text-white hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                VR
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-white hover:bg-white/20"
            >
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Biometric Display */}
      <div className="absolute top-20 right-6 z-40 space-y-2">
        {biometrics && (
          <>
            <Card className="glass-dark border-white/10 p-3">
              <div className="flex items-center space-x-2">
                <Heart
                  className={`h-4 w-4 ${getHeartRateColor(biometrics.heartRate)}`}
                />
                <span className="text-white text-sm font-medium">
                  {Math.round(biometrics.heartRate)} BPM
                </span>
              </div>
            </Card>
            <Card className="glass-dark border-white/10 p-3">
              <div className="flex items-center space-x-2">
                <Activity
                  className={`h-4 w-4 ${getStressColor(biometrics.stressLevel)}`}
                />
                <span className="text-white text-sm font-medium">
                  Stress: {Math.round(biometrics.stressLevel)}%
                </span>
              </div>
            </Card>
            <Card className="glass-dark border-white/10 p-3">
              <div className="flex items-center space-x-2">
                <Waves className="h-4 w-4 text-blue-400" />
                <span className="text-white text-sm font-medium">
                  {Math.round(biometrics.breathingRate)}/min
                </span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Main Control Interface */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-dark border-white/10 p-6">
            <div className="text-center space-y-4">
              {/* Timer Display */}
              <div>
                <div className="text-6xl font-mono font-bold text-white mb-2">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </div>
                <Progress value={progress} className="h-3 mb-2" />
                <p className="text-gray-300 text-sm">
                  {Math.floor(timeElapsed / 60)} of {duration} minutes
                </p>
              </div>

              {/* Session Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-300">Focus Score</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {Math.round(sessionMetrics.focusScore)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-300">Mindfulness</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.round(sessionMetrics.mindfulnessLevel)}%
                  </p>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex justify-center items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestart}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-full w-20 h-20"
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10" />
                  ) : (
                    <Play className="h-10 w-10" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStop}
                  className="text-white hover:bg-white/20"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </div>

              {/* Audio Controls */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <div className="flex space-x-1">
                  {environment.sounds.map((sound, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-white/10 text-gray-300"
                    >
                      {sound.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Headphones className="h-5 w-5" />
                </Button>
              </div>

              {/* Guided Instructions */}
              {isPlaying && (
                <div className="text-center mt-6">
                  <p className="text-gray-200 text-sm italic leading-relaxed">
                    "Take a deep breath and feel yourself becoming one with this
                    peaceful space. Allow your thoughts to drift like clouds
                    across the sky of your consciousness..."
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Breathing Guide */}
      {isPlaying && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400/50 to-blue-400/50 animate-pulse"></div>
          </div>
          <p className="text-white text-center mt-4 text-sm">
            Follow the circle to breathe
          </p>
        </div>
      )}

      {/* Advanced Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 w-80 z-50">
          <Card className="glass-dark border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Advanced Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Environment Intensity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Ambient Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="60"
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Voice Guidance
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="w-full accent-purple-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    Biometric Monitoring
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Motion Tracking</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Eye Tracking</span>
                  <input type="checkbox" className="accent-purple-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Haptic Feedback</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-yellow-500"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Device Capabilities Info */}
      {capabilities && (
        <div className="absolute bottom-6 left-6 z-40">
          <div className="flex space-x-2">
            {capabilities.hasCamera && (
              <Badge
                variant="secondary"
                className="bg-emerald-500/20 text-emerald-300"
              >
                <Camera className="h-3 w-3 mr-1" />
                Camera
              </Badge>
            )}
            {capabilities.hasWebXR && (
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-blue-300"
              >
                <Eye className="h-3 w-3 mr-1" />
                WebXR
              </Badge>
            )}
            {capabilities.hasDeviceMotion && (
              <Badge
                variant="secondary"
                className="bg-purple-500/20 text-purple-300"
              >
                <Smartphone className="h-3 w-3 mr-1" />
                Motion
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmersiveMeditationSession;
