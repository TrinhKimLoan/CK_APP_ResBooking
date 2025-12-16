import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface AreaSelectorProps {
  areas: string[];
  selectedArea: string | null;
  setSelectedArea: (area: string) => void;
}

export default function AreaSelector({ areas, selectedArea, setSelectedArea }: AreaSelectorProps) {
  return (
    <View style={styles.areaRow}>
      {[...areas]
      .sort((a, b) => a.localeCompare(b, "vi"))
      .map((area) => (
        <TouchableOpacity
          key={area}
          style={[
            styles.areaBtn,
            selectedArea === area && styles.areaBtnActive,
          ]}
          onPress={() => setSelectedArea(area)}
        >
          <Text
            style={[
              styles.areaText,
              selectedArea === area && styles.areaTextActive,
            ]}
          >
            {area}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const PRIMARY = "#EC5A11";
const styles = StyleSheet.create({
  areaRow: { flexDirection: "row", marginTop: 10, gap: 10 },
  areaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  areaBtnActive: {
    backgroundColor: "#ea804cff",  
    borderColor: PRIMARY,
  },
  areaText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  areaTextActive: {
    color: "white",
    fontWeight: "700",
  },
});