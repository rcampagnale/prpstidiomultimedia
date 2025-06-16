// app/quienesSomos.tsx
import MenuHamburguesa from "@/components/MenuHamburguesa";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback } from "react";
import {
  BackHandler,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/quienesSomos";

const router = useRouter();

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      router.replace('/'); // ← Volver a la Home sin dejar historial
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [])
);

export default function QuienesSomos() {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <MenuHamburguesa />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>¿Quiénes somos?</Text>
        <Text style={styles.paragraph}>
          Somos un equipo comprometido con la educación, la innovación
          tecnológica y la formación profesional de calidad. Nuestro objetivo es
          brindar herramientas digitales accesibles, inclusivas y útiles para el
          desarrollo docente y social.
        </Text>
        <Text style={styles.paragraph}>
          PRP Studio Multimedia surge como una iniciativa para conectar
          conocimiento, tecnología y comunidad, a través de capacitaciones,
          contenidos interactivos y producción audiovisual educativa.
        </Text>
        <Text style={styles.paragraph}>
          Trabajamos colaborativamente junto a docentes, instituciones y
          organizaciones sindicales para construir propuestas educativas
          relevantes y con impacto territorial.
        </Text>

        <View style={styles.divider} />
        <View style={styles.socialBlock}>
          <Text style={styles.socialTitle}>Seguinos en redes Sociales</Text>
          <View style={styles.socialIconsRow}>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://facebook.com/prpstudio")}
            >
              <Image
                source={require("../assets/facebook1.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://instagram.com/prpstudio")}
            >
              <Image
                source={require("../assets/instagram.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://youtube.com/@PRPenvivo")}
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
    </>
  );
}
