import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import styles from "../styles/MenuHamburguesa";

// Obtenemos ancho y alto de la pantalla
type DimensionsType = { width: number; height: number };
const { width, height } = Dimensions.get("window") as DimensionsType;
// Altura total para el panel del menú
const PANEL_HEIGHT = height;

export default function MenuHamburguesa() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Animación vertical: desde fuera de la pantalla hasta 0
  const translateY = useRef(new Animated.Value(-PANEL_HEIGHT)).current;

  const toggleMenu = () => {
    Animated.timing(translateY, {
      toValue: open ? -PANEL_HEIGHT : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  return (
    <>
      {/* Botón para abrir/cerrar menú */}
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
        <Image
          source={require("../assets/logo.jpeg")}
          style={styles.menuIcon}
          resizeMode="cover"
        />
      </TouchableOpacity>

     

      {/* Panel del menú deslizándose desde arriba */}
      <Animated.View
        style={[
          styles.menuPanel,
          { transform: [{ translateY }], zIndex: 2 },
        ]}
      >
        <SafeAreaView style={styles.menuContainer}>
          <View style={styles.menuItems}>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/home");
              }}
            >
              <Text style={styles.menuText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/datosPersonales");
              }}
            >
              <Text style={styles.menuText}>Datos Personales</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/quienesSomos");
              }}
            >
              <Text style={styles.menuText}>Quienes Somos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/contacto");
              }}
            >
              <Text style={styles.menuText}>Contacto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
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
