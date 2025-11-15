import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getAllContacts } from "../db";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllContacts();
      setContacts(data);
    };
    load();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
        {item.phone ? (
          <Text style={{ color: "gray", marginTop: 2 }}>{item.phone}</Text>
        ) : null}
      </View>
      {Number(item.favorite) === 1 && (
        <Text style={{ fontSize: 20, color: "#facc15" }}>★</Text>
      )}
    </View>
  );

  // Empty view
  if (contacts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "gray" }}>
          Chưa có liên hệ nào.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}
