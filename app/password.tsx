import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Switch } from "react-native";
import { SPACING, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

export default function PasswordGenerator() {
  const { colors, isDark } = useTheme();
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = async () => {
    if (password) {
      await Clipboard.setStringAsync(password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert("Password copied to clipboard!");
    }
  };

  return (
    <ScrollView contentContainerStyle={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <View style={StyleSheet.flatten([styles.resultCard, { backgroundColor: colors.card }, !isDark && SHADOWS.medium])}>
        <Text style={StyleSheet.flatten([styles.passwordText, { color: colors.text }])}>{password || "Click Generate"}</Text>
        <Pressable onPress={copyToClipboard} style={StyleSheet.flatten([styles.copyButton, { backgroundColor: colors.primaryLight }])}>
          <Ionicons name="copy-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={StyleSheet.flatten([styles.settingsCard, { backgroundColor: colors.card }, !isDark && SHADOWS.medium])}>
        <View style={StyleSheet.flatten([styles.settingRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Length: {length}</Text>
          <View style={styles.lengthControls}>
            <Pressable 
              style={StyleSheet.flatten([styles.controlButton, { backgroundColor: colors.primary }])} 
              onPress={() => {
                setLength(Math.max(4, length - 1));
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="remove" size={24} color={colors.white} />
            </Pressable>
            <Pressable 
              style={StyleSheet.flatten([styles.controlButton, { backgroundColor: colors.primary }])} 
              onPress={() => {
                setLength(Math.min(32, length + 1));
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="add" size={24} color={colors.white} />
            </Pressable>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.settingRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Include Uppercase</Text>
          <Switch
            value={includeUppercase}
            onValueChange={setIncludeUppercase}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={includeUppercase ? colors.primary : colors.white}
          />
        </View>

        <View style={StyleSheet.flatten([styles.settingRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Include Numbers</Text>
          <Switch
            value={includeNumbers}
            onValueChange={setIncludeNumbers}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={includeNumbers ? colors.primary : colors.white}
          />
        </View>

        <View style={StyleSheet.flatten([styles.settingRow, { borderBottomColor: colors.background }])}>
          <Text style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Include Symbols</Text>
          <Switch
            value={includeSymbols}
            onValueChange={setIncludeSymbols}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={includeSymbols ? colors.primary : colors.white}
          />
        </View>

        <Pressable style={StyleSheet.flatten([styles.generateButton, { backgroundColor: colors.primary }])} onPress={generatePassword}>
          <Text style={StyleSheet.flatten([styles.generateButtonText, { color: colors.white }])}>Generate Password</Text>
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
  resultCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  passwordText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    fontFamily: "System",
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
  },
  settingsCard: {
    borderRadius: 20,
    padding: SPACING.lg,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  lengthControls: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  generateButton: {
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
