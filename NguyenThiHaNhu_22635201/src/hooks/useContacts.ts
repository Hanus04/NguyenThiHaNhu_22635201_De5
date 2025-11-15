import { useState, useEffect, useCallback, useMemo } from "react";
import {
  initContactsTable,
  getAllContacts,
  toggleFavorite,
  updateContact,
  deleteContact,
  insertContactIfNotExist,
} from "../db";

export default function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);

  const [loadingImport, setLoadingImport] = useState(false);
  const [errorImport, setErrorImport] = useState<string | null>(null);

  /** Load DB */
  const loadData = useCallback(async () => {
    await initContactsTable();
    const data = await getAllContacts();
    setContacts(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /** Toggle favorite */
  const handleToggleFavorite = useCallback(
    async (item) => {
      await toggleFavorite(item.id, Number(item.favorite));
      loadData();
    },
    [loadData]
  );

  /** Edit */
  const handleEditContact = useCallback(
    async ({ id, name, phone, email }) => {
      await updateContact(id, name, phone, email);
      loadData();
    },
    [loadData]
  );

  /** Add */
  const handleAddContact = useCallback(
    async ({ name, phone, email }) => {
      await insertContactIfNotExist(name, phone, email);
      loadData();
    },
    [loadData]
  );

  /** Delete */
  const handleDelete = useCallback(
    async (id: number) => {
      await deleteContact(id);
      loadData();
    },
    [loadData]
  );

  /** Import from API */
  const handleImportFromAPI = useCallback(async () => {
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

      loadData();
    } catch (err) {
      setErrorImport("Không thể import dữ liệu.");
    }

    setLoadingImport(false);
  }, [loadData]);

  /** Realtime filter */
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchText =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);

      const matchFavorite = showFavoriteOnly ? Number(c.favorite) === 1 : true;

      return matchText && matchFavorite;
    });
  }, [contacts, search, showFavoriteOnly]);

  return {
    contacts: filteredContacts,
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
  };
}
