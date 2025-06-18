import React from 'react';
import { Button, Dimensions, Image, Modal, SafeAreaView, ScrollView, Text, View } from 'react-native';
import styles from '../styles/modalconductores';

type ConductorItem = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  orden: number;
};

interface ModalConductoresProps {
  visible: boolean;
  conductor: ConductorItem | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function ModalConductores({ visible, conductor, onClose }: ModalConductoresProps) {
  if (!conductor) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={{ uri: conductor.imagen }}
            style={styles.detailImage}
          />
          <Text style={styles.detailTitle}>{conductor.titulo}</Text>
          <Text style={styles.detailDesc}>{conductor.descripcion}</Text>
          <View style={styles.buttonWrapper}>
            <Button title="Cerrar" onPress={onClose} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}