import { Slot } from "expo-router";
import { useEffect } from "react";
import { getDb } from "../db";

export default function RootLayout() {
  useEffect(() => {
    const connect = async () => {
      const db = await getDb();
      console.log("✅ SQLite connected:", db);
    };

    connect();
  }, []);

  return <Slot />;
}
