import { Accent } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PeopleCounterProps {
  people: number;
  setPeople: (updater: (prev: number) => number) => void;
}

export default function PeopleCounter({ people, setPeople }: PeopleCounterProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Số người:</Text>

      <View style={styles.counterBox}>
        <TouchableOpacity
          onPress={() => setPeople((p) => Math.max(1, p - 1))}
          style={styles.counterBtn}
        >
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.peopleText}>{people}</Text>

        <TouchableOpacity
          onPress={() => setPeople((p) => p + 1)}
          style={styles.counterBtn}
        >
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY = Accent.base;
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  label: { fontSize: 16 },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Accent.light,
  },
  counterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Accent.light,
  },
  counterText: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
  },
  peopleText: {
    marginHorizontal: 18,
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
});