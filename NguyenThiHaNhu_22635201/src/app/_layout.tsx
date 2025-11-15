import { Slot } from "expo-router";
import { useEffect } from "react";
import { initContactsTable } from "../db";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initContactsTable();
        console.log("✅ Contacts table ready");
      } catch (err) {
        console.log("❌ DB init error:", err);
      }
    };

    setup();
  }, []);

  return <Slot />;
}
