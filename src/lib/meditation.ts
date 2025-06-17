export interface MeditationEnvironment {
  id: string;
  name: string;
  description: string;
  category: "nature" | "space" | "urban" | "abstract";
  thumbnail: string;
  duration: number[];
  benefits: string[];
  isPremium: boolean;
  color: string;
  sounds: string[];
}

export interface MeditationSession {
  id: string;
  environmentId: string;
  duration: number;
  completedAt: Date;
  moodBefore: number;
  moodAfter: number;
  notes?: string;
}

export const MEDITATION_ENVIRONMENTS: MeditationEnvironment[] = [
  {
    id: "forest-sanctuary",
    name: "Forest Sanctuary",
    description:
      "Immerse yourself in a peaceful forest with flowing water and gentle wildlife sounds",
    category: "nature",
    thumbnail: "/api/placeholder/400/300",
    duration: [5, 10, 15, 20, 30],
    benefits: ["Stress Relief", "Focus", "Grounding"],
    isPremium: false,
    color: "#10b981",
    sounds: ["flowing-water", "birds", "wind-through-trees"],
  },
  {
    id: "crystal-cave",
    name: "Crystal Cave",
    description:
      "Discover tranquility in a mystical cave filled with glowing crystals and resonant tones",
    category: "abstract",
    thumbnail: "/api/placeholder/400/300",
    duration: [10, 15, 20, 30],
    benefits: ["Deep Relaxation", "Clarity", "Energy Healing"],
    isPremium: true,
    color: "#a855f7",
    sounds: ["crystal-bowl", "ambient-drone", "cave-echoes"],
  },
  {
    id: "ocean-depths",
    name: "Ocean Depths",
    description:
      "Dive deep into the calming embrace of the ocean with gentle waves and marine life",
    category: "nature",
    thumbnail: "/api/placeholder/400/300",
    duration: [5, 10, 15, 20, 25],
    benefits: ["Emotional Balance", "Peace", "Flow State"],
    isPremium: false,
    color: "#0ea5e9",
    sounds: ["ocean-waves", "dolphins", "underwater-ambience"],
  },
  {
    id: "space-nebula",
    name: "Cosmic Nebula",
    description:
      "Float through the infinite cosmos surrounded by colorful nebulae and distant stars",
    category: "space",
    thumbnail: "/api/placeholder/400/300",
    duration: [10, 15, 20, 30, 45],
    benefits: ["Perspective", "Wonder", "Transcendence"],
    isPremium: true,
    color: "#6366f1",
    sounds: ["cosmic-ambience", "stellar-winds", "deep-space"],
  },
  {
    id: "zen-garden",
    name: "Zen Garden",
    description:
      "Find inner peace in a traditional Japanese garden with bamboo and flowing water",
    category: "nature",
    thumbnail: "/api/placeholder/400/300",
    duration: [5, 10, 15, 20],
    benefits: ["Mindfulness", "Calm", "Present Moment"],
    isPremium: false,
    color: "#059669",
    sounds: ["bamboo-fountain", "wind-chimes", "gentle-breeze"],
  },
  {
    id: "aurora-peaks",
    name: "Aurora Mountain",
    description:
      "Witness the dancing northern lights above snow-capped mountain peaks",
    category: "nature",
    thumbnail: "/api/placeholder/400/300",
    duration: [10, 15, 20, 30],
    benefits: ["Inspiration", "Awe", "Connection"],
    isPremium: true,
    color: "#06b6d4",
    sounds: ["mountain-wind", "aurora-tones", "distant-wildlife"],
  },
];

export const MEDITATION_CATEGORIES = [
  {
    id: "all",
    name: "All Environments",
    count: MEDITATION_ENVIRONMENTS.length,
  },
  {
    id: "nature",
    name: "Nature",
    count: MEDITATION_ENVIRONMENTS.filter((e) => e.category === "nature")
      .length,
  },
  {
    id: "space",
    name: "Space",
    count: MEDITATION_ENVIRONMENTS.filter((e) => e.category === "space").length,
  },
  {
    id: "abstract",
    name: "Abstract",
    count: MEDITATION_ENVIRONMENTS.filter((e) => e.category === "abstract")
      .length,
  },
  {
    id: "urban",
    name: "Urban",
    count: MEDITATION_ENVIRONMENTS.filter((e) => e.category === "urban").length,
  },
];

export const DAILY_INSIGHTS = [
  "Today's focus: Cultivate gratitude for three things in your life.",
  "Mindfulness tip: Take three deep breaths before starting any new task.",
  "Reflection: What emotion am I feeling right now, and where do I feel it in my body?",
  "Practice: Set an intention for how you want to show up in the world today.",
  "Awareness: Notice the sounds around you for 30 seconds without judgment.",
  "Compassion: Send loving-kindness to someone who challenged you recently.",
  "Presence: Eat your next meal with full attention to taste, texture, and aroma.",
];

export const getMoodEmoji = (mood: number): string => {
  if (mood <= 2) return "😢";
  if (mood <= 4) return "😔";
  if (mood <= 6) return "😐";
  if (mood <= 8) return "🙂";
  return "😊";
};

export const getMoodLabel = (mood: number): string => {
  if (mood <= 2) return "Very Low";
  if (mood <= 4) return "Low";
  if (mood <= 6) return "Neutral";
  if (mood <= 8) return "Good";
  return "Excellent";
};

export const calculateLevel = (totalMinutes: number): number => {
  return Math.floor(totalMinutes / 120) + 1; // Level up every 2 hours of meditation
};

export const getExperienceToNextLevel = (
  totalMinutes: number,
): { current: number; required: number } => {
  const currentLevel = calculateLevel(totalMinutes);
  const currentLevelMinutes = (currentLevel - 1) * 120;
  const current = totalMinutes - currentLevelMinutes;
  const required = 120;

  return { current, required };
};
