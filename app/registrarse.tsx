// app/registrarse.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

  const handleRegister = async () => {
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
      const stored = await AsyncStorage.getItem('users');
      const users: User[] = stored ? JSON.parse(stored) : [];
      const exists = users.some(
        (u) => u.dni === dni || u.correo.toLowerCase() === correo.toLowerCase()
      );
      if (exists) {
        Alert.alert('Error', 'Ya existe un usuario con ese DNI o correo');
        return;
      }
      const newUser: User = { apellido, nombre, dni, departamento, correo, fechaNacimiento, telefono };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      router.replace('/home');
    } catch (err) {
      console.error(err);
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