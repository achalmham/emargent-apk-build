import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { GAMES, IMAGES } from "@/src/data/mock";
import { colors, fonts, haptic, radius, spacing, TAB_BAR_HEIGHT } from "@/src/theme";

export default function Games() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { spinsLeft, showToast } = useApp();
  const spin = GAMES[0];
  const others = GAMES.slice(1);

  return (
    <View style={styles.container} testID="games-screen">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Games</Text>
        <Text style={styles.subheading}>Khelo aur Sparks jeeto — roz naye chances</Text>

        {/* Featured: Spin the Wheel */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Pressable
            testID="game-card-spin"
            style={styles.featured}
            onPress={() => {
              haptic("medium");
              router.push("/spin");
            }}
          >
            <Image source={{ uri: IMAGES.wheel }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={["rgba(8,10,16,0.20)", "rgba(8,10,16,0.94)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.playableBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.playableText}>PLAYABLE</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.featuredTitle}>{spin.title}</Text>
            <Text style={styles.featuredTag}>{spin.tagline}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.metaChip}>
                <Feather name="rotate-cw" size={12} color={colors.magenta} />
                <Text style={styles.metaChipText}>{spinsLeft} spin left</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{spin.range}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <LinearGradient
                colors={["#8B5CF6", "#D946EF", "#F43F5E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playBtn}
              >
                <Feather name="play" size={14} color="#fff" />
                <Text style={styles.playBtnText}>Spin karo</Text>
              </LinearGradient>
            </View>
          </Pressable>
        </Animated.View>

        {/* Grid of other games */}
        <View style={styles.grid}>
          {others.map((game, i) => (
            <Animated.View
              key={game.id}
              entering={FadeInDown.delay(120 + i * 80).duration(500)}
              style={styles.gridItem}
            >
              <Pressable
                testID={`game-card-${game.id}`}
                style={styles.gameCard}
                onPress={() => {
                  haptic("light");
                  showToast(`${game.title} jald aa raha hai ⏳`);
                }}
              >
                <View style={[styles.gameIcon, { backgroundColor: `${game.accent}1E`, borderColor: `${game.accent}55` }]}>
                  <Feather name={game.icon as never} size={20} color={game.accent} />
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameTag} numberOfLines={2}>{game.tagline}</Text>
                <View style={styles.gameFooter}>
                  <Text style={styles.gameRange}>{game.range}</Text>
                  <Text style={styles.gameAttempts}>{game.attempts}</Text>
                </View>
                <View style={styles.comingSoon}>
                  <Text style={styles.comingSoonText}>COMING SOON</Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
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
  featured: {
    height: 230,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassEdge,
    padding: spacing.lg,
  },
  playableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.45)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  playableText: { fontFamily: fonts.extraBold, fontSize: 10, color: colors.success, letterSpacing: 1 },
  featuredTitle: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.text },
  featuredTag: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  metaChipText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textSecondary },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  playBtnText: { fontFamily: fonts.bold, fontSize: 13, color: "#fff" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  gridItem: { width: "48%", flexGrow: 1 },
  gameCard: {
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 170,
  },
  gameIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  gameTitle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.text },
  gameTag: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textMuted, marginTop: 3, flex: 1 },
  gameFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  gameRange: { fontFamily: fonts.bold, fontSize: 12, color: "#F0ABFC" },
  gameAttempts: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.textMuted },
  comingSoon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonText: { fontFamily: fonts.extraBold, fontSize: 8.5, color: colors.warning, letterSpacing: 0.8 },
});
