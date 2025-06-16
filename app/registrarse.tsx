import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { doc, enableNetwork, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { db } from '../firebase';
import styles from '../styles/registrarse';

type User = {
  apellido: string;
  nombre: string;
  dni: string;
  departamento: string;
  correo: string;
  fechaNacimiento: string;
  telefono: string;
};

export default function Registrarse() {
  const router = useRouter();
  const [apellido, setApellido] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [correo, setCorreo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  // Forzar red en Firestore
  useEffect(() => {
    enableNetwork(db).catch(err => console.error('Error habilitando red Firestore:', err));
  }, []);

  const handleRegister = async () => {
    if (
      !apellido.trim() || !nombre.trim() || !dni.trim() ||
      !departamento.trim() || !correo.trim() ||
      !fechaNacimiento.trim() || !telefono.trim()
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const usuarioRef = doc(db, 'usuarios', dni);
      const snapshot = await getDoc(usuarioRef);
      if (snapshot.exists()) {
        Alert.alert('Error', 'Ya existe un usuario con ese DNI');
        return;
      }

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
      await AsyncStorage.setItem('loggedDNI', dni);
      router.replace('/home');
    } catch (err) {
      console.error('❌ Error al completar el registro:', err);
      Alert.alert('Error', 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNav = () => {
    Alert.alert('Registro', 'Funcionalidad de registro pendiente');
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={require('../assets/fondologin.jpeg')} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={!loading}>
            <Text style={styles.title}>Registrarse</Text>

            <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#666" value={apellido} onChangeText={setApellido} editable={!loading} />
            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#666" value={nombre} onChangeText={setNombre} editable={!loading} />
            <TextInput style={styles.input} placeholder="DNI" placeholderTextColor="#666" keyboardType="number-pad" value={dni} onChangeText={setDni} editable={!loading} />
            <TextInput style={styles.input} placeholder="Departamento" placeholderTextColor="#666" value={departamento} onChangeText={setDepartamento} editable={!loading} />
            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} editable={!loading} />
            <TextInput style={styles.input} placeholder="Fecha de nacimiento (YYYY-MM-DD)" placeholderTextColor="#666" value={fechaNacimiento} onChangeText={setFechaNacimiento} editable={!loading} />
            <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#666" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} editable={!loading} />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
