import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// Mở database bằng API mới của expo-sqlite
export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("simple_contacts.db");
  }
  return db;
};

/**
 * Tạo bảng contacts + seed dữ liệu mẫu (chỉ chạy lần đầu)
 */
export const initContactsTable = async () => {
  const db = await getDb();

  // 1) Tạo bảng
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      favorite INTEGER DEFAULT 0,
      created_at INTEGER
    );
  `);

  // 2) Kiểm tra xem bảng đã có dữ liệu chưa
  const check = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM contacts"
  );

  // Nếu count = 0 → seed dữ liệu lần đầu
  if (check.count === 0) {
    const now = Date.now();

    await db.runAsync(
      `INSERT INTO contacts (name, phone, favorite, created_at)
       VALUES 
       (?, ?, ?, ?),
       (?, ?, ?, ?),
       (?, ?, ?, ?)
      `,
      [
        "Nguyễn Văn A",
        "0909000111",
        1,
        now,
        "Trần Thị B",
        "0909000222",
        0,
        now,
        "Lê Minh C",
        "0909333444",
        0,
        now,
      ]
    );

    console.log("✅ Seeded sample contacts");
  }
};
export const getAllContacts = async () => {
  const db = await getDb();
  return await db.getAllAsync(
    "SELECT * FROM contacts ORDER BY created_at DESC"
  );
};
export const createContact = async (name, phone, email) => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO contacts (name, phone, email, favorite, created_at)
     VALUES (?, ?, ?, 0, ?)`,
    [name, phone, email, Date.now()]
  );
};
