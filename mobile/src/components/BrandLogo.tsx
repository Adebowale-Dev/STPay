import { StyleSheet, View } from "react-native";

export function BrandLogo({ size }: { size: number }) {
  const ring = size * 0.46;

  return (
    <View style={[styles.brandLogo, { height: size, width: size }]}>
      <View
        style={[
          styles.logoRing,
          {
            height: ring,
            width: ring,
            borderRadius: ring / 2,
            borderColor: "#20c979",
            left: size * 0.08,
            top: size * 0.17,
          },
        ]}
      />
      <View
        style={[
          styles.logoRing,
          {
            height: ring,
            width: ring,
            borderRadius: ring / 2,
            borderColor: "#8df5c3",
            left: size * 0.38,
            top: size * 0.28,
          },
        ]}
      />
      <View
        style={[
          styles.logoRing,
          {
            height: ring,
            width: ring,
            borderRadius: ring / 2,
            borderColor: "#0d8f55",
            left: size * 0.2,
            top: size * 0.38,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  brandLogo: {
    position: "relative",
  },
  logoRing: {
    position: "absolute",
    borderWidth: 10,
    backgroundColor: "transparent",
  },
});
