import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SPACING, SHADOWS } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "@utilitool_tasks";

export default function TaskManager() {
  const { colors, isDark } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  };

  const handleAddOrUpdateTask = () => {
    if (inputText.trim() === "") return;

    if (editingId) {
      setTasks(prev => prev.map(t => 
        t.id === editingId ? { ...t, text: inputText } : t
      ));
      setEditingId(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        text: inputText,
        completed: false,
      };
      setTasks(prev => [newTask, ...prev]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setInputText("");
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const deleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          setTasks(prev => prev.filter(t => t.id !== id));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      }
    ]);
  };

  const startEditing = (task: Task) => {
    setInputText(task.text);
    setEditingId(task.id);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={StyleSheet.flatten([styles.taskItem, { backgroundColor: colors.card }, !isDark && SHADOWS.small])}>
      <Pressable onPress={() => toggleTask(item.id)} style={styles.taskContent}>
        <View style={StyleSheet.flatten([
          styles.checkbox, 
          { borderColor: colors.primary },
          item.completed && { backgroundColor: colors.primary }
        ])}>
          {item.completed && <Ionicons name="checkmark" size={16} color={colors.white} />}
        </View>
        <Text style={StyleSheet.flatten([
          styles.taskText, 
          { color: colors.text },
          item.completed && { color: colors.textSecondary, textDecorationLine: "line-through" }
        ])}>
          {item.text}
        </Text>
      </Pressable>
      
      <View style={styles.actions}>
        <Pressable onPress={() => startEditing(item)} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </Pressable>
        <Pressable onPress={() => deleteTask(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}
      keyboardVerticalOffset={100}
    >
      <View style={styles.inputSection}>
        <TextInput
          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
          placeholder={editingId ? "Edit task..." : "Add a new task..."}
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAddOrUpdateTask}
        />
        <Pressable 
          style={StyleSheet.flatten([styles.addButton, { backgroundColor: colors.primary }])} 
          onPress={handleAddOrUpdateTask}
        >
          <Ionicons name={editingId ? "checkmark-circle" : "add"} size={32} color={colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={colors.border} />
            <Text style={StyleSheet.flatten([styles.emptyText, { color: colors.textSecondary }])}>
              Your list is empty. Add a task to get started!
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputSection: {
    flexDirection: "row",
    padding: SPACING.lg,
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  taskText: {
    fontSize: 16,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: SPACING.xl,
  },
});
