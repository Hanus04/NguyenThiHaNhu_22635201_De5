import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { initContactsTable, getAllContacts, createContact } from "../db";
import AddContactModal from "../components/AddContactModal";

export default function IndexPage() {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadData = async () => {
    await initContactsTable();
    const data = await getAllContacts();
    setContacts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addNewContact = async ({ name, phone, email }) => {
    await createContact(name, phone, email);
    await loadData();
    setModalVisible(false);
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

      {Number(item.favorite) === 1 && (
        <Text style={{ fontSize: 20, color: "#facc15" }}>★</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* TITLE */}
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

      {/* Empty state */}
      {contacts.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "gray" }}>
            Chưa có liên hệ nào.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          width: 55,
          height: 55,
          borderRadius: 30,
          backgroundColor: "#2563eb",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, color: "white" }}>+</Text>
      </TouchableOpacity>

      <AddContactModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addNewContact}
      />
    </View>
  );
}
