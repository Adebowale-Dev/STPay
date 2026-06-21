import { useState } from "react";
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

const onboardingSlides = [
  {
    title: "Fastest Payment in the world",
    text: "Send money, fund your wallet, and move through payments quickly with STPay.",
    variant: "growth",
  },
  {
    title: "The most Secure Platform for Customer",
    text: "Built-in PIN protection, verification, and account safety tools keep you protected.",
    variant: "security",
  },
  {
    title: "Paying for Everything is Easy and Convenient",
    text: "Handle airtime, bills, wallet transfers, and banking actions from one simple app.",
    variant: "success",
  },
] as const;

type OnboardingVariant = (typeof onboardingSlides)[number]["variant"];

export function OnboardingScreen({ isDark, onFinish }: { isDark: boolean; onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const slide = onboardingSlides[index];
  const last = index === onboardingSlides.length - 1;
  const surface = isDark ? colors.background : "#ffffff";
  const title = isDark ? "#ffffff" : "#232333";
  const subtitle = isDark ? "rgba(255,255,255,0.42)" : "#8b929d";

  function next() {
    if (last) {
      onFinish();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <SafeAreaView style={[styles.onboarding, { backgroundColor: surface }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={surface} />

      <View style={styles.illustration}>
        <OnboardingArt variant={slide.variant} isDark={isDark} />
      </View>

      <View style={styles.dots}>
        {onboardingSlides.map((item, itemIndex) => (
          <View
            key={item.title}
            style={[
              styles.dot,
              itemIndex === index && styles.dotActive,
              itemIndex !== index && { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#dbe7f8" },
            ]}
          />
        ))}
      </View>

      <View style={styles.copy}>
        <Text style={[styles.title, { color: title }]}>{slide.title}</Text>
        <Text style={[styles.text, { color: subtitle }]}>{slide.text}</Text>
      </View>

      <Pressable style={styles.button} onPress={next}>
        <Text style={styles.buttonText}>{last ? "Get Started" : "Next"}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function OnboardingArt({ variant, isDark }: { variant: OnboardingVariant; isDark: boolean }) {
  const panel = isDark ? "#eef5ff" : "#ffffff";
  const ink = "#23233a";

  return (
    <View style={styles.artStage}>
      {variant === "growth" ? (
        <>
          <View style={[styles.chatBubble, { backgroundColor: isDark ? "#ffffff" : "#eef4ff" }]}>
            <View style={styles.chatDot} />
            <View style={styles.chatDot} />
            <View style={styles.chatDot} />
          </View>
          <View style={[styles.chartPanel, { backgroundColor: panel }]}>
            <View style={styles.chartLine} />
            <View style={[styles.chartBar, { height: 42, left: 38 }]} />
            <View style={[styles.chartBar, { height: 60, left: 72 }]} />
            <View style={[styles.chartBar, { height: 78, left: 106 }]} />
            <View style={[styles.percentCard, { right: 14, top: 54 }]}>
              <Text style={styles.percentText}>90%</Text>
            </View>
          </View>
          <Person x={42} y={84} />
          <MoneyBag />
        </>
      ) : null}

      {variant === "security" ? (
        <>
          <View style={[styles.securityPanel, { backgroundColor: panel }]}>
            <View style={styles.cardSmall} />
            <View style={styles.pieCircle} />
            <View style={styles.infoLine} />
            <View style={[styles.infoLine, { width: 50, top: 82 }]} />
          </View>
          <View style={[styles.floatIcon, { left: 10, top: 44 }]}>
            <Text style={styles.floatText}>%</Text>
          </View>
          <View style={[styles.floatIcon, { right: 48, top: 8 }]}>
            <Text style={styles.floatText}>$</Text>
          </View>
          <Person x={170} y={96} />
          <View style={styles.secureBase} />
        </>
      ) : null}

      {variant === "success" ? (
        <>
          <View style={[styles.cashNote, { left: 18, top: 92, transform: [{ rotate: "-22deg" }] }]}>
            <Text style={styles.cashText}>$</Text>
          </View>
          <View style={[styles.cashNote, { right: 22, top: 92, transform: [{ rotate: "22deg" }] }]}>
            <Text style={styles.cashText}>$</Text>
          </View>
          <View style={styles.coinStack} />
          <View style={[styles.coinStack, { left: 82, top: 150, height: 82 }]} />
          <View style={styles.trophy}>
            <Text style={styles.trophyText}>★</Text>
          </View>
          <Person x={112} y={56} />
          <Text style={[styles.successInk, { color: ink }]}>✓</Text>
        </>
      ) : null}
    </View>
  );
}

function Person({ x, y }: { x: number; y: number }) {
  return (
    <View style={[styles.person, { left: x, top: y }]}>
      <View style={styles.head} />
      <View style={styles.body} />
      <View style={styles.legOne} />
      <View style={styles.legTwo} />
    </View>
  );
}

function MoneyBag() {
  return (
    <View style={styles.moneyBag}>
      <Text style={styles.moneyBagText}>$</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  onboarding: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  illustration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  artStage: {
    height: 285,
    width: 280,
    position: "relative",
  },
  chatBubble: {
    position: "absolute",
    left: 0,
    top: 36,
    height: 18,
    width: 42,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  chatDot: {
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: "#23233a",
  },
  chartPanel: {
    position: "absolute",
    left: 20,
    top: 60,
    height: 130,
    width: 220,
    borderRadius: 8,
    borderWidth: 5,
    borderColor: "#8df5c3",
  },
  chartLine: {
    position: "absolute",
    left: 36,
    top: 72,
    width: 92,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#20c979",
    transform: [{ rotate: "-26deg" }],
  },
  chartBar: {
    position: "absolute",
    bottom: 22,
    width: 10,
    borderRadius: 6,
    backgroundColor: "#20c979",
  },
  percentCard: {
    position: "absolute",
    height: 42,
    width: 64,
    borderRadius: 8,
    backgroundColor: "#ddfbea",
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    color: "#0d8f55",
    fontSize: 9,
    fontWeight: "900",
  },
  person: {
    position: "absolute",
    height: 140,
    width: 74,
  },
  head: {
    position: "absolute",
    top: 0,
    left: 28,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#ffd8c2",
  },
  body: {
    position: "absolute",
    top: 22,
    left: 18,
    height: 70,
    width: 38,
    borderRadius: 10,
    backgroundColor: "#20c979",
  },
  legOne: {
    position: "absolute",
    top: 88,
    left: 23,
    height: 48,
    width: 10,
    borderRadius: 6,
    backgroundColor: "#23233a",
    transform: [{ rotate: "12deg" }],
  },
  legTwo: {
    position: "absolute",
    top: 88,
    left: 43,
    height: 48,
    width: 10,
    borderRadius: 6,
    backgroundColor: "#23233a",
    transform: [{ rotate: "-10deg" }],
  },
  moneyBag: {
    position: "absolute",
    right: 6,
    bottom: 42,
    height: 74,
    width: 72,
    borderRadius: 30,
    backgroundColor: "#20c979",
    alignItems: "center",
    justifyContent: "center",
  },
  moneyBagText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
  },
  securityPanel: {
    position: "absolute",
    left: 48,
    top: 62,
    height: 116,
    width: 188,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: "#8df5c3",
  },
  cardSmall: {
    position: "absolute",
    left: -8,
    top: -10,
    height: 58,
    width: 70,
    borderRadius: 8,
    backgroundColor: "#23233a",
  },
  pieCircle: {
    position: "absolute",
    left: 58,
    top: 26,
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "#20c979",
  },
  infoLine: {
    position: "absolute",
    left: 116,
    top: 44,
    height: 8,
    width: 54,
    borderRadius: 999,
    backgroundColor: "#23233a",
  },
  floatIcon: {
    position: "absolute",
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: "#f7f8ff",
    alignItems: "center",
    justifyContent: "center",
  },
  floatText: {
    color: "#23233a",
    fontWeight: "900",
  },
  secureBase: {
    position: "absolute",
    left: 54,
    top: 206,
    height: 28,
    width: 158,
    borderRadius: 999,
    backgroundColor: "#f7f8ff",
    borderWidth: 4,
    borderColor: "#20c979",
  },
  cashNote: {
    position: "absolute",
    height: 96,
    width: 62,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#f7f8ff",
    backgroundColor: "#3a4271",
    alignItems: "center",
    justifyContent: "center",
  },
  cashText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
  },
  coinStack: {
    position: "absolute",
    left: 34,
    top: 166,
    height: 76,
    width: 68,
    borderRadius: 18,
    backgroundColor: "#ffcf4d",
  },
  trophy: {
    position: "absolute",
    right: 72,
    top: 34,
    height: 52,
    width: 48,
    borderRadius: 12,
    backgroundColor: "#ffae25",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "22deg" }],
  },
  trophyText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  successInk: {
    position: "absolute",
    right: 96,
    top: 52,
    fontSize: 20,
    fontWeight: "900",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 26,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: "#20c979",
  },
  copy: {
    alignItems: "center",
    paddingHorizontal: 14,
  },
  title: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 32,
  },
  text: {
    marginTop: 14,
    maxWidth: 275,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 22,
  },
  button: {
    alignSelf: "center",
    height: 50,
    minWidth: 210,
    paddingHorizontal: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#20c979",
    marginTop: 42,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
});
