import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semitransparente para el fondo detrás del modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,      // ajuste de tamaño: 80% del ancho de pantalla
    maxHeight: height * 0.6,  // ajuste de tamaño: 60% de la altura de pantalla
    backgroundColor: 'rgb(248, 248, 248)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#D35400',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  detailImage: {
    width: width * 0.7,
    height: (width * 0.7) * 0.7,
    borderRadius: 12,
    marginBottom: 24,
    resizeMode: 'cover',
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#111',
  },
  detailDesc: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#333',
    marginBottom: 32,
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 0,
  },
});
