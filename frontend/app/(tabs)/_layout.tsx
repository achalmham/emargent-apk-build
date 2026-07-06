import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, fonts, haptic, TAB_BAR_HEIGHT } from "@/src/theme";

const TABS: { name: string; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { name: "home", label: "Home", icon: "home" },
  { name: "games", label: "Games", icon: "play" },
  { name: "earn", label: "Earn", icon: "zap" },
  { name: "rewards", label: "Rewards", icon: "gift" },
  { name: "profile", label: "Profile", icon: "user" },
];

function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      {Platform.OS !== "android" ? (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              testID={`tab-${tab.name}`}
              style={styles.item}
              onPress={() => {
                haptic("light");
                if (!focused) navigation.navigate(route.name);
              }}
            >
              <Feather
                name={tab.icon}
                size={21}
                color={focused ? colors.magenta : colors.textMuted}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {tab.label}
              </Text>
              {focused ? <View style={styles.indicator} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="games" />
      <Tabs.Screen name="earn" />
      <Tabs.Screen name="rewards" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      Platform.OS === "android" ? "rgba(10,13,20,0.98)" : "rgba(10,13,20,0.80)",
    borderTopWidth: 1,
    borderTopColor: colors.glassEdge,
    overflow: "hidden",
  },
  row: { flexDirection: "row", height: TAB_BAR_HEIGHT },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  label: { fontFamily: fonts.semiBold, fontSize: 10.5, color: colors.textMuted },
  labelActive: { color: colors.magenta },
  indicator: {
    position: "absolute",
    top: 0,
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.magenta,
  },
});
