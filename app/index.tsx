import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SPACING, SHADOWS } from "../constants/theme";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

interface ToolCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: any;
}

function ToolCard({ title, description, icon, href }: ToolCardProps) {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const cardStyle = StyleSheet.flatten([
    styles.card,
    { backgroundColor: colors.card },
    isDark ? styles.cardDark : SHADOWS.small
  ]);

  return (
    <Link href={href} asChild>
      <Pressable style={cardStyle} onPress={handlePress}>
        <View style={StyleSheet.flatten([styles.iconContainer, { backgroundColor: colors.primaryLight }])}>
          <Ionicons name={icon} size={32} color={colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>{title}</Text>
          <Text style={StyleSheet.flatten([styles.cardDescription, { color: colors.textSecondary }])}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.border} />
      </Pressable>
    </Link>
  );
}

export default function Index() {
  const { colors, toggleTheme, isDark } = useTheme();

  return (
    <ScrollView contentContainerStyle={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Pressable 
              onPress={() => {
                toggleTheme();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              style={{ marginRight: SPACING.md }}
            >
              <Ionicons 
                name={isDark ? "sunny" : "moon"} 
                size={24} 
                color={colors.primary} 
              />
            </Pressable>
          ),
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.primary,
        }} 
      />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>UtiliTool</Text>
          <View style={StyleSheet.flatten([styles.badge, { backgroundColor: colors.primaryLight }])}>
            <Text style={StyleSheet.flatten([styles.badgeText, { color: colors.primaryDark }])}>v1.2</Text>
          </View>
        </View>
        <Text style={StyleSheet.flatten([styles.tagline, { color: colors.textSecondary }])}>Universal Converter & Productivity Toolkit.</Text>
      </View>

      <View style={styles.toolsList}>
        <ToolCard
          title="Length Converter"
          description="Meters, Kilometers, Miles, Feet..."
          icon="expand"
          href="/length"
        />
        <ToolCard
          title="Weight Converter"
          description="Kilograms, Grams, Pounds, Ounces..."
          icon="scale"
          href="/weight"
        />
        <ToolCard
          title="Temperature Converter"
          description="Celsius, Fahrenheit, Kelvin"
          icon="thermometer"
          href="/temperature"
        />
        <ToolCard
          title="Task Manager"
          description="Create & manage your daily checklist"
          icon="list"
          href="/tasks"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  header: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
  },
  toolsList: {
    gap: SPACING.md,
  },
  card: {
    borderRadius: 16,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  cardDark: {
    borderWidth: 1,
    borderColor: '#374151',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
  },
});
