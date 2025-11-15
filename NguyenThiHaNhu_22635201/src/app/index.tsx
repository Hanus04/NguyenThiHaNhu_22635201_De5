import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { initContactsTable, getAllContacts, toggleFavorite } from "../db";

export default function IndexPage() {
  const [contacts, setContacts] = useState([]);

  const loadData = async () => {
    await initContactsTable();
    const data = await getAllContacts();
    setContacts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFavorite = async (item) => {
    await toggleFavorite(item.id, Number(item.favorite));
    loadData();
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
        <Text style={{ color: "gray" }}>{item.phone}</Text>
      </View>

      {/* Toggle favorite */}
      <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
        <Text
          style={{
            fontSize: 24,
            color: Number(item.favorite) === 1 ? "#facc15" : "#ccc",
          }}
        >
          ★
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          fontWeight: "bold",
          marginVertical: 16,
          marginTop: 90,
        }}
      >
        Danh sách liên hệ
      </Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
