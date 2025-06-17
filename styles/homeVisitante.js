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
    marginLeft: 2,
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
divider: {
  height: 1,
  backgroundColor: '#000000',
  marginVertical: 15,
  alignSelf: 'stretch',
  marginHorizontal: -24,
},
sectionBox: {
  width: '100%',
  backgroundColor: '#e6e6e6',
  padding: 16,
  borderRadius: 10,
  marginBottom: 20,
},
sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 8,
},
sectionNote: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
},
sectionBoxEnhanced: {
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  borderLeftWidth: 5,
  borderLeftColor: '#0070f3',
},
sectionTitleEnhanced: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#0070f3',
  marginBottom: 10,
  textAlign: 'center',
},
sectionNoteEnhanced: {
  fontSize: 15,
  color: '#444',
  lineHeight: 22,
  textAlign: 'center',
},
sectionBoxEnhancedPodcast: {
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  borderLeftWidth: 5,
  borderLeftColor: '#8E44AD', // Morado para distinguir la sección de Podcast
},
sectionTitleEnhancedPodcast: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#8E44AD',
  marginBottom: 10,
  textAlign: 'center',
},
sectionNoteEnhancedPodcast: {
  fontSize: 15,
  color: '#444',
  lineHeight: 22,
  textAlign: 'center',
},
sectionBoxEnhancedNews: {
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  borderLeftWidth: 5,
  borderLeftColor: '#D35400', // Naranja suave para destacar la sección de noticias
},

sectionTitleEnhancedNews: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#D35400',
  marginBottom: 16,
  textAlign: 'center',
},

newsCardEnhanced: {
  flexDirection: 'row',
  backgroundColor: '#fafafa',
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 12,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
},

newsImageEnhanced: {
  width: 100,
  height: 100,
  resizeMode: 'cover',
  borderTopLeftRadius: 10,
  borderBottomLeftRadius: 10,
},

newsContentEnhanced: {
  flex: 1,
  padding: 10,
  justifyContent: 'center',
},

newsTitleEnhanced: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: 4,
},

newsExcerptEnhanced: {
  fontSize: 14,
  color: '#666',
  lineHeight: 20,
},
socialBox: {
  width: '100%',
  backgroundColor: '#fdfdfd',
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
  alignItems: 'center',
  borderLeftWidth: 5,
  borderLeftColor: '#3b5998', // color destacado (Facebook blue)
},

socialTitleEnhanced: {
  fontSize: 20,
  fontWeight: '700',
  color: '#3b5998',
  marginBottom: 16,
  textAlign: 'center',
},

socialIconsRowEnhanced: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
  marginTop: 8,
},

socialIconEnhanced: {
  width: 50,
  height: 50,
  marginHorizontal: 10,
  borderRadius: 25,
  backgroundColor: '#fff',
  padding: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
sponsorBox: {
  width: '100%',
  backgroundColor: '#f9f9f9',
  borderRadius: 12,
  paddingVertical: 20,
  paddingHorizontal: 10,
  marginBottom: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
},

sponsorTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#005c8a',
  marginBottom: 16,
  textAlign: 'center',
},

sponsorCarouselEnhanced: {
  paddingLeft: 16,
},

sponsorCardEnhanced: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  marginRight: 16,
  alignItems: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

sponsorImageEnhanced: {
  width: '100%',
  height: 130,
  borderRadius: 10,
  marginBottom: 12,
},

sponsorNameEnhanced: {
  fontSize: 18,
  fontWeight: '700',
  color: '#222',
  marginBottom: 4,
},

sponsorInfoEnhanced: {
  fontSize: 14,
  color: '#555',
  textAlign: 'center',
},
liveSection: {
  width: '100%',
  backgroundColor: '#eaf6ff',
  padding: 20,
  borderRadius: 12,
  marginBottom: 24,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 3,
},

liveTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#003d66',
  marginBottom: 6,
  textAlign: 'center',
},

liveSubtitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#0077cc',
  marginBottom: 12,
  textAlign: 'center',
},

liveVideoContainer: {
  width: '100%',
  height: 400,
  backgroundColor: '#000',
  borderRadius: 12,
  overflow: 'hidden',
},

roundImage: {
  width: 55,
  height: 55,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: '#0070f3',
  marginBottom: 1,
},
errorText: {
    color: "#ff3333",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "bold",
  },

});
