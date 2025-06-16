// app/datosPersonales.tsx

import MenuHamburguesa from '@/components/MenuHamburguesa';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles/datosPersonales';

export default function DatosPersonales() {
  const router = useRouter();

  // Datos simulados
  const [nombre, setNombre] = useState('Rubén Darío Campagnale');
  const [dni, setDni] = useState('30123456');
  const [correo, setCorreo] = useState('ruben_campagnale@hotmail.com');

  const handleGuardar = () => {
    console.log('Datos guardados:', { nombre, dni, correo });
    alert('Datos guardados localmente (simulado)');
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <MenuHamburguesa />
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.divider} />
        <Text style={styles.title}>Datos Personales</Text>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>DNI</Text>
        <TextInput
          style={styles.input}
          value={dni}
          onChangeText={setDni}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
