// app/datosPersonales.tsx
import MenuHamburguesa from "@/components/MenuHamburguesa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebase";
import styles from "../styles/datosPersonales";

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

export default function DatosPersonales() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Manejo DatePicker
  const [localDate, setLocalDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate && user) {
      setLocalDate(selectedDate);
      setUser({
        ...user,
        fechaNacimiento: selectedDate.toISOString().split("T")[0],
      });
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("/home");
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Carga datos
    (async () => {
      try {
        const dniStored = await AsyncStorage.getItem("loggedDNI");
        if (!dniStored) {
          Alert.alert("Error", "No se encontró usuario logueado");
          router.replace("/login");
          return;
        }
        const snap = await getDoc(doc(db, "usuarios", dniStored));
        if (snap.exists()) {
          const data = snap.data() as User;
          setUser(data);
          setLocalDate(new Date(data.fechaNacimiento));
        } else {
          Alert.alert("Error", "Datos de usuario no encontrados");
          router.replace("/login");
        }
      } catch (err) {
        console.error("❌ Error cargando datos personales:", err);
        Alert.alert("Error", "No se pudo cargar datos");
      } finally {
        setLoading(false);
      }
    })();

    return () => subscription.remove();
  }, []);

  const handleGuardar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "usuarios", user.dni),
        { ...user, updatedAt: serverTimestamp() },
        { merge: true }
      );
      Alert.alert("¡Listo!", "Datos actualizados correctamente");
    } catch (err) {
      console.error("❌ Error guardando datos:", err);
      Alert.alert("Error", "No se pudo guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  if (!user) return null;

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <MenuHamburguesa />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          scrollEnabled={!saving}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Datos Personales</Text>

          <Text style={styles.label}>Código de Usuario</Text>
          <TextInput
            style={styles.input}
            value={user.codigoUsuario}
            editable={false}
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={user.apellido}
            onChangeText={(text) => setUser({ ...user, apellido: text })}
            editable={!saving}
          />

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={user.nombre}
            onChangeText={(text) => setUser({ ...user, nombre: text })}
            editable={!saving}
          />

          <Text style={styles.label}>DNI</Text>
          <TextInput style={styles.input} value={user.dni} editable={false} />

          <Text style={styles.label}>Departamento</Text>
          <TextInput
            style={styles.input}
            value={user.departamento}
            onChangeText={(text) => setUser({ ...user, departamento: text })}
            editable={!saving}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={user.correo}
            onChangeText={(text) => setUser({ ...user, correo: text })}
            keyboardType="email-address"
            editable={!saving}
          />

          <Text style={styles.label}>Fecha de nacimiento</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
            disabled={saving}
          >
            <Text style={{ color: localDate ? "#000" : "#666" }}>
              {localDate
                ? localDate.toLocaleDateString("es-AR")
                : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={localDate || new Date()}
              mode="date"
              display="calendar"
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={user.telefono}
            onChangeText={(text) => setUser({ ...user, telefono: text })}
            keyboardType="phone-pad"
            editable={!saving}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleGuardar}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
