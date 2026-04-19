import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchHabits();
    } else {
      setHabits([]);
    }
  }, [token]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/habits");
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitData) => {
    const res = await axios.post("/api/habits", habitData);
    setHabits((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateHabit = async (id, habitData) => {
    const res = await axios.put(`/api/habits/${id}`, habitData);
    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    return res.data;
  };

  const deleteHabit = async (id) => {
    await axios.delete(`/api/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  const toggleCompletion = async (id, date) => {
    const res = await axios.post(`/api/habits/${id}/toggle`, { date });
    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    return res.data;
  };

  return (
    <HabitContext.Provider value={{ habits, loading, fetchHabits, createHabit, updateHabit, deleteHabit, toggleCompletion }}>
      {children}
    </HabitContext.Provider>
  );
};
