export const IMAGES = {
  neon1:
    "https://images.unsplash.com/photo-1620207418302-439b387441b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBhYnN0cmFjdCUyMG5lb24lMjBnbG93JTIwZGFyayUyMGJhY2tncm91bmQlMjB2aW9sZXQlMjBtYWdlbnRhJTIwY29yYWx8ZW58MHx8fHwxNzgzMzI5OTAyfDA&ixlib=rb-4.1.0&q=85",
  neon2:
    "https://images.unsplash.com/photo-1563089145-599997674d42?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHxjaW5lbWF0aWMlMjBhYnN0cmFjdCUyMG5lb24lMjBnbG93JTIwZGFyayUyMGJhY2tncm91bmQlMjB2aW9sZXQlMjBtYWdlbnRhJTIwY29yYWx8ZW58MHx8fHwxNzgzMzI5OTAyfDA&ixlib=rb-4.1.0&q=85",
  wheel:
    "https://images.unsplash.com/photo-1726004044534-e10fc99783f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHxjYXNpbm8lMjByb3VsZXR0ZSUyMHdoZWVsJTIwZGFyayUyMG1vb2R5JTIwM2QlMjByZW5kZXJ8ZW58MHx8fHwxNzgzMzI5OTAyfDA&ixlib=rb-4.1.0&q=85",
  avatar:
    "https://images.unsplash.com/photo-1764546373114-2d7a87221733?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjBtYW4lMjBwb3J0cmFpdCUyMG1vZGVybiUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc4MzMyOTkwMnww&ixlib=rb-4.1.0&q=85",
};

export const USER = {
  name: "Achal",
  telegram: "@achal_iv",
  instagram: "@achal.creates",
  avatar: IMAGES.avatar,
  rank: 128,
  totalEarned: 12840,
};

export type Task = {
  id: string;
  title: string;
  subtitle: string;
  reward: number;
  time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: string; // Feather icon name
  accent: string;
  banner: string;
  steps: string[];
};

export const TASKS: Task[] = [
  {
    id: "install-play",
    title: "Install & Play",
    subtitle: "Game install karo, 5 min khelo",
    reward: 120,
    time: "5 min",
    difficulty: "Easy",
    icon: "download",
    accent: "#8B5CF6",
    banner: IMAGES.neon1,
    steps: [
      "Neeche 'Start Task' dabao",
      "Play Store se game install karo",
      "Game kholo aur 5 min khelo",
      "Wapas aao — Sparks auto-credit ho jayenge",
    ],
  },
  {
    id: "quick-survey",
    title: "Quick Survey",
    subtitle: "2 min ka opinion, instant Sparks",
    reward: 60,
    time: "2 min",
    difficulty: "Easy",
    icon: "edit-3",
    accent: "#D946EF",
    banner: IMAGES.neon2,
    steps: [
      "Survey link kholo",
      "5 simple questions ka jawab do",
      "Submit karo",
      "+60 ⚡ turant credit",
    ],
  },
  {
    id: "watch-ad",
    title: "Watch Video Ad",
    subtitle: "30 sec video, easy Sparks",
    reward: 30,
    time: "30 sec",
    difficulty: "Easy",
    icon: "play",
    accent: "#F43F5E",
    banner: IMAGES.neon1,
    steps: ["Video ad start karo", "30 sec pura dekho", "Reward claim karo"],
  },
  {
    id: "app-tryout",
    title: "App Try-out",
    subtitle: "App kholo, 60 sec use karo",
    reward: 80,
    time: "1 min",
    difficulty: "Medium",
    icon: "smartphone",
    accent: "#6D28D9",
    banner: IMAGES.neon2,
    steps: [
      "Partner app install karo",
      "App kholo aur signup karo",
      "60 sec explore karo",
      "+80 ⚡ credit ho jayenge",
    ],
  },
  {
    id: "daily-quiz",
    title: "Daily Quiz",
    subtitle: "3 questions, sahi jawab = Sparks",
    reward: 50,
    time: "1 min",
    difficulty: "Medium",
    icon: "help-circle",
    accent: "#3B82F6",
    banner: IMAGES.neon1,
    steps: [
      "Quiz start karo",
      "3 questions ke jawab do",
      "Har sahi jawab pe Sparks",
      "Streak bonus alag se",
    ],
  },
];

export type Game = {
  id: string;
  title: string;
  tagline: string;
  attempts: string;
  range: string;
  icon: string;
  accent: string;
  playable: boolean;
};

