import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { CountUp } from "@/src/components/CountUp";
import { ProgressRing } from "@/src/components/ProgressRing";
import { Spark } from "@/src/components/Spark";
import { ACTIVITIES, TASKS, USER } from "@/src/data/mock";
import { colors, fonts, haptic, radius, spacing, TAB_BAR_HEIGHT } from "@/src/theme";

function LiveTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ACTIVITIES.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={styles.ticker} testID="live-activity-ticker">
      <View style={styles.liveDot} />
      <Animated.Text
        key={i}
        entering={FadeInUp.duration(350)}
        exiting={FadeOut.duration(200)}
        style={styles.tickerText}
        numberOfLines={1}
      >
        {ACTIVITIES[i]}
      </Animated.Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, todayEarned, streak, dailyTarget, completedTasks } = useApp();
  const targetProgress = Math.min(1, todayEarned / dailyTarget);
  const featured = TASKS.slice(0, 2);
  const rest = TASKS.slice(2);

  return (
    <View style={styles.container} testID="home-screen">
      {/* Sticky glass header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {Platform.OS !== "android" ? (
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        ) : null}
        <View style={styles.headerRow}>
          <Pressable
            testID="home-avatar-button"
            style={styles.avatarWrap}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image source={{ uri: USER.avatar }} style={styles.avatar} contentFit="cover" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetSmall}>Namaste 👋 [UPDATE SUCCESS!]</Text>
            <Text style={styles.greetName}>{USER.name}</Text>
          </View>
          <Pressable testID="home-notification-bell" style={styles.bell} onPress={() => haptic("light")}>
            <Feather name="bell" size={19} color={colors.text} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 76,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sparks Balance Card */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <LinearGradient
            colors={["#2E1065", "#701A75", "#4C0519"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceGlassEdge} />
            <Text style={styles.balanceLabel}>Sparks Balance</Text>
            <View style={styles.balanceRow}>
              <Spark size={30} />
              <CountUp value={balance} style={styles.balanceValue} testID="sparks-balance-value" />
            </View>
            <View style={styles.deltaChip} testID="today-delta-chip">
              <Feather name="trending-up" size={12} color={colors.success} />
              <Text style={styles.deltaText}>Aaj +{todayEarned} ⚡</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Streak + Daily Target */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.streakCard}>
          <ProgressRing size={76} progress={streak / 7}>
            <Text style={styles.streakNum}>{streak}</Text>
            <Text style={styles.streakDays}>days</Text>
          </ProgressRing>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTitle}>🔥 {streak}-day streak chal rahi hai</Text>
            <Text style={styles.targetLabel}>
              Aaj ka Target — {todayEarned}/{dailyTarget} ⚡
            </Text>
            <View style={styles.targetTrack}>
              <LinearGradient
                colors={["#8B5CF6", "#D946EF", "#F43F5E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.targetFill, { width: `${targetProgress * 100}%` }]}
              />
            </View>
          </View>
        </Animated.View>

        {/* Live activity ticker */}
        <Animated.View entering={FadeInDown.delay(180).duration(500)}>
          <LiveTicker />
        </Animated.View>

        {/* Featured tasks — horizontal */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Aaj ke Tasks</Text>
            <Pressable testID="home-see-all-tasks" onPress={() => router.push("/(tabs)/earn")}>
              <Text style={styles.seeAll}>Sab dekho</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.lg }}
          >
            {featured.map((task) => {
              const done = completedTasks.includes(task.id);
              return (
                <Pressable
                  key={task.id}
                  testID={`task-card-${task.id}`}
                  style={styles.featuredCard}
                  onPress={() => {
                    haptic("light");
                    router.push(`/task/${task.id}`);
                  }}
                >
                  <Image source={{ uri: task.banner }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient
                    colors={["rgba(8,10,16,0.15)", "rgba(8,10,16,0.92)"]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={[styles.taskIconBadge, { backgroundColor: `${task.accent}33`, borderColor: `${task.accent}66` }]}>
                    <Feather name={task.icon as never} size={16} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.featuredTitle}>{task.title}</Text>
                  <Text style={styles.featuredSub} numberOfLines={1}>{task.subtitle}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.rewardChip}>
                      <Text style={styles.rewardChipText}>+{task.reward} ⚡</Text>
                    </View>
                    {done ? (
                      <Feather name="check-circle" size={16} color={colors.success} />
                    ) : (
                      <Text style={styles.timeText}>{task.time}</Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Rest — vertical list */}
        <View style={{ marginTop: spacing.md, gap: spacing.md }}>
          {rest.map((task, idx) => {
            const done = completedTasks.includes(task.id);
            return (
              <Animated.View key={task.id} entering={FadeInDown.delay(320 + idx * 80).duration(500)}>
                <Pressable
                  testID={`task-card-${task.id}`}
                  style={styles.taskRow}
                  onPress={() => {
                    haptic("light");
                    router.push(`/task/${task.id}`);
                  }}
                >
                  <View style={[styles.taskIconBadge, { backgroundColor: `${task.accent}22`, borderColor: `${task.accent}55`, marginBottom: 0 }]}>
                    <Feather name={task.icon as never} size={17} color={task.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskRowTitle}>{task.title}</Text>
                    <Text style={styles.taskRowSub} numberOfLines={1}>
                      {task.subtitle} · {task.time}
                    </Text>
                  </View>
                  {done ? (
                    <Feather name="check-circle" size={18} color={colors.success} />
                  ) : (
                    <View style={styles.rewardChip}>
                      <Text style={styles.rewardChipText}>+{task.reward} ⚡</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Platform.OS === "android" ? "rgba(8,10,16,0.97)" : "rgba(8,10,16,0.75)",
    borderBottomWidth: 1,
    borderBottomColor: colors.glassEdge,
    overflow: "hidden",
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: colors.magenta,
    padding: 2,
  },
  avatar: { flex: 1, borderRadius: 18 },
  greetSmall: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  greetName: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.text },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.coral,
  },
  balanceCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: "hidden",
  },
  balanceGlassEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
  },
  balanceLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  balanceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  balanceValue: { fontFamily: fonts.displayBold, fontSize: 44, color: "#fff" },
  deltaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.4)",
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: spacing.md,
  },
  deltaText: { fontFamily: fonts.bold, fontSize: 12, color: colors.success },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  streakNum: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.text },
  streakDays: { fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted },
  streakTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  targetLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 6,
  },
  targetTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface3,
    overflow: "hidden",
  },
  targetFill: { height: "100%", borderRadius: 4 },
  ticker: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
    marginTop: spacing.md,
    overflow: "hidden",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    flexShrink: 0,
  },
  tickerText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.textSecondary, flex: 1 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontFamily: fonts.displayBold, fontSize: 19, color: colors.text },
  seeAll: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.magenta },
  featuredCard: {
    width: 210,
    height: 170,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassEdge,
    padding: spacing.lg,
  },
  taskIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  featuredTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  featuredSub: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textSecondary, marginTop: 2 },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  rewardChip: {
    backgroundColor: "rgba(217,70,239,0.15)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.45)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  rewardChipText: { fontFamily: fonts.bold, fontSize: 11.5, color: "#F0ABFC" },
  timeText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  taskRowTitle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.text },
  taskRowSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
