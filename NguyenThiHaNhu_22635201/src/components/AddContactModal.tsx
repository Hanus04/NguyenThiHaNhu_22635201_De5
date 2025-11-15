import { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button, Alert } from "react-native";

export default function AddContactModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible]);

  const save = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length === 0) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return;
    }

    if (trimmedEmail.length === 0) {
      Alert.alert("Lỗi", "Email không được để trống");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      Alert.alert("Lỗi", "Email phải chứa ký tự @");
      return;
    }

    return onSubmit({
      name: trimmedName,
      phone,
      email: trimmedEmail,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
            Thêm liên hệ mới
          </Text>

          <TextInput
            placeholder="Tên (bắt buộc)"
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
            }}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="Hủy" onPress={onClose} />
            <Button title="Lưu" onPress={save} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
