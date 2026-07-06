import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { GradientButton } from "@/src/components/GradientButton";
import { ACHIEVEMENTS, BOT_LINK, IMAGES, USER } from "@/src/data/mock";
import { colors, fonts, haptic, radius, spacing, TAB_BAR_HEIGHT } from "@/src/theme";

const SETTINGS: { id: string; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { id: "notifications", icon: "bell", label: "Notifications" },
  { id: "language", icon: "globe", label: "Language — Hinglish" },
  { id: "help", icon: "help-circle", label: "Help & Support" },
];

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, streak, logout, showToast } = useApp();

  const orderViews = () => {
    haptic("medium");
    Linking.openURL(BOT_LINK).catch(() => showToast("Telegram nahi khul paya"));
  };

  const handleLogout = () => {
    haptic("medium");
    logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container} testID="profile-screen">
      <ScrollView
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover + avatar */}
        <View style={styles.coverWrap}>
          <Image source={{ uri: IMAGES.neon2 }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={["rgba(8,10,16,0.2)", colors.surface]}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: USER.avatar }} style={styles.avatar} contentFit="cover" />
          </View>
          <Text style={styles.name}>{USER.name}</Text>
          <Text style={styles.handle}>{USER.telegram}</Text>
        </View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.statsRow}>
          {[
            { label: "Balance", value: balance.toLocaleString("en-IN"), id: "balance" },
            { label: "Total Earned", value: USER.totalEarned.toLocaleString("en-IN"), id: "earned" },
            { label: "Rank", value: `#${USER.rank}`, id: "rank" },
            { label: "Streak", value: `${streak}🔥`, id: "streak" },
          ].map((s, i) => (
            <View key={s.id} style={[styles.statCell, i > 0 && styles.statDivider]} testID={`profile-stat-${s.id}`}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          {/* Instagram linked */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.igCard} testID="profile-instagram-card">
            <View style={styles.igIcon}>
              <FontAwesome name="instagram" size={20} color="#F0ABFC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.igLabel}>Linked Instagram</Text>
              <Text style={styles.igHandle}>{USER.instagram}</Text>
            </View>
            <View style={styles.verifiedChip}>
              <MaterialCommunityIcons name="check-decagram" size={14} color={colors.info} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </Animated.View>

          {/* Order Views CTA */}
          <Animated.View entering={FadeInDown.delay(180).duration(500)}>
            <GradientButton
              testID="order-views-button"
              title="Order Views on Bot"
              onPress={orderViews}
              icon={<FontAwesome name="telegram" size={18} color="#fff" />}
              style={{ marginTop: spacing.lg }}
            />
            <Text style={styles.ctaHint}>Sparks se views order karne bot par jao ↗</Text>
          </Animated.View>

          {/* Achievements */}
          <Animated.View entering={FadeInDown.delay(260).duration(500)}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.lg }}
            >
              {ACHIEVEMENTS.map((a) => (
                <View
                  key={a.id}
                  style={[styles.badge, !a.unlocked && { opacity: 0.35 }]}
                  testID={`achievement-${a.id}`}
                >
                  <View style={styles.badgeIcon}>
                    <Feather name={a.icon as never} size={18} color="#F0ABFC" />
                  </View>
                  <Text style={styles.badgeTitle}>{a.title}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Settings */}
          <Animated.View entering={FadeInDown.delay(340).duration(500)}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              {SETTINGS.map((s, i) => (
                <Pressable
                  key={s.id}
                  testID={`settings-${s.id}`}
                  style={[styles.settingRow, i > 0 && styles.settingBorder]}
                  onPress={() => {
                    haptic("light");
                    showToast("Prototype mode — jald aayega ⚙️");
                  }}
                >
                  <Feather name={s.icon} size={17} color={colors.textSecondary} />
                  <Text style={styles.settingLabel}>{s.label}</Text>
                  <Feather name="chevron-right" size={17} color={colors.textMuted} />
                </Pressable>
              ))}
              <Pressable
                testID="settings-logout"
                style={[styles.settingRow, styles.settingBorder]}
                onPress={handleLogout}
              >
                <Feather name="log-out" size={17} color={colors.error} />
                <Text style={[styles.settingLabel, { color: colors.error }]}>Logout</Text>
                <Feather name="chevron-right" size={17} color={colors.textMuted} />
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  coverWrap: { height: 150 },
  headerContent: { alignItems: "center", marginTop: -44 },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: colors.magenta,
    padding: 3,
    backgroundColor: colors.surface,
  },
  avatar: { flex: 1, borderRadius: 42 },
  name: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.text, marginTop: spacing.md },
  handle: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
  },
  statCell: { flex: 1, alignItems: "center" },
  statDivider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  statValue: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.text },
  statLabel: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.textMuted, marginTop: 3 },
  igCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  igIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(217,70,239,0.12)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  igLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  igHandle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.text, marginTop: 2 },
  verifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59,130,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.4)",
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  verifiedText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.info },
  ctaHint: {
    fontFamily: fonts.regular,
    fontSize: 11.5,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 19,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  badge: {
    width: 96,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(217,70,239,0.12)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 10.5,
    color: colors.textSecondary,
    textAlign: "center",
  },
  settingsCard: {
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
  },
  settingBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  settingLabel: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.text },
});
