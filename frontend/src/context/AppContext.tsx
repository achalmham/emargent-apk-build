import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { storage } from "@/src/utils/storage";

type AppState = {
  hydrated: boolean;
  onboarded: boolean;
  loggedIn: boolean;
  balance: number;
  todayEarned: number;
  streak: number;
  dailyTarget: number;
  completedTasks: string[];
  spinsLeft: number;
  checkedInDays: number[];
  mysteryOpened: boolean;
  adWatched: boolean;
  toast: string | null;
  setOnboarded: () => void;
  login: () => void;
  logout: () => void;
  addSparks: (amount: number) => void;
  completeTask: (id: string, reward: number) => void;
  useSpin: () => void;
  checkIn: () => void;
  openMysteryBox: () => number;
  watchAd: () => void;
  showToast: (msg: string) => void;
};

const AppContext = createContext<AppState | null>(null);

const TODAY_INDEX = 4; // day 5 of the 7-day streak grid (0-based)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboardedState] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(2450);
  const [todayEarned, setTodayEarned] = useState(240);
  const [streak] = useState(5);
  const [dailyTarget] = useState(500);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [checkedInDays, setCheckedInDays] = useState<number[]>([0, 1, 2, 3]);
  const [mysteryOpened, setMysteryOpened] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const ob = await storage.getItem("iv_onboarded", false);
      const li = await storage.getItem("iv_logged_in", false);
      const bal = await storage.getItem("iv_balance", 2450);
      setOnboardedState(!!ob);
      setLoggedIn(!!li);
      setBalance(typeof bal === "number" ? bal : 2450);
      setHydrated(true);
    })();
  }, []);

  const persistBalance = useCallback((next: number) => {
    storage.setItem("iv_balance", next);
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addSparks = useCallback(
    (amount: number) => {
      setBalance((b) => {
        const next = b + amount;
        persistBalance(next);
        return next;
      });
      setTodayEarned((t) => t + amount);
    },
    [persistBalance],
  );

  const completeTask = useCallback(
    (id: string, reward: number) => {
      setCompletedTasks((prev) => (prev.includes(id) ? prev : [...prev, id]));
      addSparks(reward);
    },
    [addSparks],
  );

  const useSpin = useCallback(() => setSpinsLeft((s) => Math.max(0, s - 1)), []);

  const checkIn = useCallback(() => {
    setCheckedInDays((prev) =>
      prev.includes(TODAY_INDEX) ? prev : [...prev, TODAY_INDEX],
    );
    addSparks(20);
  }, [addSparks]);

  const openMysteryBox = useCallback(() => {
    const rewards = [50, 80, 120, 150, 250];
    const amount = rewards[Math.floor(Math.random() * rewards.length)];
    setMysteryOpened(true);
    addSparks(amount);
    return amount;
  }, [addSparks]);

  const watchAd = useCallback(() => {
    setAdWatched(true);
    addSparks(30);
  }, [addSparks]);

  const setOnboarded = useCallback(() => {
    setOnboardedState(true);
    storage.setItem("iv_onboarded", true);
  }, []);

  const login = useCallback(() => {
    setLoggedIn(true);
    storage.setItem("iv_logged_in", true);
  }, []);

  const logout = useCallback(() => {
    setLoggedIn(false);
    storage.setItem("iv_logged_in", false);
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      onboarded,
      loggedIn,
      balance,
      todayEarned,
      streak,
      dailyTarget,
      completedTasks,
      spinsLeft,
      checkedInDays,
      mysteryOpened,
      adWatched,
      toast,
      setOnboarded,
      login,
      logout,
      addSparks,
      completeTask,
      useSpin,
      checkIn,
      openMysteryBox,
      watchAd,
      showToast,
    }),
    [
      hydrated,
      onboarded,
      loggedIn,
      balance,
      todayEarned,
      streak,
      dailyTarget,
      completedTasks,
      spinsLeft,
      checkedInDays,
      mysteryOpened,
      adWatched,
      toast,
      setOnboarded,
      login,
      logout,
      addSparks,
      completeTask,
      useSpin,
      checkIn,
      openMysteryBox,
      watchAd,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const CHECKIN_TODAY_INDEX = TODAY_INDEX;
