import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, fonts, gradient, haptic, radius } from "@/src/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  title: string;
  onPress: () => void;
  testID: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
};

export function GradientButton({
  title,
  onPress,
  testID,
  disabled,
  loading,
  style,
  variant = "primary",
  icon,
}: Props) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const content = (
    <>
      {icon}
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>
          {title}
        </Text>
      )}
    </>
  );

  return (
    <AnimatedPressable
      testID={testID}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }}
      onPress={() => {
        haptic("medium");
        onPress();
      }}
      style={[aStyle, style, disabled && { opacity: 0.5 }]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      ) : (
        <Animated.View style={[styles.button, styles.ghost]}>{content}</Animated.View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 24,
  },
  ghost: {
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  label: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  ghostLabel: {
    color: colors.textSecondary,
  },
});
