import { Dimensions, StyleSheet } from 'react-native';

// Dimensiones de pantalla
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  hamburgerButton: {
    padding: 12,
    position: 'absolute',
    top: 36,
    left: 5,
    zIndex: 1100,
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
    width: width,
    height: 430,  // cubre toda la pantalla
    backgroundColor: '#0070f3',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  menuContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  menuItems: {
    marginTop: 80, // ajusta para descender desde el header
  },
  menuItem: {
    paddingVertical: 12,
    marginVertical: 4,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    width: '100%', // corregido para ocupar todo el ancho
    marginVertical: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});
