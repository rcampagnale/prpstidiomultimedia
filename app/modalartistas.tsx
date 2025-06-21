import styles from "@/styles/modalartistas";
import React, { useEffect, useRef } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type ArtistaItem = {
  id: string;
  nombre: string;
  descripcion: string;
  descripcion_corta: string;
  imagen: string;
  orden: number;
  instagram?: string;
  facebook?: string;
};

interface ModalArtistasProps {
  visible: boolean;
  artistas: ArtistaItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function ModalArtistas({
  visible,
  artistas,
  initialIndex,
  onClose,
}: ModalArtistasProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          ref={flatListRef}
          data={artistas}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.modalContent}>
              <Image
                source={
                  item.imagen &&
                  typeof item.imagen === "string" &&
                  item.imagen.startsWith("http")
                    ? { uri: item.imagen }
                    : require("../assets/logo.jpeg")
                }
                style={styles.detailImage}
              />
              <Text style={styles.detailTitle}>{item.nombre}</Text>
              <Text style={styles.detailDesc}>{item.descripcion}</Text>

              {/* Redes sociales del artista con socialBox */}
              {item.facebook || item.instagram ? (
                <View style={styles.socialBox}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 8,
                    }}
                  >
                    Seguime en redes sociales
                  </Text>
                  <View style={styles.socialRow}>
                    {item.facebook ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.facebook!)}
                      >
                        <Image
                          source={require("../assets/facebook1.png")}
                          style={styles.socialIcon}
                        />
                      </TouchableOpacity>
                    ) : null}
                    {item.instagram ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.instagram!)}
                      >
                        <Image
                          source={require("../assets/instagram.png")}
                          style={styles.socialIcon}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ) : (
                <Text style={{ color: "#bbb", fontSize: 14, marginTop: 6 }}>
                  No hay redes sociales registradas.
                </Text>
              )}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: Platform.OS === "android" ? 40 : 24,
            right: 24,
            zIndex: 10,
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 6,
            elevation: 3,
          }}
          onPress={onClose}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}
