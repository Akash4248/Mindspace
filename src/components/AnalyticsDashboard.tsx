import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Heart,
  Target,
  Award,
  Clock,
  Brain,
  Zap,
  Download,
  Share2,
} from "lucide-react";
import {
  apiService,
  AnalyticsData,
  formatDuration,
  getMoodColor,
} from "@/lib/api";

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAnalytics();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analyticsData) {
    return (
      <div className="p-8 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const COLORS = ["#0ea5e9", "#a855f7", "#10b981", "#f97316", "#ef4444"];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-300">
            Track your meditation journey and progress
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white/10 rounded-lg p-1">
            {(["week", "month", "year"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={
                  timeRange === range
                    ? "bg-mindspace-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-dark border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Sessions This Week
              </p>
              <p className="text-3xl font-bold text-white">
                {analyticsData.sessionsThisWeek}
              </p>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23% from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-mindspace-500/20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-mindspace-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-dark border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Minutes This Week
              </p>
              <p className="text-3xl font-bold text-white">
                {analyticsData.minutesThisWeek}
              </p>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18% from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-violet-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-dark border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Average Mood</p>
              <p className="text-3xl font-bold text-white">
                {analyticsData.averageMood}/10
              </p>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+
                {analyticsData.moodImprovement}% improvement
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-dark border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Streak Record</p>
              <p className="text-3xl font-bold text-white">
                {analyticsData.streakRecord}
              </p>
              <p className="text-xs text-gray-400 mt-1">days consecutive</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Activity Chart */}
        <div className="lg:col-span-2">
          <Card className="glass-dark border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Daily Activity
              </h3>
              <Badge className="bg-mindspace-500/20 text-mindspace-300">
                Last 7 days
              </Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })
                    }
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    formatter={(value, name) => [
                      name === "minutes" ? `${value} min` : value,
                      name === "minutes" ? "Minutes" : "Sessions",
                    ]}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                    name="sessions"
                  />
                  <Bar
                    dataKey="minutes"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                    name="minutes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Environment Usage */}
        <div>
          <Card className="glass-dark border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Environment Usage
            </h3>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.environmentUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sessions"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analyticsData.environmentUsage.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {analyticsData.environmentUsage.map((env, index) => (
                <div
                  key={env.environmentId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-300">{env.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">
                      {env.sessions} sessions
                    </p>
                    <p className="text-xs text-gray-400">
                      ★ {env.averageRating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Mood Trend */}
      <Card className="glass-dark border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Mood Trend</h3>
          <Badge className="bg-emerald-500/20 text-emerald-300">
            +{analyticsData.moodImprovement}% improvement
          </Badge>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
                formatter={(value) => [`${value}/10`, "Mood"]}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#10b981",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-dark border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-mindspace-400" />
            AI Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-mindspace-500/10 rounded-lg border border-mindspace-500/20">
              <p className="text-sm text-mindspace-300 font-medium mb-1">
                Peak Performance Time
              </p>
              <p className="text-gray-300 text-sm">
                Your meditation sessions are most effective between 9-11 AM,
                with 23% better mood improvement.
              </p>
            </div>
            <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <p className="text-sm text-violet-300 font-medium mb-1">
                Environment Preference
              </p>
              <p className="text-gray-300 text-sm">
                You show 35% longer engagement with nature-based environments
                compared to abstract ones.
              </p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <p className="text-sm text-emerald-300 font-medium mb-1">
                Consistency Pattern
              </p>
              <p className="text-gray-300 text-sm">
                Maintaining your current schedule could help you reach a 30-day
                streak by next month.
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-dark border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-emerald-400" />
            Goals & Milestones
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Weekly Goal</span>
                <span className="text-sm text-white">4/5 sessions</span>
              </div>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                1 more session to reach your goal
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Monthly Minutes</span>
                <span className="text-sm text-white">380/600 min</span>
              </div>
              <Progress value={63} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                220 minutes remaining
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Mindfulness Level</span>
                <span className="text-sm text-white">Level 3</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                165 minutes to Level 4
              </p>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center mb-2">
                <Award className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm text-yellow-300 font-medium">
                  Next Achievement
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Complete 3 more sessions to unlock "Mindful Explorer"
                achievement
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
