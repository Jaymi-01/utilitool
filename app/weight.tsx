import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { SPACING, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

const UNITS = ["Kilograms", "Grams", "Pounds", "Ounces"];

const CONVERSIONS: Record<string, (val: number) => number> = {
  "Kilograms-Grams": (v) => v * 1000,
  "Kilograms-Pounds": (v) => v * 2.20462,
  "Kilograms-Ounces": (v) => v * 35.274,
  "Grams-Kilograms": (v) => v / 1000,
  "Pounds-Kilograms": (v) => v / 2.20462,
  "Ounces-Kilograms": (v) => v / 35.274,
};

function convert(val: number, from: string, to: string): string {
  if (from === to) return val.toString();
  
  let baseVal = val;
  if (from !== "Kilograms") {
    baseVal = CONVERSIONS[`${from}-Kilograms`](val);
  }
  
  if (to === "Kilograms") return baseVal.toFixed(4);
  return CONVERSIONS[`Kilograms-${to}`](baseVal).toFixed(4);
}

export default function WeightConverter() {
  const { colors, isDark } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(UNITS[0]);
  const [toUnit, setToUnit] = useState(UNITS[2]);
  const [result, setResult] = useState("0");

  const handleConvert = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResult("0");
      return;
    }
    setResult(convert(val, fromUnit, toUnit));
  };

  return (
    <ScrollView contentContainerStyle={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card }, !isDark && SHADOWS.medium])}>
        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>From</Text>
        <View style={styles.pickerContainer}>
          {UNITS.map((u) => (
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
          placeholder="Enter weight"
          placeholderTextColor={colors.textSecondary}
          value={inputValue}
          onChangeText={setInputValue}
        />

        <View style={styles.swapIcon}>
          <Ionicons name="swap-vertical" size={24} color={colors.primary} />
        </View>

        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>To</Text>
        <View style={styles.pickerContainer}>
          {UNITS.map((u) => (
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
