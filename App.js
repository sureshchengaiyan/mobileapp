import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Load todos from local storage on app start
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const saved = await AsyncStorage.getItem("@todos");
      if (saved) {
        setTodos(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Error loading todos:", e);
    }
  };

  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem("@todos", JSON.stringify(updatedTodos));
    } catch (e) {
      console.log("Error saving todos:", e);
    }
  };

  const addTodo = () => {
    const text = task.trim();
    if (text === "") {
      Alert.alert("Empty Task", "Please enter a task.");
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setTask("");
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((t) => t.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter((t) => !t.completed);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoTextWrapper}
        onPress={() => toggleTodo(item.id)}
      >
        <View
          style={[
            styles.checkbox,
            item.completed && styles.checkboxChecked,
          ]}
        />
        <Text
          style={[
            styles.todoText,
            item.completed && styles.todoTextCompleted,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>My Mobile ToDo ✅</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a task..."
          placeholderTextColor="#9CA3AF"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one! ✨</Text>
        }
      />

      <TouchableOpacity style={styles.clearButton} onPress={clearCompleted}>
        <Text style={styles.clearButtonText}>Clear Completed</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 16,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#f9fafb",
    borderWidth: 1,
    borderColor: "#1f2937",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#f9fafb",
    fontWeight: "700",
  },
  list: {
    flex: 1,
    marginBottom: 12,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  todoTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4b5563",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  todoText: {
    color: "#e5e7eb",
    fontSize: 14,
    flexShrink: 1,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  deleteText: {
    fontSize: 18,
    color: "#f97373",
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
});
