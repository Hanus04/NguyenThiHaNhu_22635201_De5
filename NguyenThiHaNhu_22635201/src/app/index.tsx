import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { initContactsTable, getAllContacts } from "../db";

export default function Page() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const load = async () => {
      await initContactsTable();
      const data = await getAllContacts();
      setContacts(data);
    };
    load();
  }, []);

  return (
    <View style={{ padding: 20, marginTop: 39 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Danh sách Contact (Câu 2)
      </Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ fontSize: 16, color: "gray" }}>{item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}
