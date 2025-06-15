// app/home.tsx
import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "@/config/youtube";
import { useRouter } from "expo-router";
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

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
            `key=${YOUTUBE_API_KEY}` +
            `&channelId=${YOUTUBE_CHANNEL_ID}` +
            `&part=snippet&maxResults=25&type=video`
        );
        const searchData = await searchRes.json();
        console.log("searchData", searchData);

        const videoIds = searchData.items
          .map((item: any) => item.id.videoId)
          .filter(Boolean)
          .join(",");

        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?` +
            `key=${YOUTUBE_API_KEY}` +
            `&id=${videoIds}&part=snippet,statistics`
        );
        const statsData = await statsRes.json();
        console.log("statsData", statsData);

        const sorted = statsData.items
          .sort(
            (a: any, b: any) =>
              Number(b.statistics.viewCount) - Number(a.statistics.viewCount)
          )
          .map((it: any) => ({
            id: it.id,
            thumbnail: it.snippet.thumbnails.medium.url,
            title: it.snippet.title,
            views: it.statistics.viewCount,
          }));

        setVideos(sorted);
      } catch (e) {
        console.error("Error al cargar los videos más vistos:", e);
      } finally {
        setLoading(false);
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
            <Text style={styles.greeting}>Bienvenido</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => router.push("/login")}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: "#0070f3",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}
                >
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/registrarse")}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: "#28a745",
                  borderRadius: 8,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}
                >
                  Registrarse
                </Text>
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
                <WebView
                  source={{
                    uri: "https://www.youtube.com/watch?v=osD2ZVGomjw&t=5s",
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
            <View style={styles.divider} />
            {/* Weekly Programming */}
            <View style={styles.programCarouselWrapper}>
              <Text style={styles.sectionTitle}>Programación Semanal</Text>
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
            <View style={styles.divider} />
            {/* Top Videos */}
            <View style={styles.contentZone}>
              <Text style={styles.title}>Lo más visto</Text>
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
            <View style={styles.divider} />
            {/* Sponsors Carousel */}
            <View style={styles.contentZone}>
              <Text style={styles.title}>Auspiciantes</Text>
              <ScrollView
                ref={sliderRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sponsorCarousel}
              >
                {sponsors.map((s, i) => (
                  <View
                    key={i}
                    style={[styles.sponsorCard, { width: width * 0.8 }]}
                  >
                    <Image source={s.image} style={styles.sponsorImage} />
                    <Text style={styles.sponsorName}>{s.name}</Text>
                    <Text style={styles.sponsorInfo}>{s.info}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.title}>Podcast por categoría</Text>
              {categories.map((cat, idx) => (
                <View key={idx}>
                  <Text style={styles.subtitle}>{cat.name}</Text>
                  <ScrollView horizontal>
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
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.title}>Noticias</Text>
              {newsList.map((news, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.newsCard}
                  onPress={() =>
                    handleOpenNews("https://www.elancasti.com.ar/")
                  }
                >
                  <Image
                    source={{ uri: news.image }}
                    style={styles.newsImage}
                  />
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle}>{news.title}</Text>
                    <Text style={styles.newsExcerpt} numberOfLines={2}>
                      {news.summary}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.divider} />
            <View style={styles.socialBlock}>
              <Text style={styles.socialTitle}>Seguinos en redes Sociales</Text>
              <View style={styles.socialIconsRow}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://facebook.com/prpstudio")
                  }
                >
                  <Image
                    source={require("../assets/facebook1.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://instagram.com/prpstudio")
                  }
                >
                  <Image
                    source={require("../assets/instagram.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://youtube.com/@PRPenvivo")
                  }
                >
                  <Image
                    source={require("../assets/youtube.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.twitch.tv/prpstudio2025")
                  }
                >
                  <Image
                    source={require("../assets/twitch1.png")}
                    style={styles.socialIcon}
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
