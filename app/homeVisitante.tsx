import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
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

import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { useState } from "react";

export default function HomeVisitante() {
  const router = useRouter();
  const sliderRef = useRef<ScrollView>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  

  type SponsorItem = {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string; // URL a la imagen
    orden: number;
  };

  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState<boolean>(true);

  useEffect(() => {
    // 1) Crea la query ordenada ascendente por campo "orden"
    const q = query(collection(db, "auspiciante"), orderBy("orden", "asc"));

    // 2) Escucha en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot: { docs: any[] }) => {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            imagen: data.imagen,
            orden: data.orden,
          } as SponsorItem;
        });
        setSponsors(items);
        setLoadingSponsors(false);
      },
      (error) => {
        console.error("Error snapshot auspiciantes:", error);
        setLoadingSponsors(false);
      }
    );

    return () => unsubscribe();
  }, []);

 type ProgramItem = {
     id: string;
     titulo: string;
     descripcion: string;
     imagen: string;
     orden: number;
   };
 
   // 2) Estados para la grilla y carga
   const [weeklyPrograms, setWeeklyPrograms] = useState<ProgramItem[]>([]);
   const [loadingPrograms, setLoadingPrograms] = useState<boolean>(true);
 
   // 3) Suscripción en tiempo real a "programacion_semanal"
   useEffect(() => {
     // 1) Prepara la consulta ordenada por "orden"
     const q = query(
       collection(db, "programacion_semanal"),
       orderBy("orden", "asc")
     );
 
     // 2) Suscríbete
     const unsubscribe = onSnapshot(
       q,
       (snapshot) => {
         const items = snapshot.docs
           .map((doc) => {
             const data = doc.data() as any;
             return {
               id: doc.id,
               titulo: data.titulo,
               descripcion: data.descripcion,
               imagen: data.imagen,
               orden: Number(data.orden) || 0, // fuerza número
             } as ProgramItem;
           })
           // por seguridad, vuelve a ordenar en el cliente
           .sort((a, b) => a.orden - b.orden);
 
         setWeeklyPrograms(items);
         setLoadingPrograms(false);
       },
       (error) => {
         console.error("Error snapshot programación semanal:", error);
         setLoadingPrograms(false);
       }
     );
 
     return () => unsubscribe();
   }, []);

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

  useEffect(() => {
    (async () => {
      try {
        const vivoRef = doc(db, "programa_vivo", "vivo");
        const snap = await getDoc(vivoRef);
        if (snap.exists()) {
          const data = snap.data() as { link?: string };
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

  // Conductores / Influencers
  type ConductorItem = {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    orden: number;
  };

  const [conductores, setConductores] = useState<ConductorItem[]>([]);
  const [loadingConductores, setLoadingConductores] = useState<boolean>(true);

  useEffect(() => {
    const q = query(collection(db, "conductores"), orderBy("orden", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              titulo: data.titulo,
              descripcion: data.descripcion,
              imagen: data.imagen,
              orden: Number(data.orden) || 0,
            } as ConductorItem;
          })
          .sort((a, b) => a.orden - b.orden);
        setConductores(items);
        setLoadingConductores(false);
      },
      (error) => {
        console.error("Error snapshot conductores:", error);
        setLoadingConductores(false);
      }
    );
    return () => unsubscribe();
  }, []);

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
                {liveLoading ? (
                  <ActivityIndicator
                    size="large"
                    color="#0070f3"
                    style={{ flex: 1 }}
                  />
                ) : liveUrl ? (
                  <WebView
                    source={{ uri: liveUrl }}
                    style={{ flex: 1 }}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsInlineMediaPlayback
                    startInLoadingState
                    renderLoading={() => (
                      <ActivityIndicator
                        size="large"
                        style={{ flex: 1, alignSelf: "center" }}
                      />
                    )}
                  />
                ) : (
                  <Text style={styles.errorText}>En vivo no disponible.</Text>
                )}
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

              <View style={styles.programCarouselWrapper}>
                {loadingPrograms ? (
                  <ActivityIndicator size="large" />
                ) : (
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.programCarousel}
                  >
                    {weeklyPrograms.map((p, i) => (
                      <View
                        key={p.id}
                        style={[styles.programCard, { width: width * 0.7 }]}
                      >
                        <Image
                          source={{ uri: p.imagen }}
                          style={styles.programImage}
                        />
                        <View style={styles.programInfo}>
                          <Text style={styles.programTitle}>{p.titulo}</Text>
                          <Text style={styles.programTime}>
                            {p.descripcion}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
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
{/* Conductores / Influencers */}
<View style={styles.sectionBoxEnhancedNews}>
  <Text style={styles.sectionTitleEnhancedNews}>🎤 Conductores / Influencers</Text>
  {loadingConductores ? (
    <ActivityIndicator
      size="large"
      color="#0070f3"
      style={{ marginVertical: 16 }}
    />
  ) : (
    conductores.map(c => (
      <TouchableOpacity
        key={c.id}
        style={styles.newsCardEnhanced}
        onPress={() => {}}
      >
        <Image
          source={{ uri: c.imagen }}
          style={styles.newsImageEnhanced}
        />
        <View style={styles.newsContentEnhanced}>
          <Text style={styles.newsTitleEnhanced}>{c.titulo}</Text>
          <Text
            style={styles.newsExcerptEnhanced}
            numberOfLines={2}
          >
            {c.descripcion}
          </Text>
        </View>
      </TouchableOpacity>
    ))
  )}
</View>

            {/* Sponsors Carousel */}
            <View style={styles.sponsorBox}>
              <Text style={styles.sponsorTitle}>🤝 Nuestros Auspiciantes</Text>
              {loadingSponsors ? (
                <ActivityIndicator size="large" color="#0070f3" />
              ) : (
                <ScrollView
                  ref={sliderRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.sponsorCarouselEnhanced}
                >
                  {sponsors.map((s) => (
                    <View
                      key={s.id}
                      style={[
                        styles.sponsorCardEnhanced,
                        { width: width * 0.8 },
                      ]}
                    >
                      <Image
                        source={{ uri: s.imagen }}
                        style={styles.sponsorImageEnhanced}
                      />
                      <Text style={styles.sponsorNameEnhanced}>{s.titulo}</Text>
                      <Text style={styles.sponsorInfoEnhanced}>
                        {s.descripcion}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
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
                    Linking.openURL(
                      "https://www.facebook.com/profile.php?id=61575238830833"
                    )
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
