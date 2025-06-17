import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Camera,
  Save,
  Trash2,
  Download,
  Trophy,
  Clock,
  Target,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    notifications: user?.preferences.notifications || false,
    reminderTime: user?.preferences.reminderTime || "09:00",
    theme: user?.preferences.theme || "light",
  });

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

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      preferences: {
        notifications: formData.notifications,
        reminderTime: formData.reminderTime,
        theme: formData.theme as "light" | "dark" | "system",
      },
    });
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first meditation session",
      icon: <Target className="h-6 w-6" />,
      completed: true,
      date: "2024-01-15",
    },
    {
      title: "7-Day Streak",
      description: "Meditate for 7 consecutive days",
      icon: <Trophy className="h-6 w-6" />,
      completed: true,
      date: "2024-01-22",
    },
    {
      title: "60 Minutes",
      description: "Complete 60 minutes of meditation",
      icon: <Clock className="h-6 w-6" />,
      completed: true,
      date: "2024-01-20",
    },
    {
      title: "Mindful Explorer",
      description: "Try 5 different environments",
      icon: <Brain className="h-6 w-6" />,
      completed: false,
      progress: "3/5",
    },
  ];

  return (
    <div className="min-h-screen gradient-bg-dark">
      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center text-white hover:text-mindspace-400 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Dashboard
              </Link>

              <Link to="/" className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-mindspace-500 to-violet-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">
                  MindSpace AR
                </span>
              </Link>
            </div>

            <Button
              onClick={logout}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-300">
            Manage your account, preferences, and meditation journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="glass-dark border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-mindspace-400" />
                  Profile Information
                </h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-mindspace-600 hover:bg-mindspace-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-mindspace-500 text-white text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="glass-dark border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-violet-400" />
                Preferences
              </h2>

              <div className="space-y-6">
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-400">
                      Receive reminders and motivation
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications}
                    onCheckedChange={(checked) =>
                      handleInputChange("notifications", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                {/* Reminder Time */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Daily Reminder Time</Label>
                  <Input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) =>
                      handleInputChange("reminderTime", e.target.value)
                    }
                    disabled={!isEditing || !formData.notifications}
                    className="bg-white/10 border-white/20 text-white disabled:opacity-60"
                  />
                </div>

                {/* Theme */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Theme Preference</Label>
                  <div className="flex space-x-2">
                    {[
                      {
                        id: "light",
                        label: "Light",
                        icon: <Sun className="h-4 w-4" />,
                      },
                      {
                        id: "dark",
                        label: "Dark",
                        icon: <Moon className="h-4 w-4" />,
                      },
                      {
                        id: "system",
                        label: "System",
                        icon: <Monitor className="h-4 w-4" />,
                      },
                    ].map((theme) => (
                      <Button
                        key={theme.id}
                        variant={
                          formData.theme === theme.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleInputChange("theme", theme.id)}
                        disabled={!isEditing}
                        className={
                          formData.theme === theme.id
                            ? "bg-mindspace-600 hover:bg-mindspace-700"
                            : "border-white/20 text-white hover:bg-white/10"
                        }
                      >
                        {theme.icon}
                        <span className="ml-2">{theme.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Data & Privacy */}
            <Card className="glass-dark border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-400" />
                Data & Privacy
              </h2>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Summary */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Journey
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Sessions</span>
                  <span className="text-white font-semibold">
                    {user.meditationStats.totalSessions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Minutes Meditated</span>
                  <span className="text-white font-semibold">
                    {user.meditationStats.totalMinutes}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Streak</span>
                  <span className="text-white font-semibold">
                    {user.meditationStats.streakDays} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Level</span>
                  <Badge className="bg-mindspace-500 text-white">
                    Level {user.meditationStats.currentLevel}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.completed
                        ? "bg-emerald-500/20 border border-emerald-500/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.completed
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          achievement.completed ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {achievement.completed
                          ? `Completed on ${achievement.date}`
                          : achievement.progress || achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support */}
            <Card className="glass-dark border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                >
                  FAQ & Help Center
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                >
                  Feedback
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
