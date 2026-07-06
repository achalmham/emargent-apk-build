import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CHECKIN_TODAY_INDEX, useApp } from "@/src/context/AppContext";
import { RewardModal } from "@/src/components/RewardModal";
import { MILESTONES } from "@/src/data/mock";
import { colors, fonts, haptic, radius, spacing, TAB_BAR_HEIGHT } from "@/src/theme";

const DAY_REWARDS = [10, 15, 20, 25, 20, 30, 500];

export default function Rewards() {
  const insets = useSafeAreaInsets();
  const {
    checkedInDays,
    checkIn,
    mysteryOpened,
    openMysteryBox,
    adWatched,
    watchAd,
    showToast,
  } = useApp();
  const [modal, setModal] = useState<{ amount: number; title: string } | null>(null);
  const [adPlaying, setAdPlaying] = useState(false);
  const boxShake = useSharedValue(0);
  const todayDone = checkedInDays.includes(CHECKIN_TODAY_INDEX);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${boxShake.value}deg` }],
  }));

  const handleCheckIn = () => {
    if (todayDone) {
      showToast("Aaj ka check-in ho chuka hai ✓");
      return;
    }
    checkIn();
    setModal({ amount: 20, title: "Daily check-in done!" });
  };

  const handleMystery = () => {
    if (mysteryOpened) {
      showToast("Mystery Box kal phir milega 🎁");
      return;
    }
    haptic("heavy");
    boxShake.value = withSequence(
      withRepeat(withTiming(6, { duration: 70 }), 6, true),
      withTiming(0, { duration: 60 }),
    );
    setTimeout(() => {
      const amount = openMysteryBox();
      setModal({ amount, title: "Mystery Box khul gaya!" });
    }, 600);
  };

  const handleAd = () => {
    if (adWatched) {
      showToast("Aaj ka ad reward mil chuka hai ✓");
      return;
    }
    setAdPlaying(true);
    setTimeout(() => {
      setAdPlaying(false);
      watchAd();
      setModal({ amount: 30, title: "Ad reward credited!" });
    }, 3000);
  };

  return (
    <View style={styles.container} testID="rewards-screen">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Rewards</Text>
        <Text style={styles.subheading}>Roz aao, roz kamao — streak mat todo</Text>

        {/* 7-day check-in */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>7-Day Check-in</Text>
            <Text style={styles.cardHint}>Day 7 = +500 ⚡</Text>
          </View>
          <View style={styles.daysRow}>
            {DAY_REWARDS.map((amt, i) => {
              const done = checkedInDays.includes(i);
              const isToday = i === CHECKIN_TODAY_INDEX;
              return (
                <View
                  key={i}
                  style={[
                    styles.dayCell,
                    done && styles.dayCellDone,
                    isToday && !done && styles.dayCellToday,
                  ]}
                  testID={`checkin-day-${i + 1}`}
                >
                  {done ? (
                    <Feather name="check" size={14} color={colors.success} />
                  ) : (
                    <Text style={[styles.dayAmt, isToday && { color: "#F0ABFC" }]}>
                      {amt}
                    </Text>
                  )}
                  <Text style={styles.dayLabel}>D{i + 1}</Text>
                </View>
              );
            })}
          </View>
          <Pressable
            testID="checkin-claim-button"
            style={[styles.claimBtn, todayDone && { opacity: 0.5 }]}
            onPress={handleCheckIn}
          >
            <LinearGradient
              colors={["#8B5CF6", "#D946EF", "#F43F5E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.claimGrad}
            >
              <Text style={styles.claimText}>
                {todayDone ? "Aaj claim ho gaya ✓" : "Aaj ka +20 ⚡ claim karo"}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Mystery Box */}
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <Pressable testID="mystery-box-card" onPress={handleMystery}>
            <LinearGradient
              colors={["#2E1065", "#4A044E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.mysteryCard]}
            >
              <Animated.View style={[styles.boxIcon, boxStyle]}>
                <Feather name="gift" size={30} color="#F0ABFC" />
              </Animated.View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Mystery Box</Text>
                <Text style={styles.mysterySub}>
                  {mysteryOpened
                    ? "Kal phir naya box milega 🎁"
                    : "Aaj ka box khulne ka wait kar raha hai — 50 se 250 ⚡ tak"}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Watch Ad */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
          <View style={styles.adRow}>
            <View style={[styles.boxIcon, { backgroundColor: "rgba(244,63,94,0.12)", borderColor: "rgba(244,63,94,0.4)" }]}>
              <Feather name="play-circle" size={26} color={colors.coral} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Watch Ad</Text>
              <Text style={styles.mysterySub}>
                {adPlaying ? "Ad chal raha hai… 30 sec" : "30 sec video = +30 ⚡"}
              </Text>
            </View>
            <Pressable
              testID="watch-ad-button"
              style={[styles.adBtn, (adWatched || adPlaying) && { opacity: 0.5 }]}
              onPress={handleAd}
            >
              <Text style={styles.adBtnText}>
                {adWatched ? "Done ✓" : adPlaying ? "Playing…" : "Dekho"}
              </Text>
            </Pressable>
          </View>
          {adPlaying ? (
            <View style={styles.adProgress} testID="ad-progress-bar">
              <AdProgressFill />
            </View>
          ) : null}
        </Animated.View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>Bonus Milestones</Text>
        <View style={{ gap: spacing.md }}>
          {MILESTONES.map((m, i) => (
            <Animated.View
              key={m.id}
              entering={FadeInDown.delay(280 + i * 80).duration(500)}
              style={styles.milestone}
              testID={`milestone-${m.id}`}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <View style={styles.milestoneTrack}>
                  <LinearGradient
                    colors={["#8B5CF6", "#D946EF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.milestoneFill, { width: `${(m.progress / m.total) * 100}%` }]}
                  />
                </View>
                <Text style={styles.milestoneProgress}>
                  {m.progress}/{m.total} complete
                </Text>
              </View>
              <View style={styles.rewardChip}>
                <Text style={styles.rewardText}>+{m.reward} ⚡</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <RewardModal
        visible={!!modal}
        amount={modal?.amount ?? 0}
        title={modal?.title}
        primaryLabel="Awesome!"
        onPrimary={() => setModal(null)}
      />
    </View>
  );
}

function AdProgressFill() {
  const w = useSharedValue(0);
  React.useEffect(() => {
    w.value = withTiming(100, { duration: 3000 });
  }, [w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <Animated.View style={[{ height: "100%", borderRadius: 3, backgroundColor: colors.coral }, style]} />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  heading: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.text },
  subheading: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  cardTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  cardHint: { fontFamily: fonts.semiBold, fontSize: 11.5, color: "#F0ABFC" },
  daysRow: { flexDirection: "row", gap: 6, marginBottom: spacing.lg },
  dayCell: {
    flex: 1,
    aspectRatio: 0.82,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayCellDone: {
    backgroundColor: "rgba(16,185,129,0.10)",
    borderColor: "rgba(16,185,129,0.45)",
  },
  dayCellToday: { borderColor: colors.magenta, backgroundColor: "rgba(217,70,239,0.10)" },
  dayAmt: { fontFamily: fonts.displayBold, fontSize: 13, color: colors.textSecondary },
  dayLabel: { fontFamily: fonts.regular, fontSize: 9, color: colors.textMuted },
  claimBtn: { borderRadius: radius.pill, overflow: "hidden" },
  claimGrad: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  claimText: { fontFamily: fonts.bold, fontSize: 14.5, color: "#fff" },
  mysteryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    borderColor: colors.glassEdge,
  },
  boxIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(217,70,239,0.12)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  mysterySub: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  adRow: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  adBtn: {
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexShrink: 0,
  },
  adBtnText: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.text },
  adProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface3,
    marginTop: spacing.md,
    overflow: "hidden",
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 19,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  milestone: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  milestoneTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  milestoneTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface3,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 5,
  },
  milestoneFill: { height: "100%", borderRadius: 3 },
  milestoneProgress: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  rewardChip: {
    backgroundColor: "rgba(217,70,239,0.15)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.45)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  rewardText: { fontFamily: fonts.bold, fontSize: 12, color: "#F0ABFC" },
});
