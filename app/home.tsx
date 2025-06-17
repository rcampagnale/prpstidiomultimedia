// app/home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  doc,
  getDoc
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import MenuHamburguesa from "../components/MenuHamburguesa";
import { db } from "../firebase";
import styles from "../styles/home";

// Obtener ancho de pantalla
const { width } = Dimensions.get("window");

type Video = { id: string; thumbnail: string; title: string };

export default function Home() {
  const router = useRouter();

  // Estado para el link en vivo
  const [liveUrl, setLiveUrl] = useState<string>("");
  const [liveLoading, setLiveLoading] = useState<boolean>(true);

  // Estados para top videos y usuario
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [userName, setUserName] = useState<string>("");

  const sliderRef = useRef<ScrollView>(null);

  // Carga nombre de usuario
  useEffect(() => {
    (async () => {
      try {
        const dni = await AsyncStorage.getItem("loggedDNI");
        if (!dni) return;
        const snap = await getDoc(doc(db, "usuarios", dni));
        if (snap.exists()) {
          const data = snap.data() as any;
          setUserName(`${data.nombre} ${data.apellido}`);
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    })();
  }, []);

  // en app/home.tsx, reemplaza el useEffect por este:
useEffect(() => {
  (async () => {
    try {
      const vivoRef = doc(db, "programa_vivo", "vivo");
      const snap = await getDoc(vivoRef);
      if (snap.exists()) {
        const data = snap.data() as { link?: string };
         console.log("Link crudo:", snap.data().link);
        if (data.link) {
          // Asegúrate de que en Firestore el valor NO incluya comillas extra
          setLiveUrl(data.link);
        } else {
          console.warn("⚠️ El campo 'link' está vacío en programa_vivo/vivo");
        }
      } else {
        console.warn("⚠️ No existe el documento programa_vivo/vivo");
      }
    } catch (err) {
      console.error("Error obteniendo link vivo:", err);
    } finally {
      setLiveLoading(false);
    }
  })();
}, []);


  // Auto-scroll sponsors
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % sponsors.length;
      sliderRef.current?.scrollTo({
        x: idx * (width * 0.8 + 16),
        animated: true,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Datos estáticos de ejemplo
  const programs = [
    { title: "Programa 1", time: "Lunes 10:00 AM", image: require("../assets/programa1.jpeg") },
    { title: "Programa 2", time: "Martes 12:00 PM", image: require("../assets/programa1.jpeg") },
    { title: "Programa 3", time: "Miércoles 6:00 PM", image: require("../assets/programa1.jpeg") },
  ];

  const sponsors = [
    { name: "Auspiciador A", info: "Descripción A", image: require("../assets/fondohome2.jpeg") },
    { name: "Auspiciador B", info: "Descripción B", image: require("../assets/fondohome3.jpeg") },
    { name: "Auspiciador C", info: "Descripción C", image: require("../assets/fondohome4.jpeg") },
  ];

  // Datos estáticos para categorías de podcast
  const categories = [
    {
      name: "Educativos",
      episodes: [
        { title: "Aprendiendo React Native", audioUrl: "https://example.com/audio1.mp3" },
        { title: "Firebase para principiantes", audioUrl: "https://example.com/audio2.mp3" },
      ],
    },
    {
      name: "Entretenimiento",
      episodes: [
        { title: "Historias divertidas", audioUrl: "https://example.com/audio3.mp3" },
        { title: "Entrevista con un comediante", audioUrl: "https://example.com/audio4.mp3" },
      ],
    },
  ];

  // Manejadores dummy...
  const handlePlayPodcast = (audioUrl: string) => console.log("Play podcast:", audioUrl);
  const handleOpenNews = (url: string) => console.log("Open news:", url);
  const handlePlay = (id: string) => console.log("Play video:", id);

  // Datos estáticos de ejemplo para noticias
  const newsList = [
    {
      title: "Nueva programación semanal",
      summary: "Descubre los nuevos programas que se suman a nuestra grilla.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Entrevista exclusiva",
      summary: "No te pierdas la entrevista con el invitado especial de esta semana.",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Podcast destacado",
      summary: "Escucha el podcast más popular del mes en nuestra plataforma.",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={require("../assets/programa1.jpeg")} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <MenuHamburguesa />

          {/* Header */}
          <View style={[styles.header, { justifyContent: "space-between", paddingHorizontal: 8 }]}>
            <Text style={styles.greeting}>
              Bienvenido{userName ? `, ${userName}` : ""}
            </Text>
          </View>
          <View style={styles.divider} />

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Live Stream */}
            <View style={styles.liveSection}>
              <Text style={styles.liveTitle}>🎥 ¡Programación en vivo!</Text>
              <Text style={styles.liveSubtitle}>TRANSMISIÓN EN VIVO</Text>
              <View style={styles.liveVideoContainer}>
                {liveLoading ? (
                  <ActivityIndicator size="large" color="#0070f3" style={{ flex: 1 }} />
                ) : liveUrl ? (
                  <WebView
                    source={{ uri: liveUrl }}
                    style={{ flex: 1 }}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsInlineMediaPlayback
                    startInLoadingState
                    renderLoading={() => (
                      <ActivityIndicator size="large" style={{ flex: 1, alignSelf: "center" }} />
                    )}
                  />
                ) : (
                  <Text style={styles.errorText}>En vivo no disponible.</Text>
                )}
              </View>
            </View>

            {/* Weekly Programming */}
            <View style={styles.sectionBoxEnhanced}>
              <Text style={styles.sectionTitleEnhanced}>
                📅 Programación Semanal
              </Text>
              <Text style={styles.sectionNoteEnhanced}>
                Aquí encontrarás la grilla de programas transmitidos.{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  ¡Registrate para verlos en vivo!
                </Text>
              </Text>

              <View style={styles.programCarouselWrapper}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.programCarousel}
                >
                  {programs.map((p, i) => (
                    <View
                      key={i}
                      style={[styles.programCard, { width: width * 0.7 }]}
                    >
                      <Image source={p.image} style={styles.programImage} />
                      <View style={styles.programInfo}>
                        <Text style={styles.programTitle}>{p.title}</Text>
                        <Text style={styles.programTime}>{p.time}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Top Videos */}
            <View style={styles.sectionBoxEnhanced}>
              <Text style={styles.sectionTitleEnhanced}>🔥 Lo más visto</Text>
              <Text style={styles.sectionNoteEnhanced}>
                Esta sección contiene los videos más vistos.{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  Iniciá sesión para acceder al contenido completo.
                </Text>
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color="#0070f3" />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.programCarousel}
                >
                  {videos.map((vid, idx) => (
                    <TouchableOpacity
                      key={`${vid.id}-${idx}`}
                      style={[styles.programCard, { width: width * 0.6 }]}
                      onPress={() => handlePlay(vid.id)}
                    >
                      <Image
                        source={{ uri: vid.thumbnail }}
                        style={styles.programImage}
                      />
                      <View style={styles.programInfo}>
                        <Text style={styles.programTitle} numberOfLines={2}>
                          {vid.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Sponsors Carousel */}
            <View style={styles.sponsorBox}>
              <Text style={styles.sponsorTitle}>🤝 Nuestros Auspiciantes</Text>
              <ScrollView
                ref={sliderRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sponsorCarouselEnhanced}
              >
                {sponsors.map((s, i) => (
                  <View
                    key={i}
                    style={[styles.sponsorCardEnhanced, { width: width * 0.8 }]}
                  >
                    <Image
                      source={s.image}
                      style={styles.sponsorImageEnhanced}
                    />
                    <Text style={styles.sponsorNameEnhanced}>{s.name}</Text>
                    <Text style={styles.sponsorInfoEnhanced}>{s.info}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.sectionBoxEnhancedPodcast}>
              <Text style={styles.sectionTitleEnhancedPodcast}>🎧 Podcast</Text>
              <Text style={styles.sectionNoteEnhancedPodcast}>
                Escuchá nuestros podcast educativos y de entretenimiento.{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  Iniciá sesión para explorarlos.
                </Text>
              </Text>

              {categories.map((cat, idx) => (
                <View key={idx} style={{ marginTop: 16 }}>
                  <Text style={styles.subtitle}>{cat.name}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {cat.episodes.map((podcast, idx2) => (
                      <TouchableOpacity
                        key={idx2}
                        style={styles.card}
                        onPress={() => handlePlayPodcast(podcast.audioUrl)}
                      >
                        <Image
                          source={{
                            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsAenllxthyIJPyRRgKskFbrXOMnuRLlr7wQ&s",
                          }}
                          style={styles.cardImage}
                        />
                        <Text style={styles.cardTitle} numberOfLines={2}>
                          {podcast.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ))}
            </View>

            <View style={styles.sectionBoxEnhancedNews}>
              <Text style={styles.sectionTitleEnhancedNews}>📰 Noticias</Text>
              {newsList.map((news, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.newsCardEnhanced}
                  onPress={() =>
                    handleOpenNews("https://www.elancasti.com.ar/")
                  }
                >
                  <Image
                    source={{ uri: news.image }}
                    style={styles.newsImageEnhanced}
                  />
                  <View style={styles.newsContentEnhanced}>
                    <Text style={styles.newsTitleEnhanced}>{news.title}</Text>
                    <Text style={styles.newsExcerptEnhanced} numberOfLines={2}>
                      {news.summary}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.socialBox}>
              <Text style={styles.socialTitleEnhanced}>
                📲 Seguinos en redes sociales
              </Text>
              <View style={styles.socialIconsRowEnhanced}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://facebook.com/prpstudio")
                  }
                >
                  <Image
                    source={require("../assets/facebook1.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://instagram.com/prpstudio")
                  }
                >
                  <Image
                    source={require("../assets/instagram.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://youtube.com/@PRPenvivo")
                  }
                >
                  <Image
                    source={require("../assets/youtube.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.twitch.tv/prpstudio2025")
                  }
                >
                  <Image
                    source={require("../assets/twitch1.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
