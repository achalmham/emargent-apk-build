import React, { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context/AppContext";
import { OFFERS, Offer } from "@/src/data/mock";
import { colors, fonts, haptic, radius, spacing, TAB_BAR_HEIGHT } from "@/src/theme";

const FILTERS = [
  { id: "all", label: "Sab" },
  { id: "quick", label: "⚡ Quick" },
  { id: "high", label: "💎 High Reward" },
  { id: "new", label: "✨ New" },
] as const;

export default function Earn() {
  const insets = useSafeAreaInsets();
  const { showToast } = useApp();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? OFFERS : OFFERS.filter((o) => o.tags.includes(filter as never));

  const renderOffer = ({ item, index }: { item: Offer; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(450)}>
      <Pressable
        testID={`offer-card-${item.id}`}
        style={styles.offerCard}
        onPress={() => {
          haptic("light");
          showToast("Offer jald live hoga — prototype mode ⚙️");
        }}
      >
        <View style={[styles.offerIcon, { backgroundColor: `${item.accent}1E`, borderColor: `${item.accent}55` }]}>
          <Feather name={item.icon as never} size={19} color={item.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.offerBrand}>{item.brand}</Text>
          <Text style={styles.offerTitle}>{item.title}</Text>
          <Text style={styles.offerDesc} numberOfLines={1}>{item.desc}</Text>
        </View>
        <View style={styles.rewardChip}>
          <Text style={styles.rewardText}>+{item.reward} ⚡</Text>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.container} testID="earn-screen">
      {/* Sticky header + filter chips */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.heading}>Earn</Text>
        <Text style={styles.subheading}>Active offers — jitna karo, utna kamao</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
          contentContainerStyle={styles.chipRowContent}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <Pressable
                key={f.id}
                testID={`earn-filter-${f.id}`}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => {
                  haptic("light");
                  setFilter(f.id);
                }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        renderItem={renderOffer}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty} testID="earn-empty-state">
            <Feather name="inbox" size={36} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aaj koi offer nahi — kal check karo</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  heading: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.text },
  subheading: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  chipRow: { height: 56, marginHorizontal: -spacing.lg },
  chipRowContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chipActive: {
    backgroundColor: "rgba(217,70,239,0.16)",
    borderColor: colors.magenta,
  },
  chipText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textMuted },
  chipTextActive: { color: "#F0ABFC" },
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  offerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  offerBrand: {
    fontFamily: fonts.extraBold,
    fontSize: 10.5,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  offerTitle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.text, marginTop: 2 },
  offerDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
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
  empty: { alignItems: "center", paddingTop: 80, gap: spacing.md },
  emptyText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textMuted },
});