export const GAMES: Game[] = [
  {
    id: "spin",
    title: "Spin the Wheel",
    tagline: "Roz 1 free spin — kismat aazmao",
    attempts: "1 spin left",
    range: "5–100 ⚡",
    icon: "loader",
    accent: "#D946EF",
    playable: true,
  },
  {
    id: "scratch",
    title: "Scratch Card",
    tagline: "Swipe karo, reveal karo",
    attempts: "3 cards daily",
    range: "10–80 ⚡",
    icon: "credit-card",
    accent: "#8B5CF6",
    playable: false,
  },
  {
    id: "dice",
    title: "Lucky Dice Roll",
    tagline: "Number guess karo, jeeto",
    attempts: "2 rolls daily",
    range: "20–150 ⚡",
    icon: "box",
    accent: "#F43F5E",
    playable: false,
  },
  {
    id: "predict",
    title: "Predict & Win",
    tagline: "Color ya number — sahi prediction",
    attempts: "5 rounds daily",
    range: "10–200 ⚡",
    icon: "trending-up",
    accent: "#10B981",
    playable: false,
  },
  {
    id: "quiz",
    title: "Quiz Challenge",
    tagline: "Timed quiz, streak bonus",
    attempts: "1 challenge daily",
    range: "30–120 ⚡",
    icon: "zap",
    accent: "#F59E0B",
    playable: false,
  },
];

export type Offer = {
  id: string;
  brand: string;
  title: string;
  desc: string;
  reward: number;
  tags: ("quick" | "high" | "new")[];
  icon: string;
  accent: string;
};

export const OFFERS: Offer[] = [
  { id: "o1", brand: "Ludo King", title: "Install + 1 match khelo", desc: "Game install karke ek match complete karo", reward: 150, tags: ["high", "new"], icon: "target", accent: "#8B5CF6" },
  { id: "o2", brand: "Zupee", title: "Signup bonus", desc: "Account banao, ₹10 deposit nahi chahiye", reward: 200, tags: ["high"], icon: "award", accent: "#D946EF" },
  { id: "o3", brand: "OpinionHub", title: "1 min poll", desc: "Ek chhota poll — instant credit", reward: 25, tags: ["quick"], icon: "check-circle", accent: "#10B981" },
  { id: "o4", brand: "StreamBox", title: "App try-out 60 sec", desc: "App kholo aur 1 min browse karo", reward: 45, tags: ["quick"], icon: "smartphone", accent: "#3B82F6" },
  { id: "o5", brand: "CashKaro", title: "Register + verify", desc: "Email verify karte hi Sparks", reward: 120, tags: ["new"], icon: "user-plus", accent: "#F43F5E" },
  { id: "o6", brand: "AdVault", title: "3 video ads dekho", desc: "Har video 30 sec ka", reward: 90, tags: ["quick", "new"], icon: "play-circle", accent: "#F59E0B" },
  { id: "o7", brand: "GameArena", title: "Level 5 tak pahuncho", desc: "Casual game me level 5 clear karo", reward: 300, tags: ["high"], icon: "bar-chart-2", accent: "#6D28D9" },
  { id: "o8", brand: "SurveyMax", title: "Profile survey", desc: "5 min detailed survey", reward: 110, tags: ["high", "new"], icon: "clipboard", accent: "#D946EF" },
];

export const ACTIVITIES = [
  "Rahul ne abhi 120 ⚡ kamaye",
  "Priya ne Spin me 100 ⚡ jeete",
  "Aman ne 5K views order kiye",
  "Sneha ka 7-day streak complete 🔥",
  "Vikas ne Mystery Box se 250 ⚡ nikale",
  "Karan ne Quick Survey se 60 ⚡ kamaye",
];

export const ACHIEVEMENTS = [
  { id: "a1", title: "First Spark", icon: "zap", unlocked: true },
  { id: "a2", title: "Task Master", icon: "check-circle", unlocked: true },
  { id: "a3", title: "5-Day Streak", icon: "trending-up", unlocked: true },
  { id: "a4", title: "Spin King", icon: "loader", unlocked: false },
  { id: "a5", title: "10K Club", icon: "award", unlocked: true },
  { id: "a6", title: "Referral Pro", icon: "users", unlocked: false },
];

export const MILESTONES = [
  { id: "m1", title: "7 days streak", reward: 500, progress: 5, total: 7 },
  { id: "m2", title: "10 tasks complete", reward: 300, progress: 6, total: 10 },
  { id: "m3", title: "3 games khelo", reward: 150, progress: 1, total: 3 },
];

export const BOT_LINK = "https://t.me/InstaVaultBot";
