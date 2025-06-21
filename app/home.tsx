// app/home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import MenuHamburguesa from "../components/MenuHamburguesa";
import { db } from "../firebase";
import styles from "../styles/home";
import ModalArtistas from "./modalartistas";
import ModalConductores from "./modalconductores";

// Obtener ancho de pantalla
const { width } = Dimensions.get("window");

// Sanitiza el título para usarlo como id de documento
function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD") // quita tildes
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // espacios por guión
    .replace(/[^\w\-]+/g, "") // quita caracteres no válidos
    .replace(/\-\-+/g, "-"); // elimina guiones dobles
}

type Video = { id: string; thumbnail: string; title: string };

export default function Home() {
  const router = useRouter();

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
  const [selectedArtistaIndex, setSelectedArtistaIndex] = useState<
    number | null
  >(null);
  const [loadingArtistas, setLoadingArtistas] = useState<boolean>(true);

  useEffect(() => {
    const q = query(collection(db, "artistas"), orderBy("orden", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setArtistas(
        snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          const d = doc.data();
          return {
            id: doc.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            imagen: data.imagen,
            orden: Number(data.orden) || 0,
            nombre: data.nombre ?? data.titulo ?? "",
            descripcion_corta: data.descripcion_corta ?? "",
            instagram: d.instagram ?? "",
            facebook: d.facebook ?? "", 
          } as ArtistaItem;
        })
      );
      setLoadingArtistas(false);
    });
    return () => unsub();
  }, []);

  // 1. Estados para sorteos (al inicio del Home)
  const [sorteos, setSorteos] = useState<
    { id: string; titulo: string; imagen: string }[]
  >([]);
  const [participando, setParticipando] = useState<Set<string>>(new Set());
  const [codigoUsuario, setCodigoUsuario] = useState<string | null>(null);
  const [loadingSorteos, setLoadingSorteos] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sorteoError, setSorteoError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dni = await AsyncStorage.getItem("loggedDNI");
        if (!dni) throw new Error("No hay DNI guardado");
        const snap = await getDoc(doc(db, "usuarios", dni));
        if (!snap.exists()) throw new Error("Usuario no registrado");
        setCodigoUsuario(snap.data()?.codigoUsuario);
      } catch {
        router.replace("/login");
        return;
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loadingUser) return;
    const unsub = onSnapshot(
      query(collection(db, "sorteo"), orderBy("orden", "asc")),
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setSorteos(arr);
        setLoadingSorteos(false);
      },
      (e) => {
        setSorteoError("Error cargando sorteos");
        setLoadingSorteos(false);
        console.error("Error cargando sorteos:", e);
      }
    );
    return () => unsub();
  }, [loadingUser]);

  useEffect(() => {
    if (loadingUser || loadingSorteos || !codigoUsuario) return;
    const unsubs = sorteos.map((r) =>
      onSnapshot(
        doc(db, "codigo_sorteos", r.id, "participantes", codigoUsuario),
        (snap) => {
          setParticipando((prev) => {
            const next = new Set(prev);
            if (snap.exists()) next.add(r.id);
            else next.delete(r.id);
            return next;
          });
        }
      )
    );
    return () => unsubs.forEach((fn) => fn());
  }, [sorteos, codigoUsuario, loadingUser, loadingSorteos]);

  const handleParticipar = async (id: string, titulo: string) => {
    if (!codigoUsuario) return;
    const ref = doc(db, "codigo_sorteos", id, "participantes", codigoUsuario);
    const tituloDoc = slugify(titulo); // <- sanitiza el título
    const generateRef = doc(
      db,
      "generar_sorteos",
      tituloDoc,
      "participantes",
      codigoUsuario
    );

    try {
      if (participando.has(id)) {
        await deleteDoc(ref);
        await deleteDoc(generateRef);
        Platform.OS === "android"
          ? ToastAndroid.show("Has salido del sorteo", ToastAndroid.SHORT)
          : Alert.alert("Has salido del sorteo");
      } else {
        await setDoc(ref, { joinedAt: serverTimestamp() });
        await setDoc(generateRef, {
          codigoUsuario,
          joinedAt: serverTimestamp(),
        });
        Platform.OS === "android"
          ? ToastAndroid.show("Te has unido al sorteo", ToastAndroid.SHORT)
          : Alert.alert("Te has unido al sorteo");
      }
    } catch (e: any) {
      setSorteoError(e.message || "Error al actualizar participación");
      console.error("Error al actualizar participación:", e);
    }
  };

  // 1) Estado para los sorteos y carga
  const [raffles, setRaffles] = useState<
    { id: string; titulo: string; imagen: string }[]
  >([]);
  const [loadingRaffles, setLoadingRaffles] = useState(true);

  // 2) Estado para controlar participaciones
  const [participating, setParticipating] = useState<string[]>([]);

  // 3) Handler para alternar participación
  const handleParticipate = (id: string) => {
    setParticipating((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // 4) Carga en tiempo real desde Firestore (colección "sorteo")
  useEffect(() => {
    const q = query(collection(db, "sorteo"), orderBy("orden", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            titulo: d.titulo,
            imagen: d.imagen,
          };
        });
        setRaffles(items);
        setLoadingRaffles(false);
      },
      (err) => {
        console.error("Error snapshot sorteo:", err);
        setLoadingRaffles(false);
      }
    );
    return () => unsubscribe();
  }, []);

  type ConductorItem = {
    descripcion_corta: string;
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    orden: number;
  };

  const [conductores, setConductores] = useState<ConductorItem[]>([]);
  const [loadingConductores, setLoadingConductores] = useState(true);
  const [selectedConductor, setSelectedConductor] =
    useState<ConductorItem | null>(null);

  useEffect(() => {
    const q = query(collection(db, "conductores"), orderBy("orden", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => {
            const d = doc.data() as any;
            return {
              id: doc.id,
              titulo: d.titulo,
              descripcion: d.descripcion,
              descripcion_corta: d.descripcion_corta ?? "", // asegúrate de que sea string
              imagen: d.imagen,
              orden: Number(d.orden) || 0,
            } as ConductorItem;
          })
          .sort((a, b) => a.orden - b.orden);
        setConductores(items);
        setLoadingConductores(false);
      },
      (err) => {
        console.error("Error snapshot conductores:", err);
        setLoadingConductores(false);
      }
    );
    return () => unsub();
  }, []);

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

  // Datos estáticos para categorías de podcast
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

  // Manejadores dummy...
  const handlePlayPodcast = (audioUrl: string) =>
    console.log("Play podcast:", audioUrl);
  const handleOpenNews = (url: string) => console.log("Open news:", url);
  const handlePlay = (id: string) => console.log("Play video:", id);

  // Datos estáticos de ejemplo para noticias
  const newsList = [
    {
      title: "Nueva programación semanal",
      summary: "Descubre los nuevos programas que se suman a nuestra grilla.",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Entrevista exclusiva",
      summary:
        "No te pierdas la entrevista con el invitado especial de esta semana.",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Podcast destacado",
      summary: "Escucha el podcast más popular del mes en nuestra plataforma.",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
  ];

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
          </View>
          <View style={styles.divider} />

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Live Stream */}
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

            {/* Conductores */}
            <View style={styles.sectionBoxEnhancedNews}>
              <Text style={styles.sectionTitleEnhancedNews}>
                🎤 Conductores/Influencers
              </Text>
              {loadingConductores ? (
                <ActivityIndicator size="large" color="#0070f3" />
              ) : (
                conductores.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.newsCardEnhanced}
                    onPress={() => setSelectedConductor(c)}
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
                        {c.descripcion_corta}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
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
            <View style={styles.sectionBoxEnhanced}>
              <Text style={styles.sectionTitleEnhanced}>🎁 Zona Exclusiva</Text>
              <Text style={styles.sectionNoteEnhanced}>
                Participá de nuestros sorteos exclusivos para usuarios
                registrados.
              </Text>

              {loadingUser || loadingSorteos ? (
                <ActivityIndicator style={{ margin: 16 }} size="large" />
              ) : sorteoError ? (
                <Text style={{ color: "red", margin: 16, textAlign: "center" }}>
                  {sorteoError}
                </Text>
              ) : sorteos.length === 0 ? (
                <Text style={{ margin: 16, textAlign: "center" }}>
                  No hay sorteos disponibles
                </Text>
              ) : (
                sorteos.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleParticipar(item.id, item.titulo)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 8,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Image
                      source={{ uri: item.imagen }}
                      style={{ width: 80, height: 80, borderRadius: 8 }}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontWeight: "bold" }}>{item.titulo}</Text>
                      {/* SOLO muestra el tilde si el usuario participa EN ESTE sorteo */}
                      {participando.has(item.id) && (
                        <Text style={{ color: "green", marginTop: 4 }}>
                          ✔ Participando
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
            <View style={styles.sectionBoxEnhancedNews}>
              <Text style={styles.sectionTitleEnhancedNews}>
                🎨 Artistas/Contratación
              </Text>
              {loadingArtistas ? (
                <ActivityIndicator size="large" color="#0070f3" />
              ) : (
                artistas.map((a, idx) => (
                  <TouchableOpacity
                    key={a.id}
                    style={styles.newsCardEnhanced}
                    onPress={() => setSelectedArtistaIndex(idx)}
                  >
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
              <ModalArtistas
                visible={selectedArtistaIndex !== null}
                artistas={artistas}
                initialIndex={selectedArtistaIndex ?? 0}
                onClose={() => setSelectedArtistaIndex(null)}
              />
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
          <ModalConductores
            visible={!!selectedConductor}
            conductor={selectedConductor}
            onClose={() => setSelectedConductor(null)}
          />
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
