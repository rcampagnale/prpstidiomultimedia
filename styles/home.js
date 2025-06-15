import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // 📦 CONTENEDORES Y ESTRUCTURA GENERAL
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // 🧭 ENCABEZADO / HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 54,
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 15,
    alignSelf: 'stretch',
    marginHorizontal: -24,
  },

  // 🎥 VIDEO PRINCIPAL
  videoContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
  },

  // 📺 SECCIÓN "LO MÁS VISTO"
  contentZone: {
    backgroundColor: '#0092BC',
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 10,
  },
  programCarouselWrapper: {
    marginVertical: 16,
  },
  programCarousel: {
    paddingHorizontal: 24,
  },
  programCard: {
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    marginRight: 26,
  },
  programImage: {
    width: '100%',
    height: 120,
  },
  programInfo: {
    padding: 12,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  programTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // 📰 SECCIÓN DE NOTICIAS
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  newsImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  newsContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
  },

  // 🎙️ SECCIÓN DE PODCAST (CATEGORÍAS Y CARRUSELES)
  section: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    width: width * 0.5,
    marginRight: 16,
    backgroundColor: '#c5ceae',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 10,
    color: '#333',
  },

  // 🤝 SECCIÓN AUSPICIANTES
  sponsorCarousel: {
    paddingHorizontal: 24,
  },
  sponsorCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    elevation: 4,
  },
  sponsorImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sponsorInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },

  // 🔘 BOTÓN GENERAL
  button: {
    backgroundColor: '#0070f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginLeft: 8,
  },
  socialBlock: {
  marginTop: 30,
  paddingHorizontal: 24,
  alignItems: 'center',
},

socialTitle: {
  fontSize: 20,
  fontWeight: '600',
  color: '#333',
  marginBottom: 12,
},

socialIconsRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 26,
},

socialIcon: {
  width: 40,
  height: 40,
  marginHorizontal: 10,
 },

});

