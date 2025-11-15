import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import useContacts from "../hooks/useContacts";

import AddContactModal from "../components/AddContactModal";
import EditContactModal from "../components/EditContactModal";
import { useState } from "react";

export default function IndexPage() {
  const {
    contacts,
    search,
    setSearch,
    showFavoriteOnly,
    setShowFavoriteOnly,
    loadingImport,
    errorImport,

    handleToggleFavorite,
    handleEditContact,
    handleAddContact,
    handleDelete,
    handleImportFromAPI,
  } = useContacts();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const renderItem = ({ item }) => (
    <View
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: item.favorite ? "#fff7c2" : "#ffffff", // highlight favorite
      }}
    >
      {/* Thông tin liên hệ */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
        <Text style={{ color: "gray" }}>{item.phone}</Text>
      </View>

      {/* Nút Sửa */}
      <TouchableOpacity
        onPress={() => {
          setSelectedContact(item);
          setEditVisible(true);
        }}
        style={{ marginRight: 16 }}
      >
        <Text style={{ fontSize: 16, color: "#2563eb" }}>Sửa</Text>
      </TouchableOpacity>

      {/* Nút Xóa */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Xác nhận", "Bạn có chắc muốn xóa?", [
            { text: "Hủy", style: "cancel" },
            {
              text: "Xóa",
              style: "destructive",
              onPress: () => handleDelete(item.id),
            },
          ])
        }
        style={{ marginRight: 16 }}
      >
        <Text style={{ fontSize: 16, color: "red" }}>Xóa</Text>
      </TouchableOpacity>

      {/* Toggle Favorite */}
      <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
        <Text
          style={{
            fontSize: 26,
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
          fontSize: 26,
          textAlign: "center",
          fontWeight: "700",
          marginTop: 80,
          marginBottom: 16,
        }}
      >
        Danh sách liên hệ
      </Text>

      {/* SEARCH */}
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          placeholder="Tìm kiếm..."
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
          style={{ flexDirection: "row" }}
        >
          <Text style={{ marginRight: 6 }}>{showFavoriteOnly ? "☑" : "☐"}</Text>
          <Text>Chỉ hiển thị mục yêu thích</Text>
        </TouchableOpacity>
      </View>

      {/* IMPORT */}
      <TouchableOpacity
        onPress={handleImportFromAPI}
        style={{
          backgroundColor: "#2563eb",
          padding: 12,
          margin: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {loadingImport ? "Đang import..." : "Import từ API"}
        </Text>
      </TouchableOpacity>

      {errorImport && (
        <Text style={{ color: "red", textAlign: "center" }}>{errorImport}</Text>
      )}

      {/* LIST */}
      {contacts.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ color: "gray", fontSize: 18 }}>
            Không có liên hệ nào.
          </Text>
        </View>
      ) : (
        <FlatList data={contacts} renderItem={renderItem} />
      )}

      {/* MODALS */}
      <AddContactModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSubmit={handleAddContact}
      />

      <EditContactModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSubmit={handleEditContact}
        contact={selectedContact}
      />

      {/* BUTTON + */}
      <TouchableOpacity
        onPress={() => setAddVisible(true)}
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
