import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { SPACING, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

type UnitType = "Length" | "Weight" | "Temperature";

const UNITS = {
  Length: ["Meters", "Kilometers", "Miles", "Feet", "Inches", "Centimeters"],
  Weight: ["Kilograms", "Grams", "Pounds", "Ounces"],
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
};

const CONVERSIONS: Record<string, (val: number) => number> = {
  // Length (Base: Meters)
  "Meters-Kilometers": (v) => v / 1000,
  "Meters-Miles": (v) => v * 0.000621371,
  "Meters-Feet": (v) => v * 3.28084,
  "Meters-Inches": (v) => v * 39.3701,
  "Meters-Centimeters": (v) => v * 100,
  "Kilometers-Meters": (v) => v * 1000,
  "Kilometers-Miles": (v) => v * 0.621371,
  "Miles-Meters": (v) => v / 0.000621371,
  "Miles-Kilometers": (v) => v * 1.60934,
  "Feet-Meters": (v) => v / 3.28084,
  "Inches-Meters": (v) => v / 39.3701,
  "Centimeters-Meters": (v) => v / 100,

  // Weight (Base: Kilograms)
  "Kilograms-Grams": (v) => v * 1000,
  "Kilograms-Pounds": (v) => v * 2.20462,
  "Kilograms-Ounces": (v) => v * 35.274,
  "Grams-Kilograms": (v) => v / 1000,
  "Pounds-Kilograms": (v) => v / 2.20462,
  "Ounces-Kilograms": (v) => v / 35.274,

  // Temperature
  "Celsius-Fahrenheit": (v) => (v * 9) / 5 + 32,
  "Celsius-Kelvin": (v) => v + 273.15,
  "Fahrenheit-Celsius": (v) => ((v - 32) * 5) / 9,
  "Fahrenheit-Kelvin": (v) => ((v - 32) * 5) / 9 + 273.15,
  "Kelvin-Celsius": (v) => v - 273.15,
  "Kelvin-Fahrenheit": (v) => ((v - 273.15) * 9) / 5 + 32,
};

function convert(val: number, from: string, to: string, type: UnitType): string {
  if (from === to) return val.toString();
  const key = `${from}-${to}`;
  
  if (CONVERSIONS[key]) {
    return CONVERSIONS[key](val).toFixed(4);
  }

  // Fallback for complex relative conversions (Length/Weight via Base)
  if (type === "Length" || type === "Weight") {
    const base = type === "Length" ? "Meters" : "Kilograms";
    const toBaseKey = `${from}-${base}`;
    const fromBaseKey = `${base}-${to}`;
    
    let baseVal = val;
    if (from !== base) {
        baseVal = CONVERSIONS[toBaseKey](val);
    }
    
    if (to === base) return baseVal.toFixed(4);
    return CONVERSIONS[fromBaseKey](baseVal).toFixed(4);
  }

  return "Error";
}

export default function Converter() {
  const { colors, isDark } = useTheme();
  const [type, setType] = useState<UnitType>("Length");
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(UNITS.Length[0]);
  const [toUnit, setToUnit] = useState(UNITS.Length[1]);
  const [result, setResult] = useState("0");

  useEffect(() => {
    setFromUnit(UNITS[type][0]);
    setToUnit(UNITS[type][1]);
  }, [type]);

  const handleConvert = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResult("0");
      return;
    }
    setResult(convert(val, fromUnit, toUnit, type));
  };

  return (
    <ScrollView contentContainerStyle={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <View style={StyleSheet.flatten([styles.tabContainer, { backgroundColor: colors.card }, !isDark && SHADOWS.small])}>
        {(["Length", "Weight", "Temperature"] as UnitType[]).map((t) => (
          <Pressable
            key={t}
            style={StyleSheet.flatten([styles.tab, type === t && { backgroundColor: colors.primary }])}
            onPress={() => setType(t)}
          >
            <Text style={StyleSheet.flatten([styles.tabText, { color: type === t ? colors.white : colors.textSecondary }])}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card }, !isDark && SHADOWS.medium])}>
        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>From ({fromUnit})</Text>
        <View style={styles.pickerContainer}>
          {UNITS[type].map((u) => (
            <Pressable
              key={u}
              style={StyleSheet.flatten([
                styles.unitChip, 
                { backgroundColor: colors.background, borderColor: colors.border },
                fromUnit === u && { backgroundColor: colors.primaryLight, borderColor: colors.primary }
              ])}
              onPress={() => setFromUnit(u)}
            >
              <Text style={StyleSheet.flatten([
                styles.unitChipText, 
                { color: colors.textSecondary },
                fromUnit === u && { color: colors.primaryDark, fontWeight: "600" }
              ])}>{u}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text }])}
          keyboardType="numeric"
          placeholder="Enter value"
          placeholderTextColor={colors.textSecondary}
          value={inputValue}
          onChangeText={setInputValue}
        />

        <View style={styles.swapIcon}>
          <Ionicons name="swap-vertical" size={24} color={colors.primary} />
        </View>

        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>To ({toUnit})</Text>
        <View style={styles.pickerContainer}>
          {UNITS[type].map((u) => (
            <Pressable
              key={u}
              style={StyleSheet.flatten([
                styles.unitChip, 
                { backgroundColor: colors.background, borderColor: colors.border },
                toUnit === u && { backgroundColor: colors.primaryLight, borderColor: colors.primary }
              ])}
              onPress={() => setToUnit(u)}
            >
              <Text style={StyleSheet.flatten([
                styles.unitChipText, 
                { color: colors.textSecondary },
                toUnit === u && { color: colors.primaryDark, fontWeight: "600" }
              ])}>{u}</Text>
            </Pressable>
          ))}
        </View>

        <View style={StyleSheet.flatten([styles.resultContainer, { backgroundColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.resultLabel, { color: colors.textSecondary }])}>Result</Text>
          <Text style={StyleSheet.flatten([styles.resultValue, { color: colors.primary }])}>{result}</Text>
        </View>

        <Pressable style={StyleSheet.flatten([styles.button, { backgroundColor: colors.primary }])} onPress={handleConvert}>
          <Text style={StyleSheet.flatten([styles.buttonText, { color: colors.white }])}>Convert</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabText: {
    fontWeight: "bold",
  },
  card: {
    borderRadius: 20,
    padding: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 18,
    marginBottom: SPACING.md,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: SPACING.md,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  unitChipText: {
    fontSize: 12,
  },
  swapIcon: {
    alignItems: "center",
    marginVertical: SPACING.sm,
  },
  resultContainer: {
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
