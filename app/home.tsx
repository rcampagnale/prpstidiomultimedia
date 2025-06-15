// app/home.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import MenuHamburguesa from '../components/MenuHamburguesa';
import styles from '../styles/home';

// Obtener ancho de pantalla
const { width } = Dimensions.get('window');

type Video = { id: string; thumbnail: string; title: string };
export default function Home() {
  const router = useRouter();

  // YouTube Data API config
  const API_KEY = 'AIzaSyCOFNt7kfvX3uOyXnI2JKn3XTdyEN6fcwg';
  const CHANNEL_ID = 'UCTxuQm3eOMKLWQuKjkC2oxQ';
  const [loading, setLoading] = React.useState(true);
  const [videos, setVideos] = React.useState<Video[]>([]);

 // Load top videos from channel, ordered by view count
  useEffect(() => {
    setLoading(true);
    async function fetchTopVideos() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
            `key=${API_KEY}&channelId=${CHANNEL_ID}` +
            `&part=snippet&order=viewCount&maxResults=10&type=video`
        );
        const data = await res.json();
        const items = Array.isArray(data.items)
          ? data.items.map((item: any) => ({
              id: item.id.videoId,
              thumbnail: item.snippet.thumbnails.medium.url,
              title: item.snippet.title,
            }))
          : [];
        setVideos(items);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopVideos();
  }, []);

// Handler to play video; param name must match [videoId].js
const handlePlay = (id: string) => {
  router.push({ pathname: '/watch/[videoId]', params: { videoId: id } });
};
  // Example program carousel data
  const programs = [
    { title: 'Programa 1', time: 'Lunes 10:00 AM', image: require('../assets/programa1.jpeg') },
    { title: 'Programa 2', time: 'Martes 12:00 PM', image: require('../assets/programa1.jpeg') },
    { title: 'Programa 3', time: 'Miércoles 6:00 PM', image: require('../assets/programa1.jpeg') },
  ];

  // Sponsors with auto-scroll
  const sponsors = [
    { name: 'Auspiciador A', info: 'Descripción A', image: require('../assets/fondohome.jpeg') },
    { name: 'Auspiciador B', info: 'Descripción B', image: require('../assets/fondohome.jpeg') },
    { name: 'Auspiciador C', info: 'Descripción C', image: require('../assets/fondohome.jpeg') },
  ];
  const sliderRef = useRef<ScrollView>(null);
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % sponsors.length;
      sliderRef.current?.scrollTo({ x: idx * (width * 0.8 + 16), animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={require('../assets/programa1.jpeg')} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <MenuHamburguesa />
          {/* Header */}
          <View style={[styles.header, { justifyContent: 'space-between', paddingHorizontal: 8 }]}>  
            <Text style={styles.greeting}>Bienvenido</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => router.push('/login')} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#0070f3', borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/registrarse')} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#28a745', borderRadius: 8, marginLeft: 8 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Live Stream */}
            <View style={styles.contentZone}>
              <Text style={styles.title}>¡Programación en vivo!</Text>
              <Text style={styles.subtitle}>TRANSMISIÓN EN VIVO</Text>
              <View style={styles.videoContainer}>
                <WebView source={{ uri: 'https://www.youtube.com/watch?v=osD2ZVGomjw&t=5s' }} style={{ flex: 1 }} />
              </View>
            </View>
            <View style={styles.divider} />
            {/* Weekly Programming */}
            <View style={styles.programCarouselWrapper}>
              <Text style={styles.sectionTitle}>Programación Semanal</Text>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.programCarousel}>
                {programs.map((p, i) => (
                  <View key={i} style={[styles.programCard, { width: width * 0.7 }]}>  
                    <Image source={p.image} style={styles.programImage} />
                    <View style={styles.programInfo}>
                      <Text style={styles.programTitle}>{p.title}</Text>
                      <Text style={styles.programTime}>{p.time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.divider} />
            {/* Top Videos */}
            <View style={styles.contentZone}>
              <Text style={styles.title}>Lo más visto</Text>
              {loading ? <ActivityIndicator size="large" color="#0070f3" /> : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.programCarousel}>
                  {videos.map((vid, idx) => (
                    <TouchableOpacity key={`${vid.id}-${idx}`} style={[styles.programCard, { width: width * 0.6 }]} onPress={() => handlePlay(vid.id)}>
                      <Image source={{ uri: vid.thumbnail }} style={styles.programImage} />
                      <View style={styles.programInfo}>
                        <Text style={styles.programTitle} numberOfLines={2}>{vid.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.divider} />
            {/* Sponsors Carousel */}
            <View style={styles.contentZone}>
              <Text style={styles.title}>Auspiciantes</Text>
              <ScrollView ref={sliderRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sponsorCarousel}>
                {sponsors.map((s, i) => (
                  <View key={i} style={[styles.sponsorCard, { width: width * 0.8 }]}>  
                    <Image source={s.image} style={styles.sponsorImage} />
                    <Text style={styles.sponsorName}>{s.name}</Text>
                    <Text style={styles.sponsorInfo}>{s.info}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
