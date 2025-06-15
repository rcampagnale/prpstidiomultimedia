import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../styles/[videoId]';

export default function WatchVideo() {
  // Obtener params de la ruta
  const params = new URLSearchParams();
  const router = useRouter();
  const videoId = params.get('videoId');

  // Si no hay videoId, mostrar error
  if (!videoId) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>No se encontró el video.</Text>
      </SafeAreaView>
    );
  }

  // URL embed sin cookies
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.videoWrapper}>
        <WebView
          source={{ uri: embedUrl }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator size="large" color="#0070f3" style={styles.loader} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}