// app/contacto.tsx
import MenuHamburguesa from "@/components/MenuHamburguesa";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
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
import styles from "../styles/contacto";

export default function Contacto() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.replace("/home");
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => subscription.remove();
  }, []);

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

        <Text style={styles.title}>Contacto</Text>

        <Text style={styles.paragraph}>
          Para consultas, propuestas institucionales o información adicional,
          podés comunicarte con nosotros a través de los siguientes medios:
        </Text>

        <Text style={styles.paragraph}>📧 Correo: prpstudio.mm@gmail.com</Text>
        <Text style={styles.paragraph}>📞 Teléfono: +54 3834 64-2424</Text>
        <Text style={styles.paragraph}>📍 Dirección: Catamarca, Argentina</Text>

        <View style={styles.divider} />

        <View style={styles.socialBlock}>
          <Text style={styles.socialTitle}>También podés encontrarnos en</Text>
          <View style={styles.socialIconsRow}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.facebook.com/profile.php?viewas=100000686899395&id=61575238830833"
                )
              }
            >
              <Image
                source={require("../assets/facebook1.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.instagram.com/prpstudiom/")
              }
            >
              <Image
                source={require("../assets/instagram.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.youtube.com/@PRPenvivo")
              }
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