// app/home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
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

const programs = [
  {
    title: "Programa 1",
    time: "Lunes 10:00 AM",
    image: require("../assets/programa1.jpeg"),
  },
  {
    title: "Programa 2",
    time: "Martes 12:00 PM",
    image: require("../assets/programa1.jpeg"),
  },
  {
    title: "Programa 3",
    time: "Miércoles 6:00 PM",
    image: require("../assets/programa1.jpeg"),
  },
];

const sponsors = [
  {
    name: "Auspiciador A",
    info: "Descripción A",
    image: require("../assets/fondohome.jpeg"),
  },
  {
    name: "Auspiciador B",
    info: "Descripción B",
    image: require("../assets/fondohome.jpeg"),
  },
  {
    name: "Auspiciador C",
    info: "Descripción C",
    image: require("../assets/fondohome.jpeg"),
  },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const sponsorRef = useRef<ScrollView>(null);

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
  (async () => {
    try {
      const dni = await AsyncStorage.getItem("loggedDNI");
      console.log("🔍 DNI obtenido de AsyncStorage:", dni);
      if (!dni) {
        console.warn("⚠️ No hay DNI en AsyncStorage");
        return;
      }
      const snap = await getDoc(doc(db, "usuarios", dni));
      if (snap.exists()) {
        const data = snap.data();
        const fullName = `${data.nombre} ${data.apellido}`;
        console.log("✅ Usuario cargado desde Firestore:", fullName);
        setUserName(fullName);
      } else {
        console.warn("⚠️ Documento de usuario no existe en Firestore");
      }
    } catch (err) {
      console.error("❌ Error cargando usuario:", err);
    }
  })();
}, []);


  // Example program carousel data
  const programs = [
    {
      title: "Programa 1",
      time: "Lunes 10:00 AM",
      image: require("../assets/programa1.jpeg"),
    },
    {
      title: "Programa 2",
      time: "Martes 12:00 PM",
      image: require("../assets/programa1.jpeg"),
    },
    {
      title: "Programa 3",
      time: "Miércoles 6:00 PM",
      image: require("../assets/programa1.jpeg"),
    },
  ];

  // Sponsors with auto-scroll
  const sponsors = [
    {
      name: "Auspiciador A",
      info: "Descripción A",
      image: require("../assets/fondohome2.jpeg"),
    },
    {
      name: "Auspiciador B",
      info: "Descripción B",
      image: require("../assets/fondohome3.jpeg"),
    },
    {
      name: "Auspiciador C",
      info: "Descripción C",
      image: require("../assets/fondohome4.jpeg"),
    },
  ];
  const sliderRef = useRef<ScrollView>(null);
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

  // Dummy categories data for podcasts
  const categories = [
    {
      name: "Educación",
      episodes: [
        {
          title: "Aprendiendo React Native",
          cover: "https://placehold.co/100x100",
          audioUrl: "https://www.example.com/audio1.mp3",
        },
        {
          title: "Tips de programación",
          cover: "https://placehold.co/100x100",
          audioUrl: "https://www.example.com/audio2.mp3",
        },
      ],
    },
    {
      name: "Entretenimiento",
      episodes: [
        {
          title: "Podcast divertido",
          cover: "https://placehold.co/100x100",
          audioUrl: "https://www.example.com/audio3.mp3",
        },
      ],
    },
  ];

  // Dummy handler for podcast play
  const handlePlayPodcast = (audioUrl: string) => {
    // Implement audio playback logic here
    console.log("Play podcast:", audioUrl);
  };

  // Dummy news data
  const newsList = [
    {
      title: "Noticia 1",
      summary: "Resumen de la noticia 1.",
      image: "https://placehold.co/120x80",
      url: "https://www.example.com/noticia1",
    },
    {
      title: "Noticia 2",
      summary: "Resumen de la noticia 2.",
      image: "https://placehold.co/120x80",
      url: "https://www.example.com/noticia2",
    },
  ];

  // Dummy handler for opening news
  const handleOpenNews = (url: string) => {
    // Implement navigation or webview logic here
    console.log("Open news:", url);
  };

  function handlePlay(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require("../assets/programa1.jpeg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <MenuHamburguesa />
          {/* Header */}
          <View
            style={[
              styles.header,
              { justifyContent: "space-between", paddingHorizontal: 8 },
            ]}
          >
            <Text style={styles.greeting}>
              Bienvenido{userName ? `, ${userName}` : ""}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {/* Botones u otros elementos */}
            </View>
          </View>

          <View style={styles.divider} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Live Stream */}
            <View style={styles.liveSection}>
              <Text style={styles.liveTitle}>🎥 ¡Programación en vivo!</Text>
              <Text style={styles.liveSubtitle}>TRANSMISIÓN EN VIVO</Text>
              <View style={styles.liveVideoContainer}>
                <WebView
                  source={{
                    uri: "https://www.youtube.com/watch?v=osD2ZVGomjw&t=5s",
                  }}
                  style={{ flex: 1 }}
                />
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
