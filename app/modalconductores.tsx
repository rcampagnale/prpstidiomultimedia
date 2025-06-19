import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/modalconductores';

type ConductorItem = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  orden: number;
  facebook?: string;      // URL de Facebook desde Firestore
  instagram?: string;     // URL de Instagram desde Firestore
};

interface ModalConductoresProps {
  visible: boolean;
  conductor: ConductorItem | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function ModalConductores({ visible, conductor, onClose }: ModalConductoresProps) {
  if (!conductor) return null;

  // URLs extraídas de las propiedades del conductor
  const facebookUrl = conductor.facebook ?? '';
  const instagramUrl = conductor.instagram ?? '';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Image
              source={{ uri: conductor.imagen }}
              style={styles.detailImage}
            />
            <Text style={styles.detailTitle}>{conductor.titulo}</Text>
            <Text style={styles.detailDesc}>{conductor.descripcion}</Text>
            {/* Botones de redes sociales dinámicos */}
            <View style={styles.socialRow}>
              {facebookUrl ? (
                <TouchableOpacity onPress={() => Linking.openURL(facebookUrl)}>
                  <Image
                    source={require('../assets/facebook1.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              ) : null}
              {instagramUrl ? (
                <TouchableOpacity onPress={() => Linking.openURL(instagramUrl)}>
                  <Image
                    source={require('../assets/instagram.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Cerrar" onPress={onClose} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}