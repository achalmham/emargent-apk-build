import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export const colors = {
  surface: "#080A10",
  surface2: "#111520",
  surface3: "#1A2030",
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",
  brand: "#8B5CF6",
  magenta: "#D946EF",
  coral: "#F43F5E",
  violetDeep: "#6D28D9",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  border: "#1E293B",
  borderStrong: "#334155",
  glassEdge: "rgba(255,255,255,0.10)",
};

export const gradient = ["#8B5CF6", "#D946EF", "#F43F5E"] as const;
export const gradientDim = ["#2E1065", "#4A044E", "#4C0519"] as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
export const radius = { sm: 6, md: 12, lg: 20, pill: 999 };

export const fonts = {
  displayBold: "SpaceGrotesk-Bold",
  displayMedium: "SpaceGrotesk-Medium",
  regular: "Jakarta-Regular",
  semiBold: "Jakarta-SemiBold",
  bold: "Jakarta-Bold",
  extraBold: "Jakarta-ExtraBold",
};

export const TAB_BAR_HEIGHT = 64;

type HapticKind = "light" | "medium" | "heavy" | "success";

export function haptic(kind: HapticKind = "light") {
  if (Platform.OS === "web") return;
  try {
    if (kind === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      const map = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      } as const;
      Haptics.impactAsync(map[kind]);
    }
  } catch {}
}
