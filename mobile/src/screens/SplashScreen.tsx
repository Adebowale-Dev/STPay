import { StyleSheet, Text, View } from "react-native";

import { BrandLogo } from "../components/BrandLogo";
import { colors } from "../theme";

export function SplashScreen({ isDark }: { isDark: boolean }) {
  const surface = isDark ? colors.background : "#ffffff";
  const text = isDark ? "#ffffff" : "#202031";

  return (
    <View style={[styles.splash, { backgroundColor: surface }]}>
      <BrandLogo size={78} />
      <Text style={[styles.brand, { color: text }]}>STPAY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    marginTop: 6,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});
