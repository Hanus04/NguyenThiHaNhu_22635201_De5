import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import {
  initContactsTable,
  getAllContacts,
  toggleFavorite,
  updateContact,
  deleteContact,
  insertContactIfNotExist,
} from "../db";

import AddContactModal from "../components/AddContactModal";
import EditContactModal from "../components/EditContactModal";

export default function IndexPage() {
  const [contacts, setContacts] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [search, setSearch] = useState("");
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);

  const [loadingImport, setLoadingImport] = useState(false);
  const [errorImport, setErrorImport] = useState(null);

  // Load DB
  const loadData = async () => {
    await initContactsTable();
    const data = await getAllContacts();
    setContacts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Realtime filter (useMemo để tối ưu)
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchText =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);

      const matchFavorite = showFavoriteOnly ? Number(c.favorite) === 1 : true;

      return matchText && matchFavorite;
    });
  }, [contacts, search, showFavoriteOnly]);

  // Toggle favorite
  const handleToggleFavorite = async (item) => {
    await toggleFavorite(item.id, Number(item.favorite));
    loadData();
  };

  // Save edit contact
  const handleEditContact = async ({ id, name, phone, email }) => {
    await updateContact(id, name, phone, email);
    setEditModalVisible(false);
    loadData();
  };

  // Save new contact
  const handleAddContact = async ({ name, phone, email }) => {
    await insertContactIfNotExist(name, phone, email);
    setAddModalVisible(false);
    loadData();
  };

  // Xóa contact
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

  // Import API
  const handleImportFromAPI = async () => {
    setLoadingImport(true);
    setErrorImport(null);

    try {
      const res = await fetch(
        "https://68e79e7110e3f82fbf3ff1c3.mockapi.io/contacts"
      );

      const list = await res.json();
      let added = 0;

      for (const item of list) {
        const ok = await insertContactIfNotExist(
          item.name,
          item.phone,
          item.email
        );
        if (ok) added++;
      }

      Alert.alert("Thành công", `Đã import ${added} liên hệ mới.`);
      loadData();
    } catch (err) {
      setErrorImport("Import thất bại, xin thử lại.");
    }

    setLoadingImport(false);
  };

  // Render item
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

      {/* Sửa */}
      <TouchableOpacity
        onPress={() => {
          setSelectedContact(item);
          setEditModalVisible(true);
        }}
        style={{ marginRight: 16 }}
      >
        <Text style={{ fontSize: 16, color: "#2563eb" }}>Sửa</Text>
      </TouchableOpacity>

      {/* Xóa */}
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

      {/* SEARCH + FILTER */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <TextInput
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => setShowFavoriteOnly(!showFavoriteOnly)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ marginRight: 6 }}>{showFavoriteOnly ? "☑" : "☐"}</Text>
          <Text>Chỉ hiển thị liên hệ yêu thích</Text>
        </TouchableOpacity>
      </View>

      {/* IMPORT BUTTON */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={handleImportFromAPI}
          style={{
            backgroundColor: "#2563eb",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            {loadingImport ? "Đang import..." : "Import từ API"}
          </Text>
        </TouchableOpacity>

        {errorImport && <Text style={{ color: "red" }}>{errorImport}</Text>}
      </View>

      {/* DANH SÁCH LIÊN HỆ */}
      {filteredContacts.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "gray", fontSize: 18 }}>
            Không có liên hệ nào.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {/* MODAL THÊM */}
      <AddContactModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddContact}
      />

      {/* MODAL SỬA */}
      <EditContactModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleEditContact}
        contact={selectedContact}
      />

      {/* NÚT + THÊM */}
      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
