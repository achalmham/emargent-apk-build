import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { GradientButton } from "@/src/components/GradientButton";
import { IMAGES } from "@/src/data/mock";
import { colors, fonts, radius, spacing } from "@/src/theme";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, showToast } = useApp();
  const [telegramId, setTelegramId] = useState("");
  const [loading, setLoading] = useState(false);

  const continueWithTelegram = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login();
      router.replace("/(tabs)/home");
    }, 1200);
  };

  const sendOtp = () => {
    if (telegramId.trim().length < 3) {
      showToast("Valid Telegram ID daalo");
      return;
    }
    router.push({ pathname: "/otp", params: { tid: telegramId.trim() } });
  };

  return (
    <View style={styles.container} testID="login-screen">
      <ImageBackground source={{ uri: IMAGES.neon1 }} style={styles.hero}>
        <LinearGradient
          colors={["rgba(8,10,16,0.30)", "rgba(8,10,16,0.85)", colors.surface]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 200, paddingBottom: insets.bottom + spacing.xl },
        ]}
        bottomOffset={24}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.brand}>
            Insta<Text style={{ color: colors.magenta }}>Vault</Text>
          </Text>
          <Text style={styles.heading}>Welcome back, creator</Text>
          <Text style={styles.sub}>
            Login karo aur Sparks kamana shuru karo — views ka fuel yahi hai.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.card}>
          <GradientButton
            testID="login-telegram-button"
            title="Continue with Telegram"
            loading={loading}
            onPress={continueWithTelegram}
            icon={<FontAwesome name="telegram" size={20} color="#fff" />}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ya phir</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="at-sign" size={16} color={colors.textMuted} />
            <TextInput
              testID="login-telegram-id-input"
              style={styles.input}
              placeholder="Telegram ID daalo"
              placeholderTextColor={colors.textMuted}
              value={telegramId}
              onChangeText={setTelegramId}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={sendOtp}
            />
          </View>
          <GradientButton
            testID="login-send-otp-button"
            title="OTP bhejo"
            variant="ghost"
            onPress={sendOtp}
            style={{ marginTop: spacing.md }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Feather name="lock" size={13} color={colors.success} />
            <Text style={styles.trustText}>Secure</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="check-circle" size={13} color={colors.success} />
            <Text style={styles.trustText}>1,00,000+ creators</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="key" size={13} color={colors.success} />
            <Text style={styles.trustText}>No password</Text>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  hero: { position: "absolute", top: 0, left: 0, right: 0, height: 340 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  heading: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: "rgba(17,21,32,0.88)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    padding: spacing.xl,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    paddingVertical: 12,
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  trustText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted },
});
