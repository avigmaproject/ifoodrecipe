import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const COLORS = {
  bg: "#05060A",
  card: "#15151F",
  primary: "#F44336",
  text: "#FFFFFF",
  sub: "#9A9AA5",
  inputBg: "#1C1D26",
};

// 👉 change to your real API base
const LOGIN_URL = "https://api.ifoodtv.com/auth/login";

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // ---- API CALL HERE ----
      const res = await axios.post(LOGIN_URL, {
        email: email.trim(),
        password,
      });

      // 👇 adapt these to your real response
      const token: string = res.data.token;
      const userName: string = res.data.user?.name ?? "User";

      // You can store token in AsyncStorage if you want later
      // await AsyncStorage.setItem('@token', token);

      // Navigate to Welcome screen
      navigation.replace("Welcome", { name: userName });
    } catch (e: any) {
      console.log("login error", e?.response?.data || e?.message);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Unable to login. Please try again.";
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.appName}>iFood.tv</Text>
        <Text style={styles.subtitle}>Recipe videos from around the World</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>Sign in</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.sub}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.sub}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  appName: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.sub,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  heading: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    color: COLORS.sub,
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
