// app/Test.js
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import '../firebase'; // ajusta la ruta si tu firebase.js está en otro lugar

console.log('🔥 Test.js cargado');

export default function Test() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    console.log('⏳ Iniciando fetch de usuarios...');
    (async () => {
      try {
        const db = getFirestore();
        const snap = await getDocs(collection(db, 'usuarios'));
        console.log('✅ Snap recibido, número de documentos:', snap.size);
        setCount(snap.size);
      } catch (e) {
        console.error('❌ Error al obtener usuarios:', e);
      }
    })();
  }, []);

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding: 16 }}>
      <Text style={{ fontSize: 18 }}>
        Documentos en “usuarios”: {count !== null ? count : 'cargando...'}
      </Text>
    </View>
  );
}
