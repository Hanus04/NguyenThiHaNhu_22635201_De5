import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import {
  initContactsTable,
  getAllContacts,
  toggleFavorite,
  updateContact,
  deleteContact,
} from "../db";
import EditContactModal from "../components/EditContactModal";

export default function IndexPage() {
  const [contacts, setContacts] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

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

  const handleEditContact = async ({ id, name, phone, email }) => {
    await updateContact(id, name, phone, email);
    await loadData();
    setEditModalVisible(false);
  };

  const handleDelete = (item) => {
    Alert.alert("Xác nhận", `Bạn có chắc muốn xóa liên hệ "${item.name}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteContact(item.id);
          loadData();
        },
      },
    ]);
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

      {/* Nút sửa */}
      <TouchableOpacity
        onPress={() => {
          setSelectedContact(item);
          setEditModalVisible(true);
        }}
        style={{ marginRight: 16 }}
      >
        <Text style={{ fontSize: 16, color: "#2563eb" }}>Sửa</Text>
      </TouchableOpacity>

      {/* Nút xóa */}
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={{ marginRight: 16 }}
      >
        <Text style={{ fontSize: 16, color: "red" }}>Xóa</Text>
      </TouchableOpacity>

      {/* Favorite toggle */}
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

      <EditContactModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleEditContact}
        contact={selectedContact}
      />
    </View>
  );
}
