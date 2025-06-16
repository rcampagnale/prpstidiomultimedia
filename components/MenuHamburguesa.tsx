import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/MenuHamburguesa"; // Asegúrate de tener un archivo de estilos adecuado

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.75;

export default function MenuHamburguesa() {
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;

  const toggleMenu = () => {
    Animated.timing(translateX, {
      toValue: open ? -MENU_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  return (
    <>
      {/* Botón hamburguesa con imagen */}
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
        <Image
          source={require("../assets/logo.jpeg")}
          style={styles.menuIcon}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Panel de menú deslizable */}
      <Animated.View
        style={[styles.menuPanel, { transform: [{ translateX }] }]}
      >
        <SafeAreaView style={styles.menuContainer}>
          {/* Ítems de menú */}
          <View style={styles.menuItems}>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/home")}
            >
              <Text style={styles.menuText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/datosPersonales")}
            >
              <Text style={styles.menuText}>Datos Personales</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/quienesSomos")}
            >
              <Text style={styles.menuText}>Quienes Somos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/contacto")}
            >
              <Text style={styles.menuText}>Contacto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Aquí cerramos sesión y volvemos al home general
                router.replace("/homeVisitante");
              }}
            >
              <Text style={styles.menuText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}
