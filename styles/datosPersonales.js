import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#0070f3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 15,
    alignSelf: 'stretch',
    marginHorizontal: -24,
  },
});
