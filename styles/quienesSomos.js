// styles/quienesSomos.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 64,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
    width: '130%',
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 15,
    alignSelf: 'stretch',
    marginHorizontal: -24,
  },
  socialBlock: {
    marginTop: 30,
    paddingHorizontal: 24,
    alignItems: 'center', // ✅ corregido
  },
  socialTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  socialIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center', // ✅ corregido
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10, // ya está perfecto
  },
  
});
