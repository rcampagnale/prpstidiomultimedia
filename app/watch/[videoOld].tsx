// app/watch/[videoOld].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../styles/[videoOld]';

export default function WatchVideo() {
  const router = useRouter();
  const { videoOld } = useLocalSearchParams<{ videoOld: string }>();

  if (!videoOld) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>No se encontró el video.</Text>
      </SafeAreaView>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoOld}?autoplay=1&controls=1&modestbranding=1&rel=0`;

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
            <ActivityIndicator size="large" style={styles.loader} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
