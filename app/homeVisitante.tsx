import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  BackHandler,
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
import styles from "../styles/homeVisitante";

const { width } = Dimensions.get("window");

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

export default function HomeVisitante() {
  const router = useRouter();
  const sliderRef = useRef<ScrollView>(null);
   useEffect(() => {
      const backAction = () => {
        router.replace("/homeVisitante");
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => subscription.remove();
    }, []);

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

  const handleOpenNews = (url: string) => {
    console.log("Open news:", url);
  };

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
          <ScrollView>
            <View
              style={[
                styles.header,
                { justifyContent: "space-between", paddingHorizontal: 8 },
              ]}
            >
              <Image
                source={require("../assets/logo.jpeg")} // reemplazá por tu ruta real
                style={styles.roundImage}
              />
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

            <View style={styles.liveSection}>
              <Text style={styles.liveTitle}>🎥 ¡Programación en vivo!</Text>
              <Text style={styles.liveSubtitle}>TRANSMISIÓN EN VIVO</Text>
              <View style={styles.liveVideoContainer}>
                <WebView
                  source={{
                    uri: "https://www.youtube.com/watch?v=osD2ZVGomjw&t=5s",
                  }}
                  style={{ flex: 1, borderRadius: 12 }}
                />
              </View>
            </View>

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
            </View>

            <View style={styles.sectionBoxEnhanced}>
              <Text style={styles.sectionTitleEnhanced}>🔥 Lo más visto</Text>
              <Text style={styles.sectionNoteEnhanced}>
                Esta sección contiene los videos más vistos.{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  Iniciá sesión para acceder al contenido completo.
                </Text>
              </Text>
            </View>

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
            </View>

            <View style={styles.sectionBoxEnhancedNews}>
              <Text style={styles.sectionTitleEnhancedNews}>📰 Noticias</Text>
              {newsList.map((news, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.newsCardEnhanced}
                  onPress={() => handleOpenNews(news.url)}
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
                    Linking.openURL("https://www.facebook.com/profile.php?id=61575238830833")
                  }
                >
                  <Image
                    source={require("../assets/facebook1.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.instagram.com/prpstudiom")
                  }
                >
                  <Image
                    source={require("../assets/instagram.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.youtube.com/@PRPenvivo")
                  }
                >
                  <Image
                    source={require("../assets/youtube.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.twitch.tv/prpstudio2025?sr=a")
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
