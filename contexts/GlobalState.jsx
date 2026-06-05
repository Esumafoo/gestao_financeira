import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

// A API retorna category como objeto { id, name, ... }.
// O frontend usa item.category como string (ex: "income") em vários lugares.
// Esta função normaliza a transação para manter compatibilidade total.
function normalizeTransaction(tx) {
  return {
    ...tx,
    category: tx.category?.name ?? tx.category, // objeto → string (name)
    categoryId: tx.categoryId ?? tx.category?.id,
  };
}

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState({});
  const [userName, setUserName] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const apiCategories = await api.getCategories();
        const categoriesObj = {};
        apiCategories.forEach((cat) => {
          categoriesObj[cat.id] = cat;
        });
        setCategories(categoriesObj);

        const apiTransactions = await api.getTransactions();
        setTransactions(apiTransactions.map(normalizeTransaction));
      } catch (e) {
        console.log("Erro ao ligar à API:", e.message);
      } finally {
        setIsReady(true);
      }
    };
    loadInitialData();
  }, []);

  const deleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateTransaction = async () => {
    console.log("Backend não suporta edição de transações.");
  };

  const addCategory = async (newCategory) => {
    try {
      const payload = {
        name: newCategory.name,
        displayName: newCategory.displayName,
        icon: "category",
        color: "#CCCCCC",
      };
      const saved = await api.createCategory(payload);
      setCategories((prev) => ({ ...prev, [saved.id]: saved }));
    } catch (e) {
      console.log(e.message);
    }
  };

  const saveUserName = async (name) => {
    try {
      setUserName(name);
      await AsyncStorage.setItem("userName", name);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <MoneyContext.Provider
      value={[
        transactions,
        setTransactions,
        filterDate,
        setFilterDate,
        deleteTransaction,
        updateTransaction,
        editingTransaction,
        setEditingTransaction,
        categories,
        addCategory,
        userName,
        saveUserName,
        isReady,
      ]}
    >
      {children}
    </MoneyContext.Provider>
  );
}
