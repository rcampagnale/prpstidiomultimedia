// app/registrarse.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import styles from '../styles/registrarse';

import {
  doc,
  enableNetwork,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export default function Registrarse() {
  const router = useRouter();
  const [apellido, setApellido] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [correo, setCorreo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');

  // Al montar, aseguramos que Firestore use la red (no cache offline)
  useEffect(() => {
    enableNetwork(db).catch(err =>
      console.error('❌ No se pudo forzar la red en Firestore:', err)
    );
  }, []);

  const handleRegister = async () => {
    // 1) Validación de campos
    if (
      !apellido.trim() ||
      !nombre.trim() ||
      !dni.trim() ||
      !departamento.trim() ||
      !correo.trim() ||
      !fechaNacimiento.trim() ||
      !telefono.trim()
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      // 2) Referencia al documento basado en el DNI
      const usuarioRef = doc(db, 'usuarios', dni);
      // 3) ¿Existe ya?
      const snapshot = await getDoc(usuarioRef);
      if (snapshot.exists()) {
        Alert.alert('Error', 'Ya existe un usuario con ese DNI');
        return;
      }

      // 4) Crear documento en Firestore
      await setDoc(usuarioRef, {
        apellido,
        nombre,
        dni,
        departamento,
        correo,
        fechaNacimiento,
        telefono,
        createdAt: serverTimestamp()
      });

      Alert.alert('¡Listo!', 'Usuario registrado correctamente');
      router.replace('/home');
    } catch (err) {
      console.error('❌ Error al completar el registro:', err);
      Alert.alert('Error', 'No se pudo completar el registro');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground
        source={require('../assets/fondologin.jpeg')}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Registrarse</Text>

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#666"
              value={apellido}
              onChangeText={setApellido}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="DNI"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              value={dni}
              onChangeText={setDni}
            />
            <TextInput
              style={styles.input}
              placeholder="Departamento"
              placeholderTextColor="#666"
              value={departamento}
              onChangeText={setDepartamento}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de nacimiento (YYYY-MM-DD)"
              placeholderTextColor="#666"
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
