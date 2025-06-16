import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
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
import { db } from "../firebase";
import styles from "../styles/login";

export default function Login() {
  const router = useRouter();
  const [dni, setDni] = useState<string>("");

  const handleLogin = async () => {
    if (!dni.trim()) {
      Alert.alert("Error", "Por favor ingresa tu DNI");
      return;
    }

    try {
      console.log("🔍 Verificando DNI en Firestore:", dni);
      const userRef = doc(db, "usuarios", dni);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        Alert.alert("Error", "Usuario inexistente");
        return;
      }
      // Opcional: guardar DNI para Home
      await AsyncStorage.setItem("loggedDNI", dni);
      console.log("✅ loggedDNI guardado en AsyncStorage:", dni);
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

      <SafeAreaView style={[styles.container, { backgroundColor: "transparent" }]}>        
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="DNI"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          autoCapitalize="none"
          value={dni}
          onChangeText={setDni}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        

        <Text style={{ marginTop: 24, textAlign: "center", color: "#fff" }}>
          Sigue nuestras redes sociales:
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around", width: "80%", alignSelf: "center", marginTop: 16 }}>
          <TouchableOpacity onPress={() => { /* Abrir Facebook */ }}>
            <Image source={require("../assets/facebook1.png")} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Abrir YouTube */ }}>
            <Image source={require("../assets/youtube.png")} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Abrir Instagram */ }}>
            <Image source={require("../assets/instagram.png")} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Abrir Twitch */ }}>
            <Image source={require("../assets/twitch1.png")} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24, width: "100%" }}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Contacto:</Text>
          <TouchableOpacity onPress={() => { /* Abrir WhatsApp */ }} style={{ marginLeft: 8 }}>
            <Image source={require("../assets/logowsp.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
