// src/db.ts
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Mở database dạng async — chuẩn cho expo-sqlite API mới
 */
export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("simple_contacts.db");
  }
  return db;
};
