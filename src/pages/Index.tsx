import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth";
import {
  Brain,
  Sparkles,
  Eye,
  Heart,
  Zap,
  Shield,
  Users,
  Play,
  ArrowRight,
  Check,
  Star,
  Menu,
  X,
} from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Personalization",
      description:
        "Advanced algorithms adapt meditation experiences to your emotional state and preferences.",
      color: "text-mindspace-600",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Immersive AR Environments",
      description:
        "Transform any space into a serene meditation sanctuary with cutting-edge AR technology.",
      color: "text-violet-600",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Biometric Monitoring",
      description:
        "Real-time stress level analysis through voice patterns and optional heart rate monitoring.",
      color: "text-emerald-600",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Dynamic Content",
      description:
        "Ever-changing environments and guided meditations that evolve with your journey.",
      color: "text-orange-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Results",
      description:
        "Feel the benefits immediately with our scientifically-backed meditation techniques.",
      color: "text-yellow-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy First",
      description:
        "Your mental health data is protected with enterprise-grade security and encryption.",
      color: "text-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      content:
        "MindSpace AR has revolutionized my meditation practice. The AR environments are incredibly immersive and the AI recommendations are spot-on.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
      content:
        "As someone who struggled with traditional meditation, the interactive AR elements make it engaging and effective. I've maintained a 30-day streak!",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Therapist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      content:
        "I recommend MindSpace AR to my clients. The biometric feedback helps them understand their progress and stay motivated.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-mindspace-500 to-violet-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold gradient-text">
                  MindSpace AR
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-slate-900 hover:text-mindspace-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-slate-900 hover:text-mindspace-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-slate-900 hover:text-mindspace-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Reviews
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-900 hover:text-mindspace-600"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-900 hover:text-mindspace-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-900 hover:text-mindspace-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-slate-900 hover:text-mindspace-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <div className="pt-4 pb-2 px-3 space-y-2">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-mindspace-500 to-violet-500">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button className="w-full bg-gradient-to-r from-mindspace-500 to-violet-500">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <Badge className="mb-6 bg-gradient-to-r from-mindspace-500 to-violet-500 text-white border-0">
                <Sparkles className="h-4 w-4 mr-2" />
                Revolutionary AR Meditation
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Transform Your
                <span className="gradient-text block">Mind & Space</span>
                with AI-Powered AR
              </h1>
              <p className="text-xl text-slate-800 mb-8 leading-relaxed">
                Experience the future of mental wellness with MindSpace AR.
                Combine cutting-edge augmented reality with AI-driven
                personalization to create immersive meditation experiences that
                adapt to your unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600 text-lg px-8 py-6"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Meditating
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600 text-lg px-8 py-6"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Try Free Demo
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-mindspace-400 text-mindspace-600 hover:bg-mindspace-50"
                >
                  Watch Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-slate-700">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-emerald-500 mr-2" />
                  Free 7-day trial
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-emerald-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-emerald-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Person meditating with AR visualization"
                  className="rounded-2xl shadow-2xl"
                />
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-mindspace-400 to-violet-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-emerald-400 to-mindspace-400 rounded-full opacity-15 animate-float animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Revolutionary Features
            </h2>
            <p className="text-xl text-slate-800 max-w-3xl mx-auto">
              Discover how MindSpace AR combines cutting-edge technology with
              ancient wisdom to create the ultimate meditation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 glass hover:shadow-xl transition-all duration-300 floating-card border-0"
              >
                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-800 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-800">
              See what our community is saying about their transformation
              journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 glass floating-card border-0">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-800 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-700">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-800">
              Choose the plan that fits your meditation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 glass border-0">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <p className="text-4xl font-bold text-slate-900 mb-1">$0</p>
                <p className="text-slate-700 mb-6">Forever</p>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>2 AR environments</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Basic mood tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>10 minutes daily</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 glass border-2 border-mindspace-300 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-mindspace-500 to-violet-500 text-white">
                Most Popular
              </Badge>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Premium
                </h3>
                <p className="text-4xl font-bold text-slate-900 mb-1">$9.99</p>
                <p className="text-slate-700 mb-6">per month</p>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>All AR environments</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Advanced AI coaching</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Unlimited sessions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Biometric monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Progress analytics</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600"
                  asChild
                >
                  <Link to="/auth">Start Free Trial</Link>
                </Button>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 glass border-0">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Enterprise
                </h3>
                <p className="text-4xl font-bold text-slate-900 mb-1">Custom</p>
                <p className="text-slate-700 mb-6">Contact us</p>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>White-label solution</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-500 mr-3" />
                    <span>24/7 support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-mindspace-600 via-violet-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Mind?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already discovered the power of
            AR-enhanced meditation. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-mindspace-600 hover:bg-gray-100 text-lg px-8 py-6"
              asChild
            >
              <Link to="/auth">
                <Play className="h-5 w-5 mr-2" />
                Start Free Trial
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Learn More
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-mindspace-500 to-violet-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">MindSpace AR</span>
              </div>
              <p className="text-slate-300 max-w-md">
                Revolutionizing mental wellness through AI-powered augmented
                reality meditation experiences.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-100 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-300">
            <p>&copy; 2024 MindSpace AR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
