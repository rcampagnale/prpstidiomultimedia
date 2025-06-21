import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

// LO MÁS VISTO (MOCK)
const topVideos = [
  {
    id: "1",
    thumbnail: "https://placehold.co/160x90?text=Video+1",
    title: "Video destacado 1",
  },
  {
    id: "2",
    thumbnail: "https://placehold.co/160x90?text=Video+2",
    title: "Video destacado 2",
  },
  {
    id: "3",
    thumbnail: "https://placehold.co/160x90?text=Video+3",
    title: "Video destacado 3",
  },
];

// PODCASTS (MOCK)
const categories = [
  {
    name: "Educativos",
    episodes: [
      {
        title: "Aprendiendo React Native",
        audioUrl: "https://example.com/audio1.mp3",
      },
      {
        title: "Firebase para principiantes",
        audioUrl: "https://example.com/audio2.mp3",
      },
    ],
  },
  {
    name: "Entretenimiento",
    episodes: [
      {
        title: "Historias divertidas",
        audioUrl: "https://example.com/audio3.mp3",
      },
      {
        title: "Entrevista con un comediante",
        audioUrl: "https://example.com/audio4.mp3",
      },
    ],
  },
];

export default function HomeVisitante() {
  const router = useRouter();
  const sliderRef = useRef<ScrollView>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);

  // Auspiciantes
  type SponsorItem = {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    orden: number;
  };
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(true);

  // Programación semanal
  type ProgramItem = {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    orden: number;
  };
  const [weeklyPrograms, setWeeklyPrograms] = useState<ProgramItem[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Conductores
  type ConductorItem = {
    id: string;
    titulo: string;
    descripcion_corta: string;
    imagen: string;
    orden: number;
  };
  const [conductores, setConductores] = useState<ConductorItem[]>([]);
  const [loadingConductores, setLoadingConductores] = useState(true);

  // Artistas
  type ArtistaItem = {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    orden: number;
    nombre: string;
    descripcion_corta: string;
  };
  const [artistas, setArtistas] = useState<ArtistaItem[]>([]);
  const [loadingArtistas, setLoadingArtistas] = useState(true);

  // --- FIREBASE DATA LOADERS ---

  useEffect(() => {
    // Auspiciantes
    const q = query(collection(db, "auspiciante"), orderBy("orden", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            imagen: data.imagen,
            orden: data.orden,
          };
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

  useEffect(() => {
    // Programación semanal
    const q = query(
      collection(db, "programacion_semanal"),
      orderBy("orden", "asc")
    );
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
            };
          })
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
    // Conductores
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
              descripcion_corta: data.descripcion_corta ?? "",
              imagen: data.imagen,
              orden: Number(data.orden) || 0,
            };
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

  useEffect(() => {
    // Artistas
    const q = query(collection(db, "artistas"), orderBy("orden", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setArtistas(
        snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            imagen: data.imagen,
            orden: Number(data.orden) || 0,
            nombre: data.nombre ?? data.titulo ?? "",
            descripcion_corta: data.descripcion_corta ?? "",
          };
        })
      );
      setLoadingArtistas(false);
    });
    return () => unsub();
  }, []);

  // --- OTRAS FUNCIONES ---

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
      if (sponsors.length > 0) {
        idx = (idx + 1) % sponsors.length;
        sliderRef.current?.scrollTo({
          x: idx * (width * 0.8 + 16),
          animated: true,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [sponsors]);

  useEffect(() => {
    (async () => {
      try {
        const vivoRef = doc(db, "programa_vivo", "vivo");
        const snap = await getDoc(vivoRef);
        if (snap.exists()) {
          const data = snap.data() as { link?: string };
          if (data.link) {
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

  const handleOpenNews = (url: string) => {
    Linking.openURL(url);
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
            {/* HEADER */}
            <View
              style={[
                styles.header,
                { justifyContent: "space-between", paddingHorizontal: 8 },
              ]}
            >
              <Image
                source={require("../assets/logo.jpeg")}
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

            {/* VIVO */}
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

            {/* NOTICIAS */}
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

            {/* PROGRAMACIÓN SEMANAL */}
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

            {/* LO MÁS VISTO */}
            <View style={styles.sectionBoxEnhanced}>
              <Text style={styles.sectionTitleEnhanced}>🔥 Lo más visto</Text>
              <Text style={styles.sectionNoteEnhanced}>
                Esta sección contiene los videos más vistos.{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  Iniciá sesión para acceder al contenido completo.
                </Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.programCarousel}
              >
                {topVideos.map((vid, idx) => (
                  <TouchableOpacity
                    key={vid.id}
                    style={[styles.programCard, { width: width * 0.6 }]}
                    onPress={() => {}}
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
            </View>

            {/* CONDUCTORES / INFLUENCERS */}
            <View style={styles.sectionBoxEnhancedNews}>
              <Text style={styles.sectionTitleEnhancedNews}>
                🎤 Conductores / Influencers
              </Text>
              {loadingConductores ? (
                <ActivityIndicator
                  size="large"
                  color="#0070f3"
                  style={{ marginVertical: 16 }}
                />
              ) : (
                conductores.map((c) => (
                  <TouchableOpacity key={c.id} style={styles.newsCardEnhanced}>
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
                        {c.descripcion_corta}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* ARTISTAS / CONTRATACIÓN */}
            <View style={styles.sectionBoxEnhancedNews}>
              <Text style={styles.sectionTitleEnhancedNews}>
                🎨 Artistas/Contratación
              </Text>
              {loadingArtistas ? (
                <ActivityIndicator size="large" color="#0070f3" />
              ) : (
                artistas.map((a, idx) => (
                  <TouchableOpacity key={a.id} style={styles.newsCardEnhanced}>
                    <Image
                      source={{ uri: a.imagen }}
                      style={styles.newsImageEnhanced}
                    />
                    <View style={styles.newsContentEnhanced}>
                      <Text style={styles.newsTitleEnhanced}>{a.nombre}</Text>
                      <Text
                        style={styles.newsExcerptEnhanced}
                        numberOfLines={2}
                      >
                        {a.descripcion_corta}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* ZONA EXCLUSIVA */}
            <View style={styles.sectionBoxEnhanced}>
              <Text style={styles.sectionTitleEnhanced}>🎁 Zona Exclusiva</Text>
              <Text style={styles.sectionNoteEnhanced}>
                Esta sección es exclusiva para usuarios registrados.{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  Iniciá sesión para participar de sorteos y beneficios
                  exclusivos.
                </Text>
              </Text>
            </View>

            {/* PODCAST */}
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
                      <TouchableOpacity key={idx2} style={styles.card}>
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

            {/* AUSPICIANTES */}
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

            {/* REDES SOCIALES */}
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
