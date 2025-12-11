import { View, Text, Image, StyleSheet } from "react-native";

export default function SeatCard({ item }: any) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    padding: 10,
    backgroundColor: "#fff",
    marginRight: 12,
    borderRadius: 12
  },
  image: {
    width: "100%",
    height: 90,
    borderRadius: 10
  },
  name: {
    marginTop: 8,
    fontWeight: "600"
  },
  desc: {
    color: "#666",
    fontSize: 13
  }
});
