import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/auth";
import {
  MEDITATION_ENVIRONMENTS,
  DAILY_INSIGHTS,
  getMoodEmoji,
  getMoodLabel,
  getExperienceToNextLevel,
} from "@/lib/meditation";
import {
  Brain,
  Calendar,
  Clock,
  Trophy,
  Zap,
  TrendingUp,
  Play,
  Settings,
  Bell,
  BarChart3,
  Target,
  Heart,
  Sparkles,
  ChevronRight,
  Plus,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [currentMood, setCurrentMood] = useState(7);
  const [todayInsight, setTodayInsight] = useState("");

  useEffect(() => {
    // Set random daily insight
    const randomInsight =
      DAILY_INSIGHTS[Math.floor(Math.random() * DAILY_INSIGHTS.length)];
    setTodayInsight(randomInsight);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please sign in</h1>
          <Link to="/auth">
            <Button>Go to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { current: currentExp, required: requiredExp } =
    getExperienceToNextLevel(user.meditationStats.totalMinutes);
  const expProgress = (currentExp / requiredExp) * 100;

  const stats = [
    {
      title: "Total Sessions",
      value: user.meditationStats.totalSessions,
      icon: <Play className="h-5 w-5" />,
      color: "text-mindspace-600",
      bgColor: "bg-mindspace-100",
    },
    {
      title: "Minutes Meditated",
      value: user.meditationStats.totalMinutes,
      icon: <Clock className="h-5 w-5" />,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      title: "Current Streak",
      value: `${user.meditationStats.streakDays} days`,
      icon: <Zap className="h-5 w-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Current Level",
      value: user.meditationStats.currentLevel,
      icon: <Trophy className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  const recentEnvironments = MEDITATION_ENVIRONMENTS.slice(0, 3);
  const recommendedEnvironments = MEDITATION_ENVIRONMENTS.filter(
    (env) => !env.isPremium,
  ).slice(0, 4);

  return (
    <div className="min-h-screen gradient-bg-dark">
      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-mindspace-500 to-violet-500 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                MindSpace AR
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                asChild
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-mindspace-500 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-300">
            Ready for another transformative meditation session?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass-dark border-white/10 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Start */}
            <Card className="glass-dark border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-mindspace-400" />
                Quick Start Meditation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentEnvironments.map((env) => (
                  <div
                    key={env.id}
                    className="glass-dark border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{env.name}</h3>
                      {env.isPremium && (
                        <Badge className="bg-gradient-to-r from-mindspace-500 to-violet-500 text-white text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {env.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {env.benefits.slice(0, 2).map((benefit, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs bg-white/10 text-gray-300"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        <Link to={`/environments/${env.id}`}>
                          <Play className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600"
                asChild
              >
                <Link to="/environments">
                  Explore All Environments
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </Card>

            {/* Progress Tracking */}
            <Card className="glass-dark border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
                  Your Progress
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {/* Level Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      Level {user.meditationStats.currentLevel}
                    </span>
                    <span className="text-sm text-gray-400">
                      {currentExp}/{requiredExp} minutes
                    </span>
                  </div>
                  <Progress value={expProgress} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    {requiredExp - currentExp} minutes to next level
                  </p>
                </div>

                {/* Weekly Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      Weekly Goal
                    </span>
                    <span className="text-sm text-gray-400">4/7 days</span>
                  </div>
                  <Progress value={57} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    3 more days to reach your goal
                  </p>
                </div>

                {/* Mood Trend */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      Average Mood This Week
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {getMoodEmoji(7)} {getMoodLabel(7)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">vs last week</p>
                    <p className="text-sm font-medium text-emerald-400">
                      +12% improvement
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Check-in */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-400" />
                How are you feeling?
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Current mood</span>
                  <span className="text-lg">
                    {getMoodEmoji(currentMood)} {getMoodLabel(currentMood)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(Number(e.target.value))}
                  className="w-full accent-mindspace-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Very Low</span>
                  <span>Excellent</span>
                </div>
                <Button className="w-full bg-mindspace-600 hover:bg-mindspace-700">
                  Log Mood
                </Button>
              </div>
            </Card>

            {/* Daily Insight */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-violet-400" />
                Today's Insight
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "{todayInsight}"
              </p>
            </Card>

            {/* Achievements */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      7-Day Streak
                    </p>
                    <p className="text-xs text-gray-400">
                      Keep up the momentum!
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-mindspace-500/20 flex items-center justify-center">
                    <Star className="h-5 w-5 text-mindspace-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">First Hour</p>
                    <p className="text-xs text-gray-400">
                      60 minutes completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Mindfulness Master
                    </p>
                    <p className="text-xs text-gray-400">
                      20 sessions completed
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Upgrade Prompt */}
            <Card className="glass-dark border-white/10 p-6 bg-gradient-to-br from-mindspace-500/10 to-violet-500/10 border-mindspace-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">
                Unlock Premium
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Access all AR environments, advanced AI coaching, and unlimited
                sessions.
              </p>
              <Button className="w-full bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600">
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
