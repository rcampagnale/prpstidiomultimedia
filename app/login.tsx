// app/login.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/login";
// Importar Firestore
import { doc, enableNetwork, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Asegurar conexión con Firestore
  useEffect(() => {
    enableNetwork(db).catch(err => console.error("Error habilitando red Firestore:", err));
  }, []);

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    // Usuario y contraseña deben ser el mismo DNI
    if (username !== password) {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
      return;
    }

    try {
      // Buscar usuario en Firestore
      const userRef = doc(db, "usuarios", username);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        Alert.alert("Error", "Usuario no encontrado");
        return;
      }
      // Login exitoso
      router.replace("/home");
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      Alert.alert("Error", "No se pudo iniciar sesión");
    }
  };

  const handleRegister = () => {
    Alert.alert("Registro", "Funcionalidad de registro pendiente");
  };

  return (
    <ImageBackground
      source={require("../assets/fondologin.jpeg")}
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <Text style={styles.title1}>
        Bienvenidos a{"\n"}PRP STUDIO MULTIMEDIA
      </Text>

      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
      >
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario (DNI)"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña (DNI)"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 24, textAlign: "center", color: "#fff" }}>
          Sigue nuestras redes sociales:
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "80%",
            alignSelf: "center",
            marginTop: 16,
          }}
        >
          <TouchableOpacity onPress={() => { /* Abrir Facebook */ }}>
            <Image
              source={require("../assets/facebook1.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Abrir YouTube */ }}>
            <Image
              source={require("../assets/youtube.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Abrir Instagram */ }}>
            <Image
              source={require("../assets/instagram.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Abrir Twitch */ }}>
            <Image
              source={require("../assets/twitch1.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
            width: "100%",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>Contacto:</Text>
          <TouchableOpacity onPress={() => { /* Abrir WhatsApp */ }} style={{ marginLeft: 8 }}>
            <Image
              source={require("../assets/logowsp.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

