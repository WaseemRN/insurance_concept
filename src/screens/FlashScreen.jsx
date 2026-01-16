import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import vitalisLogo from "../assets/images/vitalis.png";
const { width, height } = Dimensions.get("window");

const FlashScreen = () => {
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(1); // Pulse animation
  const fadeAnim = new Animated.Value(1);  // Fade out animation
  const gridAnim = new Animated.Value(0);  // Grid expansion

  useEffect(() => {
    // Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // After 3 seconds, expand to grid and fade out
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(gridAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace("Splash"); 
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Interpolate grid animation to scale and opacity
  const gridScale = gridAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 20], // Expand a lot
  });

  const gridOpacity = gridAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2], // Light thin grid
  });

  return (
    <View style={styles.container}>
      {/* Expanding digital grid */}
      <Animated.View
        style={[
          styles.grid,
          { transform: [{ scale: gridScale }], opacity: gridOpacity },
        ]}
      />

      {/* Logo */}
      <Animated.Image
        source={vitalisLogo}
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Deep black
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  grid: {
    position: "absolute",
    width: width,
    height: height,
    borderWidth: 0.5,
    borderColor: "#00ffff", // cyan digital grid
  },
});

export default FlashScreen;