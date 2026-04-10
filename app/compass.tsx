import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Animated, Platform } from "react-native";
import { Magnetometer } from "expo-sensors";
import { SPACING, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");
const COMPASS_SIZE = width * 0.8;

export default function Compass() {
  const { colors, isDark } = useTheme();
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const rotation = new Animated.Value(0);

  const _subscribe = async () => {
    const available = await Magnetometer.isAvailableAsync();
    setIsAvailable(available);

    if (available) {
      Magnetometer.setUpdateInterval(100);
      setSubscription(
        Magnetometer.addListener((result) => {
          setData(result);
        })
      );
    }
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _angle = (magnetometer: { x: number; y: number; z: number }) => {
    let angle = 0;
    if (magnetometer) {
      const { x, y } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const angle = _angle(data);

  // Smooth rotation
  useEffect(() => {
    Animated.timing(rotation, {
      toValue: 360 - angle,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [angle]);

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const getDirection = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) return "N";
    if (degree >= 22.5 && degree < 67.5) return "NE";
    if (degree >= 67.5 && degree < 112.5) return "E";
    if (degree >= 112.5 && degree < 157.5) return "SE";
    if (degree >= 157.5 && degree < 202.5) return "S";
    if (degree >= 202.5 && degree < 247.5) return "SW";
    if (degree >= 247.5 && degree < 292.5) return "W";
    if (degree >= 292.5 && degree < 337.5) return "NW";
    return "N";
  };

  if (isAvailable === false) {
    return (
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
        <Ionicons name="warning-outline" size={64} color={colors.warning} />
        <Text style={StyleSheet.flatten([styles.errorTitle, { color: colors.text }])}>Compass Unavailable</Text>
        <Text style={StyleSheet.flatten([styles.errorSubtitle, { color: colors.textSecondary }])}>
          Your device doesn't support the required magnetometer sensors.
        </Text>
      </View>
    );
  }

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <View style={styles.header}>
        <Text style={StyleSheet.flatten([styles.degreeText, { color: colors.primary }])}>
          {angle}°
        </Text>
        <Text style={StyleSheet.flatten([styles.directionText, { color: colors.text }])}>
          {getDirection(angle)}
        </Text>
      </View>

      <View style={StyleSheet.flatten([styles.compassContainer, { backgroundColor: colors.card }, !isDark && SHADOWS.medium])}>
        <Animated.View style={StyleSheet.flatten([styles.dial, { transform: [{ rotate }] }])}>
          {/* Compass Dial Markers */}
          <Text style={StyleSheet.flatten([styles.marker, styles.markerN, { color: colors.error }])}>N</Text>
          <Text style={StyleSheet.flatten([styles.marker, styles.markerE, { color: colors.text }])}>E</Text>
          <Text style={StyleSheet.flatten([styles.marker, styles.markerS, { color: colors.text }])}>S</Text>
          <Text style={StyleSheet.flatten([styles.marker, styles.markerW, { color: colors.text }])}>W</Text>
          
          <View style={StyleSheet.flatten([styles.centerCircle, { borderColor: colors.border }])} />
        </Animated.View>
        
        {/* Fixed Needle Pointer */}
        <View style={StyleSheet.flatten([styles.fixedNeedle, { backgroundColor: colors.primary }])} />
      </View>

      <Text style={StyleSheet.flatten([styles.footerText, { color: colors.textSecondary }])}>
        Hold your device flat for best accuracy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl * 2,
  },
  degreeText: {
    fontSize: 64,
    fontWeight: "800",
    letterSpacing: -2,
  },
  directionText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: -8,
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  dial: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  centerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  marker: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
  },
  markerN: { top: 20 },
  markerE: { right: 20 },
  markerS: { bottom: 20 },
  markerW: { left: 20 },
  fixedNeedle: {
    position: "absolute",
    top: -10,
    width: 4,
    height: 30,
    borderRadius: 2,
    zIndex: 10,
  },
  footerText: {
    marginTop: SPACING.xl * 2,
    fontSize: 14,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
