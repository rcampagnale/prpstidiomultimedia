import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
  },
  safeArea: {
    flex: 1,
  },
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
  scrollContent: {
    paddingBottom: 16,
  },
  contentZone: {
    backgroundColor: '#0092BC',
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
  },
  programCarouselWrapper: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  programCarousel: {
    paddingHorizontal: 24,
  },
  programCard: {
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    marginRight: 16,
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
  // Auspiciantes
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
});
