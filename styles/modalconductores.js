import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  detailImage: {
    width: width - 32,
    height: (width - 32) * 0.6,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  detailDesc: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
    color: '#555',
    marginBottom: 24,
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 16,
  },
});
