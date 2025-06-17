import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { login, signup, isLoading } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to MindSpace AR.",
        });
      } else {
        await signup(formData.email, formData.password, formData.name);
        toast({
          title: "Welcome to MindSpace AR!",
          description: "Your account has been created successfully.",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-mindspace-400/20 to-violet-400/20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/20 to-mindspace-400/20 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-violet-400/10 to-emerald-400/10 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-slate-700 hover:text-mindspace-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-mindspace-500 to-violet-500 flex items-center justify-center shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-slate-800">
            {isLogin
              ? "Sign in to continue your meditation journey"
              : "Start your transformation with MindSpace AR"}
          </p>

          {!isLogin && (
            <Badge className="mt-4 bg-gradient-to-r from-mindspace-500 to-violet-500 text-white border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              7-day free trial included
            </Badge>
          )}
        </div>

        {/* Auth Form */}
        <Card className="glass border-0 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-900 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-white/90 border-slate-300 focus:border-mindspace-400 focus:ring-mindspace-400"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 bg-white/90 border-slate-300 focus:border-mindspace-400 focus:ring-mindspace-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-900 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 bg-white/90 border-slate-300 focus:border-mindspace-400 focus:ring-mindspace-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-slate-600 mt-1">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-mindspace-600 focus:ring-mindspace-500"
                  />
                  <span className="ml-2 text-sm text-slate-800">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-mindspace-600 hover:text-mindspace-700"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600 text-white font-medium text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "Sign In" : "Create Account"}</>
              )}
            </Button>

            {!isLogin && (
              <p className="text-xs text-center text-slate-600">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-mindspace-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-mindspace-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </form>
        </Card>

        {/* Toggle Auth Mode */}
        <div className="text-center mt-6">
          <p className="text-slate-800">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-mindspace-600 hover:text-mindspace-700 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Social proof for signup */}
        {!isLogin && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 mb-4">
              Trusted by 50,000+ users worldwide
            </p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-mindspace-200 to-violet-200 flex items-center justify-center text-xs font-medium text-mindspace-700"
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
