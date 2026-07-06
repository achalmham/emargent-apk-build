import React from "react";
import { Text, TextStyle, StyleSheet } from "react-native";
import { colors } from "@/src/theme";

// Signature gradient-glow "⚡" brand mark
export function Spark({ size = 16, style }: { size?: number; style?: TextStyle }) {
  return (
    <Text style={[styles.spark, { fontSize: size }, style]} allowFontScaling={false}>
      ⚡
    </Text>
  );
}

const styles = StyleSheet.create({
  spark: {
    color: colors.magenta,
    textShadowColor: "rgba(217,70,239,0.65)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
