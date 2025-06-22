import React from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/modalconductores";

type ConductorItem = {
  id: string;
  titulo: string;
  descripcion: string;
  descripcion_corta: string;
  imagen: string;
  orden: number;
  facebook?: string;
  instagram?: string;
};

interface ModalConductoresProps {
  visible: boolean;
  conductor: ConductorItem | null;
  onClose: () => void;
}

export default function ModalConductores({
  visible,
  conductor,
  onClose,
}: ModalConductoresProps) {
  if (!conductor) return null;

  const facebookUrl = conductor.facebook ?? "";
  const instagramUrl = conductor.instagram ?? "";

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("URL no válida", `No se puede abrir: ${url}`);
      }
    } catch (err) {
      console.error("Error al abrir URL:", err);
      Alert.alert("Error", "Ocurrió un problema al abrir el enlace.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          {/* BOTÓN CERRAR FLOTANTE */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Image
              source={{ uri: conductor.imagen }}
              style={styles.detailImage}
            />
            <Text style={styles.detailTitle}>{conductor.titulo}</Text>
            <Text style={styles.detailDesc}>{conductor.descripcion}</Text>

            <View style={styles.socialRow}>
              {facebookUrl ? (
                <TouchableOpacity onPress={() => openLink(facebookUrl)}>
                  <Image
                    source={require("../assets/facebook1.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              ) : null}
              {instagramUrl ? (
                <TouchableOpacity onPress={() => openLink(instagramUrl)}>
                  <Image
                    source={require("../assets/instagram.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.socialBox}>
              <Text style={styles.socialTitle}>
                📲 Sígueme en mis redes sociales
              </Text>
              <View style={styles.socialIconsRow}>
                <TouchableOpacity
                  onPress={() => openLink("https://facebook.com/tuPerfil")}
                >
                  <Image
                    source={require("../assets/facebook1.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openLink("https://instagram.com/tuPerfil")}
                >
                  <Image
                    source={require("../assets/instagram.png")}
                    style={styles.socialIconEnhanced}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

