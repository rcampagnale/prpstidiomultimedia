import { Dimensions, StyleSheet } from 'react-native';

// Calcula el ancho del menú en base al 75% del ancho de pantalla
const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

export default StyleSheet.create({
  hamburgerButton: {
    padding: 12,
    position: 'absolute',
    top: 34,
    left: 1,
    zIndex: 1100,             // Asegura que el botón esté encima de todo
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    height: '150%',
    backgroundColor: '#0070f3',
    zIndex: 1000,             // Superpone el panel sobre el contenido
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,            // Elevación para Android
  },
  menuContainer: {
    flex: 1,
    padding: 16,
    zIndex: 1001,             // Asegura contenidos dentro del panel estén visibles
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    zIndex: 1002,
  },
  menuItems: {
    marginTop: 30,
  },
  menuItem: {
    paddingVertical: 42,
    marginTop: -60,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
  height: 1,
  backgroundColor: '#000000',
  marginVertical: 58,
  alignSelf: 'stretch',   // fuerza que ocupe todo el ancho
  marginHorizontal: -12,  // compensa el padding: 24 del container
},


});