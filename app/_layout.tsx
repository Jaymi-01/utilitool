import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function RootLayoutContent() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "UtiliTool",
          }}
        />
        <Stack.Screen
          name="length"
          options={{
            title: "Length Converter",
          }}
        />
        <Stack.Screen
          name="weight"
          options={{
            title: "Weight Converter",
          }}
        />
        <Stack.Screen
          name="temperature"
          options={{
            title: "Temperature Converter",
          }}
        />
        <Stack.Screen
          name="tasks"
          options={{
            title: "Task Manager",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
