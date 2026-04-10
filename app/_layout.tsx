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
          name="converter"
          options={{
            title: "Unit Converter",
          }}
        />
        <Stack.Screen
          name="bmi"
          options={{
            title: "BMI Calculator",
          }}
        />
        <Stack.Screen
          name="password"
          options={{
            title: "Password Generator",
          }}
        />
        <Stack.Screen
          name="compass"
          options={{
            title: "Compass",
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
