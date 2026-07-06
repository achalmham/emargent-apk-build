import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { GradientButton } from "@/src/components/GradientButton";
import { colors, fonts, haptic, radius, spacing } from "@/src/theme";

export default function Otp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tid } = useLocalSearchParams<{ tid?: string }>();
  const { login, showToast } = useApp();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const setDigit = (i: number, v: string) => {
    const val = v.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 3) refs[i + 1].current?.focus();
  };

  const onKeyPress = (i: number, key: string) => {
    if (key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const verify = () => {
    if (digits.some((d) => !d)) {
      showToast("Pura 4-digit OTP daalo");
      return;
    }
    setVerifying(true);
    haptic("medium");
    setTimeout(() => {
      setVerifying(false);
      login();
      router.replace("/(tabs)/home");
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]} testID="otp-screen">
      <Pressable testID="otp-back-button" onPress={() => router.back()} style={styles.back}>
        <Feather name="arrow-left" size={22} color={colors.text} />
      </Pressable>

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <View style={styles.iconBadge}>
          <Feather name="message-circle" size={22} color={colors.magenta} />
        </View>
        <Text style={styles.heading}>OTP verify karo</Text>
        <Text style={styles.sub}>
          Telegram par bheja gaya 4-digit code daalo{tid ? ` — @${String(tid).replace("@", "")}` : ""}
        </Text>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              testID={`otp-input-${i}`}
              style={[styles.otpBox, d ? styles.otpBoxFilled : null]}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              onKeyPress={(e) => onKeyPress(i, e.nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
              selectionColor={colors.magenta}
            />
          ))}
        </View>

        <GradientButton
          testID="otp-verify-button"
          title="Verify & Login"
          loading={verifying}
          onPress={verify}
          style={{ alignSelf: "stretch" }}
        />

        <Pressable
          testID="otp-resend-button"
          onPress={() => showToast("Naya OTP bhej diya ✓")}
          style={styles.resend}
        >
          <Text style={styles.resendText}>
            Code nahi aaya? <Text style={{ color: colors.magenta }}>Resend karo</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: spacing.xl },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { marginTop: spacing.xxl, alignItems: "center" },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(217,70,239,0.12)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  heading: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.text },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  otpRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  otpBox: {
    width: 60,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 26,
    textAlign: "center",
  },
  otpBoxFilled: { borderColor: colors.magenta },
  resend: { marginTop: spacing.lg, padding: spacing.sm },
  resendText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textMuted },
});
