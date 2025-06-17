import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import ImmersiveMeditationSession from "@/components/ImmersiveMeditationSession";
import {
  MEDITATION_ENVIRONMENTS,
  MeditationEnvironment,
} from "@/lib/meditation";
import { apiService } from "@/lib/api";
import {
  ArrowLeft,
  Clock,
  Star,
  Play,
  Users,
  Target,
  Heart,
  Brain,
  Sparkles,
  Moon,
} from "lucide-react";

const MeditationSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateMeditationStats } = useAuthStore();
  const { toast } = useToast();

  const [environment, setEnvironment] = useState<MeditationEnvironment | null>(
    null,
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showPreSession, setShowPreSession] = useState(true);
  const [moodBefore, setMoodBefore] = useState<number>(7);
  const [selectedGoal, setSelectedGoal] = useState<string>("relaxation");

  useEffect(() => {
    if (id) {
      const env = MEDITATION_ENVIRONMENTS.find((e) => e.id === id);
      if (env) {
        setEnvironment(env);
        setSelectedDuration(env.duration[1] || 10);
      } else {
        navigate("/environments");
      }
    }
  }, [id, navigate]);

  const handleStartSession = async () => {
    if (!environment || !user) return;

    try {
      // Log session start
      await apiService.startSession(environment.id);

      setShowPreSession(false);
      setSessionStarted(true);

      toast({
        title: "Session Started! 🧘‍♀️",
        description: `Beginning ${selectedDuration}-minute session in ${environment.name}`,
      });
    } catch (error) {
      toast({
        title: "Error starting session",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSessionComplete = async () => {
    if (!environment || !user) return;

    try {
      // Update user stats
      const newStats = {
        totalSessions: user.meditationStats.totalSessions + 1,
        totalMinutes: user.meditationStats.totalMinutes + selectedDuration,
        streakDays: user.meditationStats.streakDays + 1,
        currentLevel:
          Math.floor(
            (user.meditationStats.totalMinutes + selectedDuration) / 120,
          ) + 1,
      };

      updateMeditationStats(newStats);

      // Log session completion
      await apiService.completeSession({
        environmentId: environment.id,
        duration: selectedDuration,
        completedAt: new Date(),
        moodBefore,
        moodAfter: 8, // Assume improvement after meditation
      });

      toast({
        title: "Meditation Complete! ✨",
        description: `Great job! You've completed a ${selectedDuration}-minute session.`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing session:", error);
      navigate("/dashboard");
    }
  };

  const handleExit = () => {
    if (sessionStarted) {
      const confirmExit = window.confirm(
        "Are you sure you want to exit the session?",
      );
      if (!confirmExit) return;
    }
    navigate("/environments");
  };

  if (!environment) {
    return (
      <div className="min-h-screen gradient-bg-dark flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="mt-4">Loading meditation environment...</p>
        </div>
      </div>
    );
  }

  if (sessionStarted && !showPreSession) {
    return (
      <ImmersiveMeditationSession
        environment={environment}
        duration={selectedDuration}
        onComplete={handleSessionComplete}
        onExit={handleExit}
      />
    );
  }

  const goals = [
    {
      id: "relaxation",
      label: "Stress Relief",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      id: "focus",
      label: "Improve Focus",
      icon: <Target className="h-5 w-5" />,
    },
    { id: "sleep", label: "Better Sleep", icon: <Moon className="h-5 w-5" /> },
    {
      id: "mindfulness",
      label: "Mindfulness",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: "anxiety",
      label: "Reduce Anxiety",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      id: "creativity",
      label: "Boost Creativity",
      icon: <Sparkles className="h-5 w-5" />,
    },
  ];

  const moodEmojis = [
    "😢",
    "😔",
    "😐",
    "🙂",
    "😊",
    "😄",
    "🤗",
    "😍",
    "🤩",
    "✨",
  ];

  return (
    <div className="min-h-screen gradient-bg-dark">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={handleExit}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Environments
            </Button>
            {environment.isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Environment Preview */}
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={`https://images.unsplash.com/photo-${
                environment.id === "forest-sanctuary"
                  ? "1441974231531-c6227db76b6e"
                  : environment.id === "crystal-cave"
                    ? "1518837695005-2083093ee35b"
                    : environment.id === "ocean-depths"
                      ? "1439066615861-d1dafdf576b9"
                      : environment.id === "space-nebula"
                        ? "1446776653964-20c1d3a81b86"
                        : environment.id === "zen-garden"
                          ? "1540979388789-6cee28a1cdc9"
                          : "1506905925346-21bda4d32df4"
              }?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`}
              alt={environment.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{environment.name}</h1>
              <p className="text-gray-200 max-w-2xl">
                {environment.description}
              </p>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">4.8 (1.2k reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-400 mr-1" />
                  <span className="text-sm">8.5k sessions today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Duration Selection */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Session Duration
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {environment.duration.map((duration) => (
                  <Button
                    key={duration}
                    variant={
                      selectedDuration === duration ? "default" : "outline"
                    }
                    onClick={() => setSelectedDuration(duration)}
                    className={
                      selectedDuration === duration
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "border-white/20 text-white hover:bg-white/10"
                    }
                  >
                    {duration}m
                  </Button>
                ))}
              </div>
              <p className="text-gray-300 text-sm mt-4">
                Recommended for{" "}
                {selectedDuration < 15
                  ? "beginners"
                  : selectedDuration < 25
                    ? "intermediate"
                    : "advanced"}{" "}
                practitioners
              </p>
            </Card>

            {/* Goal Selection */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-emerald-400" />
                Session Goal
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <Button
                    key={goal.id}
                    variant={selectedGoal === goal.id ? "default" : "outline"}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={
                      selectedGoal === goal.id
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 justify-start"
                        : "border-white/20 text-white hover:bg-white/10 justify-start"
                    }
                  >
                    {goal.icon}
                    <span className="ml-2">{goal.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Mood Check-in */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-400" />
                How are you feeling right now?
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl">{moodEmojis[moodBefore - 1]}</span>
                  <span className="text-white font-medium">
                    {moodBefore === 1
                      ? "Very Low"
                      : moodBefore <= 3
                        ? "Low"
                        : moodBefore <= 5
                          ? "Okay"
                          : moodBefore <= 7
                            ? "Good"
                            : moodBefore <= 8
                              ? "Great"
                              : "Excellent"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodBefore}
                  onChange={(e) => setMoodBefore(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Very Low</span>
                  <span>Excellent</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Session Info & Start */}
          <div className="space-y-6">
            {/* Benefits */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Benefits
              </h3>
              <div className="space-y-2">
                {environment.benefits.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="w-full justify-start bg-white/10 text-gray-300 border-white/20"
                  >
                    <Sparkles className="h-3 w-3 mr-2" />
                    {benefit}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Audio Elements */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Audio Elements
              </h3>
              <div className="space-y-2">
                {environment.sounds.map((sound, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-300 text-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                    {sound
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                ))}
              </div>
            </Card>

            {/* Start Session */}
            <Card className="glass-dark border-white/10 p-6">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-white">
                  {selectedDuration}:00
                </div>
                <p className="text-gray-300 text-sm">
                  {environment.name} •{" "}
                  {selectedGoal.replace(/([A-Z])/g, " $1").toLowerCase()}
                </p>
                <Button
                  onClick={handleStartSession}
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-lg py-6"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Start AR/VR Session
                </Button>
                <p className="text-xs text-gray-400">
                  Camera and motion permissions may be requested for AR features
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationSession;
