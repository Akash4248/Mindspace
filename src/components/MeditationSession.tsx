import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
} from "lucide-react";
import { MeditationEnvironment } from "@/lib/meditation";

interface FloatingOrbProps {
  position: [number, number, number];
  color: string;
  scale: number;
}

const FloatingOrb = ({ position, color, scale }: FloatingOrbProps) => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} scale={scale}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
};

const Scene3D = ({ environment }: { environment: MeditationEnvironment }) => {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Generate floating orbs based on environment */}
      {Array.from({ length: 8 }, (_, i) => (
        <FloatingOrb
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 3,
            (Math.random() - 0.5) * 10,
          ]}
          color={environment.color}
          scale={0.3 + Math.random() * 0.5}
        />
      ))}

      {/* Central meditation object */}
      <Box position={[0, 0, 0]} scale={[2, 0.1, 2]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

interface MeditationSessionProps {
  environment: MeditationEnvironment;
  duration: number;
  onComplete: () => void;
  onExit: () => void;
}

const MeditationSession = ({
  environment,
  duration,
  onComplete,
  onExit,
}: MeditationSessionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeElapsed < duration * 60) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          if (newTime >= duration * 60) {
            setIsPlaying(false);
            onComplete();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeElapsed, duration, onComplete]);

  const progress = (timeElapsed / (duration * 60)) * 100;
  const remainingTime = Math.max(0, duration * 60 - timeElapsed);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

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

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 5, 8], fov: 60 }}>
          <Scene3D environment={environment} />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-black/20 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {environment.name}
            </h1>
            <p className="text-gray-300">{environment.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-white hover:bg-white/10"
            >
              Exit
            </Button>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="glass-dark border-white/10 p-8 max-w-md w-full mx-4">
            <div className="text-center space-y-6">
              {/* Timer display */}
              <div>
                <div className="text-6xl font-mono font-bold text-white mb-2">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <p className="text-gray-300">
                  {Math.floor(timeElapsed / 60)} of {duration} minutes
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestart}
                  className="text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600 rounded-full w-16 h-16"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStop}
                  className="text-white hover:bg-white/10"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </div>

              {/* Audio controls */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <div className="flex space-x-1">
                  {environment.sounds.map((sound, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                    >
                      {sound.replace("-", " ")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guided text */}
              {isPlaying && (
                <div className="text-center">
                  <p className="text-gray-300 italic">
                    "Take a deep breath and feel yourself becoming one with this
                    peaceful space..."
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Bottom breathing guide */}
        {isPlaying && (
          <div className="pb-8 px-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center animate-pulse-slow">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-mindspace-400 to-violet-400 animate-pulse"></div>
              </div>
              <p className="text-white mt-4">Follow the circle to breathe</p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 w-80">
          <Card className="glass-dark border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">Ambient Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-mindspace-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Voice Guidance</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-mindspace-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Biometric Monitor</span>
                <input type="checkbox" className="accent-mindspace-500" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MeditationSession;
