import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { SPACING, SHADOWS } from "../constants/theme";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

export default function BMICalculator() {
  const { colors, isDark } = useTheme();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m

    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      setBmi(bmiValue);

      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 25) setCategory("Normal");
      else if (bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "Normal": return colors.success;
      case "Underweight": return colors.warning;
      case "Overweight": return colors.warning;
      case "Obese": return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView contentContainerStyle={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card }, !isDark && SHADOWS.medium])}>
        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>Weight (kg)</Text>
        <TextInput
          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text }])}
          keyboardType="numeric"
          placeholder="e.g. 70"
          placeholderTextColor={colors.textSecondary}
          value={weight}
          onChangeText={setWeight}
        />

        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>Height (cm)</Text>
        <TextInput
          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text }])}
          keyboardType="numeric"
          placeholder="e.g. 175"
          placeholderTextColor={colors.textSecondary}
          value={height}
          onChangeText={setHeight}
        />

        <Pressable style={StyleSheet.flatten([styles.button, { backgroundColor: colors.primary }])} onPress={calculateBMI}>
          <Text style={StyleSheet.flatten([styles.buttonText, { color: colors.white }])}>Calculate BMI</Text>
        </Pressable>

        {bmi !== null && (
          <View style={StyleSheet.flatten([styles.resultContainer, { borderTopColor: colors.border }])}>
            <Text style={StyleSheet.flatten([styles.resultLabel, { color: colors.textSecondary }])}>Your BMI</Text>
            <Text style={StyleSheet.flatten([styles.resultValue, { color: colors.primary }])}>{bmi.toFixed(1)}</Text>
            <View style={StyleSheet.flatten([styles.categoryChip, { backgroundColor: getCategoryColor() + "20" }])}>
              <Text style={StyleSheet.flatten([styles.categoryText, { color: getCategoryColor() }])}>{category}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={StyleSheet.flatten([styles.infoCard, { backgroundColor: colors.card }, !isDark && SHADOWS.small])}>
        <Text style={StyleSheet.flatten([styles.infoTitle, { color: colors.text }])}>BMI Categories</Text>
        <View style={StyleSheet.flatten([styles.infoRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.infoLabel, { color: colors.textSecondary }])}>Underweight</Text>
          <Text style={StyleSheet.flatten([styles.infoValue, { color: colors.text }])}>{"< 18.5"}</Text>
        </View>
        <View style={StyleSheet.flatten([styles.infoRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.infoLabel, { color: colors.textSecondary }])}>Normal</Text>
          <Text style={StyleSheet.flatten([styles.infoValue, { color: colors.text }])}>18.5 – 24.9</Text>
        </View>
        <View style={StyleSheet.flatten([styles.infoRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.infoLabel, { color: colors.textSecondary }])}>Overweight</Text>
          <Text style={StyleSheet.flatten([styles.infoValue, { color: colors.text }])}>25.0 – 29.9</Text>
        </View>
        <View style={StyleSheet.flatten([styles.infoRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.infoLabel, { color: colors.textSecondary }])}>Obese</Text>
          <Text style={StyleSheet.flatten([styles.infoValue, { color: colors.text }])}>{"≥ 30.0"}</Text>
        </View>
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
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
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
  resultContainer: {
    marginTop: SPACING.xl,
    alignItems: "center",
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
  },
  resultLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    borderRadius: 16,
    padding: SPACING.lg,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoLabel: {
  },
  infoValue: {
    fontWeight: "600",
  },
});
