// app/datosPersonales.tsx
import MenuHamburguesa from '@/components/MenuHamburguesa';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebase';
import styles from '../styles/datosPersonales';

type User = {
  apellido: string;
  nombre: string;
  dni: string;
  departamento: string;
  correo: string;
  fechaNacimiento: string;
  telefono: string;
};

export default function DatosPersonales() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Cargar datos del usuario
  useEffect(() => {
    (async () => {
      try {
        const dniStored = await AsyncStorage.getItem('loggedDNI');
        if (!dniStored) {
          Alert.alert('Error', 'No se encontró usuario logueado');
          router.replace('/login');
          return;
        }
        const snap = await getDoc(doc(db, 'usuarios', dniStored));
        if (snap.exists()) setUser(snap.data() as User);
        else {
          Alert.alert('Error', 'Datos de usuario no encontrados');
          router.replace('/login');
        }
      } catch (err) {
        console.error('❌ Error cargando datos personales:', err);
        Alert.alert('Error', 'No se pudo cargar datos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleGuardar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'usuarios', user.dni),
        { ...user, updatedAt: serverTimestamp() },
        { merge: true }
      );
      Alert.alert('¡Listo!', 'Datos actualizados correctamente');
    } catch (err) {
      console.error('❌ Error guardando datos:', err);
      Alert.alert('Error', 'No se pudo guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>      
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          scrollEnabled={!saving}
          keyboardShouldPersistTaps="handled"
        >
          <MenuHamburguesa />
          <View style={styles.divider} />
          <Text style={styles.title}>Datos Personales</Text>

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={user.apellido}
            onChangeText={text => setUser({ ...user, apellido: text })}
            editable={!saving}
          />

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={user.nombre}
            onChangeText={text => setUser({ ...user, nombre: text })}
            editable={!saving}
          />

          <Text style={styles.label}>DNI</Text>
          <TextInput
            style={styles.input}
            value={user.dni}
            editable={false}
          />

          <Text style={styles.label}>Departamento</Text>
          <TextInput
            style={styles.input}
            value={user.departamento}
            onChangeText={text => setUser({ ...user, departamento: text })}
            editable={!saving}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={user.correo}
            onChangeText={text => setUser({ ...user, correo: text })}
            keyboardType="email-address"
            editable={!saving}
          />

          <Text style={styles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={user.fechaNacimiento}
            onChangeText={text => setUser({ ...user, fechaNacimiento: text })}
            editable={!saving}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={user.telefono}
            onChangeText={text => setUser({ ...user, telefono: text })}
            keyboardType="phone-pad"
            editable={!saving}
          />

          <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
