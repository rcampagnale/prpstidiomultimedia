import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  enableNetwork,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebase";
import styles from "../styles/registrarse";

type User = {
  apellido: string;
  nombre: string;
  dni: string;
  departamento: string;
  correo: string;
  fechaNacimiento: string;
  telefono: string;
  codigoUsuario: string;
};

export default function Registrarse() {
  const router = useRouter();
  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  // Fecha de nacimiento
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setFechaNacimiento(selectedDate);
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("/homeVisitante");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    enableNetwork(db).catch((err) =>
      console.error("Error habilitando red Firestore:", err)
    );
  }, []);

  const handleRegister = async () => {
    if (
      !apellido.trim() ||
      !nombre.trim() ||
      !dni.trim() ||
      !departamento.trim() ||
      !correo.trim() ||
      !fechaNacimiento ||
      !telefono.trim()
    ) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const usuarioRef = doc(db, "usuarios", dni);
      const counterRef = doc(db, "counters", "userCode");
      const snapshot = await getDoc(usuarioRef);

      if (snapshot.exists()) {
        const existing = snapshot.data() as User;
        Alert.alert(
          "Info",
          `Usuario ya registrado.\nTu código: ${existing.codigoUsuario}`
        );
        router.replace("/home");
      } else {
        // Antes de la transacción, escanear existentes para corregir contador
        const usersSnap = await getDocs(collection(db, "usuarios"));
        const maxNum = usersSnap.docs.reduce((max, d) => {
          const data = d.data() as { codigoUsuario?: string };
          if (data.codigoUsuario) {
            const n = parseInt(data.codigoUsuario.replace("prpstudio", ""), 10);
            return isNaN(n) ? max : Math.max(max, n);
          }
          return max;
        }, 0);

        // Transacción de generación de código
        let codigoUsuario = "";
        await runTransaction(db, async (tx) => {
          const ctrSnap = await tx.get(counterRef);
          let last = ctrSnap.exists()
            ? (ctrSnap.data().lastNumber as number)
            : 0;
          // sincronizar con maxNum
          if (maxNum > last) last = maxNum;
          const next = last + 1;
          tx.set(counterRef, { lastNumber: next }, { merge: true });
          codigoUsuario = `prpstudio${String(next).padStart(2, "0")}`;
        });

        // Crear nuevo usuario
        await setDoc(usuarioRef, {
          apellido,
          nombre,
          dni,
          departamento,
          correo,
          fechaNacimiento: fechaNacimiento.toISOString().split("T")[0],
          telefono,
          codigoUsuario,
          createdAt: serverTimestamp(),
        });

        Alert.alert(
          "¡Listo!",
          `Usuario registrado correctamente.\nTu código para los sorteo: ${codigoUsuario}`
        );
        router.replace("/home");
      }
    } catch (err) {
      console.error("❌ Error al completar el registro:", err);
      Alert.alert("Error", "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require("../assets/fondologin.jpeg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={!loading}
          >
            <Text style={styles.title}>Registrarse</Text>

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#666"
              value={apellido}
              onChangeText={setApellido}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={setNombre}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="DNI"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              value={dni}
              onChangeText={setDni}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Departamento"
              placeholderTextColor="#666"
              value={departamento}
              onChangeText={setDepartamento}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={{ color: fechaNacimiento ? "#000" : "#666" }}>
                {fechaNacimiento
                  ? fechaNacimiento.toLocaleDateString("es-AR")
                  : "Fecha de nacimiento"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={fechaNacimiento || new Date(2000, 0, 1)}
                mode="date"
                display="calendar"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
