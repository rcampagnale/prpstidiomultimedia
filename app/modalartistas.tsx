import styles from "@/styles/modalartistas";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
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
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <FlatList
            ref={flatListRef}
            data={artistas}
            horizontal
            pagingEnabled
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.modalContent}>
                {/* BOTÓN CERRAR */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

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
        </SafeAreaView>
      </View>
    </Modal>
  );
}
