import { View, Text, TextInput, StyleSheet } from "react-native";

interface NoteSectionProps {
  note: string;
  setNote: (note: string) => void;
}

export default function NoteSection({ note, setNote }: NoteSectionProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Ghi chú</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Nhập ghi chú"
        value={note}
        onChangeText={setNote}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },
  noteInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    height: 90,
    textAlignVertical: "top",
  },
});