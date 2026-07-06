import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, View, Pressable } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Confetti } from "@/src/components/Confetti";
import { Spark } from "@/src/components/Spark";
import { GradientButton } from "@/src/components/GradientButton";
import { colors, fonts, haptic, radius, spacing } from "@/src/theme";

type Props = {
  visible: boolean;
  amount: number;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  onPrimary: () => void;
  onClose?: () => void;
};

export function RewardModal({
  visible,
  amount,
  title = "Sparks credited!",
  subtitle = "Balance me add ho gaye — keep going 🔥",
  primaryLabel = "Next Task",
  onPrimary,
  onClose,
}: Props) {
  useEffect(() => {
    if (visible) haptic("success");
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay} testID="reward-modal">
        <Confetti />
        <Animated.View entering={ZoomIn.springify().damping(16)} style={styles.card}>
          <LinearGradient
            colors={["rgba(139,92,246,0.25)", "rgba(217,70,239,0.10)", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.sparkCircle}>
            <Spark size={40} />
          </View>
          <Animated.Text entering={FadeIn.delay(150)} style={styles.amount} testID="reward-modal-amount">
            +{amount} ⚡
          </Animated.Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <GradientButton
            testID="reward-modal-primary-button"
            title={primaryLabel}
            onPress={onPrimary}
            style={{ alignSelf: "stretch", marginTop: spacing.xl }}
          />
          {onClose ? (
            <Pressable testID="reward-modal-close-button" onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Baad mein</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4,6,12,0.88)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    padding: spacing.xl,
    alignItems: "center",
    overflow: "hidden",
  },
  sparkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(217,70,239,0.12)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  amount: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
  closeBtn: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  closeText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
});
