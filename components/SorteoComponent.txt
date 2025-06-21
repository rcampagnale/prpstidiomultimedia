import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebase';

type Raffle = { id: string; titulo: string; imagen: string };

export default function SorteoComponent() {
  const router = useRouter();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [participating, setParticipating] = useState<Set<string>>(new Set());
  const [userCode, setUserCode] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSorteos, setLoadingSorteos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dni = await AsyncStorage.getItem('loggedDNI');
        if (!dni) throw new Error('No hay DNI guardado');
        const snap = await getDoc(doc(db, 'usuarios', dni));
        if (!snap.exists()) throw new Error('Usuario no registrado');
        setUserCode(snap.data()?.codigoUsuario);
      } catch {
        router.replace('/login');
        return;
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loadingUser) return;
    const unsub = onSnapshot(
      query(collection(db, 'sorteo'), orderBy('orden', 'asc')),
      (snap) => {
        const arr = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        setRaffles(arr);
        setLoadingSorteos(false);
      },
      (e) => {
        setError('Error cargando sorteos');
        setLoadingSorteos(false);
        console.error('Error cargando sorteos:', e);
      }
    );
    return () => unsub();
  }, [loadingUser]);

  useEffect(() => {
    if (loadingUser || loadingSorteos || !userCode) return;
    const unsubs = raffles.map(r =>
      onSnapshot(
        doc(db, 'codigo_sorteos', r.id, 'participantes', userCode),
        (snap) => {
          setParticipating(prev => {
            const next = new Set(prev);
            if (snap.exists()) next.add(r.id);
            else next.delete(r.id);
            return next;
          });
        }
      )
    );
    return () => unsubs.forEach(fn => fn());
  }, [raffles, userCode, loadingUser, loadingSorteos]);

  const showMsg = (msg: string) => {
    Platform.OS === 'android'
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert(msg);
  };

  const handleParticipate = useCallback(
    async (raffleId: string) => {
      if (!userCode) return;
      const ref = doc(db, 'codigo_sorteos', raffleId, 'participantes', userCode);
      const generateRef = doc(db, 'generar_sorteos', raffleId, 'participantes', userCode);
      try {
        if (participating.has(raffleId)) {
          await deleteDoc(ref);
          await deleteDoc(generateRef);
          showMsg('Has salido del sorteo');
        } else {
          await setDoc(ref, { joinedAt: serverTimestamp() });
          await setDoc(generateRef, { codigoUsuario: userCode, joinedAt: serverTimestamp() });
          showMsg('Te has unido al sorteo');
        }
      } catch (e: any) {
        setError(e.message || 'Error al actualizar participación');
        console.error('Error al actualizar participación:', e);
      }
    },
    [participating, userCode]
  );

  if (loadingUser || loadingSorteos) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
  if (error) {
    return (
      <View style={{ flex:1,justifyContent:'center',alignItems:'center',padding:16 }}>
        <Text style={{ color:'red', textAlign:'center' }}>{error}</Text>
      </View>
    );
  }

  if (raffles.length === 0) {
    return (
      <View style={{ flex:1,justifyContent:'center',alignItems:'center',padding:16 }}>
        <Text>No hay sorteos disponibles</Text>
      </View>
    );
  }

  return (
    <View>
      {raffles.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleParticipate(item.id)}
          style={{ flexDirection:'row',alignItems:'center',marginVertical:8,paddingHorizontal:16 }}
        >
          <Image source={{ uri: item.imagen }} style={{ width:80,height:80,borderRadius:8 }} />
          <View style={{ marginLeft:12, flex:1 }}>
            <Text style={{ fontWeight:'bold' }}>{item.titulo}</Text>
            {participating.has(item.id) && (
              <Text style={{ color:'green', marginTop:4 }}>✔ Participando</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
