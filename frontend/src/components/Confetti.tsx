import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width: W, height: H } = Dimensions.get("window");
const COLORS = ["#8B5CF6", "#D946EF", "#F43F5E", "#F59E0B", "#10B981", "#E9D5FF"];

function Piece({ index }: { index: number }) {
  const cfg = useMemo(
    () => ({
      x: Math.random() * W,
      drift: (Math.random() - 0.5) * 120,
      delay: Math.random() * 400,
      duration: 1800 + Math.random() * 1200,
      size: 6 + Math.random() * 6,
      color: COLORS[index % COLORS.length],
      rot: (Math.random() - 0.5) * 720,
      round: Math.random() > 0.5,
    }),
    [index],
  );

  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      cfg.delay,
      withTiming(1, { duration: cfg.duration, easing: Easing.out(Easing.quad) }),
    );
  }, [t, cfg]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: cfg.x + cfg.drift * t.value },
      { translateY: -40 + t.value * H * 0.85 },
      { rotate: `${cfg.rot * t.value}deg` },
    ],
    opacity: t.value < 0.75 ? 1 : 1 - (t.value - 0.75) / 0.25,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        style,
        {
          width: cfg.size,
          height: cfg.round ? cfg.size : cfg.size * 1.8,
          borderRadius: cfg.round ? cfg.size / 2 : 2,
          backgroundColor: cfg.color,
        },
      ]}
    />
  );
}

export function Confetti({ count = 26 }: { count?: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }).map((_, i) => (
        <Piece key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
