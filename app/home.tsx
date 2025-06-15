import { useRouter } from 'expo-router';
import React from 'react';
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

// Obtenemos ancho de pantalla para carrusel
const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  // Datos de ejemplo para el carrusel
  const programs = [
    { title: 'Programa 1', time: 'Lunes 10:00 AM', image: require('../assets/programa1.jpeg') },
    { title: 'Programa 2', time: 'Martes 12:00 PM', image: require('../assets/programa1.jpeg') },
    { title: 'Programa 3', time: 'Miércoles 6:00 PM', image: require('../assets/programa1.jpeg') },
  ];

  // Datos de ejemplo para "Lo más visto"
  const [loading, setLoading] = React.useState(false);
  const [videos, setVideos] = React.useState([
    { id: '6-aGIiQH4-k', thumbnail: 'https://img.youtube.com/vi/6-aGIiQH4-k/0.jpg', title: 'Video destacado 1' },
    { id: '6-aGIiQH4-k', thumbnail: 'https://img.youtube.com/vi/6-aGIiQH4-k/1.jpg', title: 'Video destacado 1' },
    { id: '6-aGIiQH4-k', thumbnail: 'https://img.youtube.com/vi/6-aGIiQH4-k/2.jpg', title: 'Video destacado 1' },
  ]);

  const handlePlay = (id: string) => {
    // Navega a la pantalla de reproducción
    router.push({ pathname: '/watch/videoId', params: { videoId: id } });
  };

  return (
    <>
      {/* Barra de estado transparente */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Fondo con imagen de programa1.jpeg */}
      <ImageBackground source={require('../assets/programa1.jpeg')} style={{ flex: 1 }}>
        {/* Contenedor principal */}
        <SafeAreaView style={styles.container}>
          <MenuHamburguesa />

          {/* Header con saludo */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hola Rubén Bienvenido</Text>
          </View>

          {/* Divisor */}
          <View style={styles.divider} />

          {/* Contenido scrollable */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Transmisión en vivo sin publicidad */}
            <View style={styles.contentZone}>
              <Text style={styles.title}>¡Programación en vivo!</Text>
              <Text style={styles.subtitle}>TRANSMISIÓN EN VIVO</Text>
              <View style={styles.videoContainer}>
                <WebView
                  source={{ uri: 'https://www.youtube-nocookie.com/embed/6-aGIiQH4-k?autoplay=1&controls=1&modestbranding=1&rel=0' }}
                  style={{ flex: 1 }}
                  javaScriptEnabled
                  domStorageEnabled
                  allowsInlineMediaPlayback
                />
              </View>
            </View>

            {/* Carrusel de programación */}
            <View style={styles.divider} />
            <View style={styles.programCarouselWrapper}>
              <Text style={styles.sectionTitle}>Programación Semanal</Text>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.programCarousel}>
                {programs.map((p, i) => (
                  <View key={i} style={[styles.programCard, { width: width * 0.7 }]}>  
                    <ImageBackground source={p.image} style={styles.programImage} />
                    <View style={styles.programInfo}>
                      <Text style={styles.programTitle}>{p.title}</Text>
                      <Text style={styles.programTime}>{p.time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Lo más visto */}
            <View style={styles.divider} />
            <View style={styles.contentZone}>
              <Text style={styles.title}>Lo más visto</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#0070f3" />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.programCarousel}>
                  {videos.map((video) => (
                    <TouchableOpacity key={video.id} style={[styles.programCard, { width: width * 0.6 }]} onPress={() => handlePlay(video.id)}>
                      <Image source={{ uri: video.thumbnail }} style={styles.programImage} />
                      <View style={styles.programInfo}>
                        <Text style={styles.programTitle} numberOfLines={2}>{video.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Secciones adicionales */}
            <View style={styles.divider} />
            <View style={styles.contentZone}>
              <Text style={styles.title}>Auspiciantes</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
