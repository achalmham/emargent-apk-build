import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/src/context/AppContext";
import { GradientButton } from "@/src/components/GradientButton";
import { IMAGES } from "@/src/data/mock";
import { colors, fonts, haptic, spacing } from "@/src/theme";

const { width: W } = Dimensions.get("window");

const SLIDES = [
  {
    id: "s1",
    image: IMAGES.neon1,
    icon: "trending-up" as const,
    title: "Real Instagram Growth",
    body: "Lakhon creators InstaVault se apni reach badha rahe hain. Ab app se aur bhi easy.",
  },
  {
    id: "s2",
    image: IMAGES.neon2,
    icon: "zap" as const,
    title: "Task complete karo,\nSparks kamao",
    body: "Chhote tasks, games aur daily rewards — har din Sparks ka stack badhao.",
  },
  {
    id: "s3",
    image: IMAGES.wheel,
    icon: "refresh-cw" as const,
    title: "Sparks se Real Views",
    body: "App me kamao, bot par order karo. Sparks → Views ka loop, bilkul seamless.",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { setOnboarded } = useApp();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    setOnboarded();
    router.replace("/login");
  };

  const next = () => {
    if (isLast) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / W))
        }
        renderItem={({ item }) => (
          <ImageBackground source={{ uri: item.image }} style={styles.slide}>
            <LinearGradient
              colors={["rgba(8,10,16,0.35)", "rgba(8,10,16,0.75)", colors.surface]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.slideContent}>
              <View style={styles.iconBadge}>
                <Feather name={item.icon} size={22} color={colors.magenta} />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </ImageBackground>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <GradientButton
          testID="onboarding-next-button"
          title={isLast ? "Get Started" : "Next"}
          onPress={next}
        />
        {!isLast && (
          <Pressable
            testID="onboarding-skip-button"
            onPress={() => {
              haptic("light");
              finish();
            }}
            style={styles.skip}
          >
            <Text style={styles.skipText}>Skip karo</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  slide: { width: W, flex: 1, justifyContent: "flex-end" },
  slideContent: { paddingHorizontal: spacing.xl, paddingBottom: 190 },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(217,70,239,0.12)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    lineHeight: 38,
    color: colors.text,
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface3,
  },
  dotActive: { backgroundColor: colors.magenta, width: 22 },
  skip: { alignSelf: "center", padding: spacing.md, marginTop: spacing.xs },
  skipText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textMuted },
});
