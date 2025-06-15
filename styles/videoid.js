import { StyleSheet } from "react-native";

export default StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#111',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  webview: {
    flex: 1,
    width: width,
    height: height - 50,
  },
  loader: {
    position: 'absolute',
    top: (height / 2) - 20,
    left: (width / 2) - 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
  },
});
