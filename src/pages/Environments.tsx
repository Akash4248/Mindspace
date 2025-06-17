import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/auth";
import {
  MEDITATION_ENVIRONMENTS,
  MEDITATION_CATEGORIES,
  MeditationEnvironment,
} from "@/lib/meditation";
import {
  Brain,
  Search,
  Filter,
  Play,
  Clock,
  Star,
  Lock,
  ArrowLeft,
  Heart,
  Sparkles,
  Crown,
} from "lucide-react";

const Environments = () => {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEnvironments = MEDITATION_ENVIRONMENTS.filter((env) => {
    const matchesCategory =
      selectedCategory === "all" || env.category === selectedCategory;
    const matchesSearch =
      env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.benefits.some((benefit) =>
        benefit.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const EnvironmentCard = ({
    environment,
  }: {
    environment: MeditationEnvironment;
  }) => (
    <Card className="glass-dark border-white/10 overflow-hidden group hover:bg-white/5 transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={`https://images.unsplash.com/photo-${environment.id === "forest-sanctuary" ? "1441974231531-c6227db76b6e" : environment.id === "crystal-cave" ? "1518837695005-2083093ee35b" : environment.id === "ocean-depths" ? "1439066615861-d1dafdf576b9" : environment.id === "space-nebula" ? "1446776653964-20c1d3a81b86" : environment.id === "zen-garden" ? "1540979388789-6cee28a1cdc9" : "1506905925346-21bda4d32df4"}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
          alt={environment.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {environment.isPremium && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-mindspace-500 to-violet-500 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-semibold text-white mb-1">
            {environment.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-xs text-gray-200">4.8 (1.2k)</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {environment.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {environment.benefits.map((benefit, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-white/10 text-gray-300 border-white/20"
            >
              {benefit}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{environment.duration.join(", ")} min</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Heart className="h-4 w-4 mr-1" />
            <span>92% love it</span>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600"
          asChild
        >
          <Link to={`/environments/${environment.id}`}>
            {environment.isPremium && !user ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to Access
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </>
            )}
          </Link>
        </Button>
      </div>
    </Card>
  );

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

            {user && (
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-mindspace-500 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Sparkles className="h-8 w-8 mr-3 text-mindspace-400" />
            Meditation Environments
          </h1>
          <p className="text-gray-300">
            Choose from our collection of immersive AR meditation experiences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search environments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-mindspace-400"
              />
            </div>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {MEDITATION_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-mindspace-500 to-violet-500"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category.name}
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs bg-white/20 text-gray-300"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredEnvironments.length} of{" "}
            {MEDITATION_ENVIRONMENTS.length} environments
            {searchQuery && (
              <span className="ml-2">
                for "<span className="text-mindspace-400">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Environments Grid */}
        {filteredEnvironments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnvironments.map((environment) => (
              <EnvironmentCard key={environment.id} environment={environment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No environments found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or browse different categories
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Premium Upgrade Banner */}
        <div className="mt-12 glass-dark border-white/10 rounded-2xl p-8 bg-gradient-to-r from-mindspace-500/10 to-violet-500/10 border-mindspace-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                <Crown className="h-6 w-6 mr-2 text-yellow-400" />
                Unlock Premium Environments
              </h3>
              <p className="text-gray-300 max-w-md">
                Access exclusive AR environments, advanced AI coaching, and
                unlimited meditation sessions with our premium plan.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-white">$9.99</p>
                <p className="text-gray-400">per month</p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-mindspace-500 to-violet-500 hover:from-mindspace-600 hover:to-violet-600 px-8"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Environments;
