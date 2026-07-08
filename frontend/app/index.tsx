import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { Spark } from "@/src/components/Spark";
import { colors, fonts } from "@/src/theme";

export default function Splash() {
  const router = useRouter();
  const { hydrated, onboarded, loggedIn } = useApp();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const tagOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.3)) });
    tagOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, [opacity, scale, tagOpacity]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      if (!onboarded) router.replace("/onboarding");
      else if (!loggedIn) router.replace("/login");
      else router.replace("/(tabs)/home");
    }, 1600);
    return () => clearTimeout(t);
  }, [hydrated, onboarded, loggedIn, router]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));

  return (
    <View style={styles.container} testID="splash-screen">
      <LinearGradient
        colors={["#0B0716", colors.surface, "#160B14"]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={styles.logoGlow}>
          <Spark size={56} />
        </View>
        <Text style={styles.brand}>
          Insta<Text style={{ color: colors.magenta }}>Vault</Text>
        </Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, tagStyle]}>
        Sparks kamao. Real growth pao. [Updated Version]
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: { alignItems: "center" },
  logoGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(217,70,239,0.10)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 34,
    color: colors.text,
    letterSpacing: 0.5,
  },
  tagline: {
    position: "absolute",
    bottom: 72,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textMuted,
  },
});
