import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  modalContent: {
    width,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
  },
  detailImage: {
    width: Math.min(width * 0.6, 260),
    height: Math.min(width * 0.6, 260),
    borderRadius: Math.min(width * 0.3, 130),
    marginTop: 20,
    marginBottom: 24,
    backgroundColor: "#f0f0f0",
    resizeMode: "cover",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#eee",
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  detailDesc: {
    fontSize: 17,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  socialIcon: {
    width: 45,
    height: 45,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 2 },
  },
  socialBox: {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.28)',
  borderRadius: 12,
  padding: 16,
  marginVertical: 49,
  alignItems: 'center',
  borderBottomWidth: 5,
  borderBottomColor: '#3b5998',
},

});
