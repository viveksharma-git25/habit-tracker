import React, { useState } from "react";
import { useHabits } from "../context/HabitContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import HabitCard from "../components/habits/HabitCard";
import HabitModal from "../components/habits/HabitModal";
import "./Dashboard.css";

const Dashboard = () => {
  const { habits, createHabit, updateHabit, deleteHabit, toggleCompletion, loading } = useHabits();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [filter, setFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];

  const todayDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const filteredHabits = habits.filter((h) => {
    if (filter === "all") return true;
    return h.frequency === filter;
  });

  const completedToday = habits.filter((h) => {
    const comp = h.completions?.find((c) => c.date === today);
    return comp?.completed;
  }).length;

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);

  const handleSave = async (formData) => {
    try {
      if (editHabit) {
        await updateHabit(editHabit._id, formData);
        toast.success("Habit updated! ✏️");
      } else {
        await createHabit(formData);
        toast.success("Habit created! 🌱");
      }
      setModalOpen(false);
      setEditHabit(null);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (habit) => {
    setEditHabit(habit);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this habit?")) {
      await deleteHabit(id);
      toast.success("Habit deleted");
    }
  };

  const handleToggle = async (id, date) => {
    try {
      const updated = await toggleCompletion(id, date);
      const comp = updated.completions?.find((c) => c.date === date);
      if (comp?.completed) {
        toast.success(`🔥 Streak: ${updated.streak} days!`);
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">
            Hello, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="dashboard-date">{todayDay}</p>
        </div>
        <button className="add-habit-btn" onClick={() => { setEditHabit(null); setModalOpen(true); }}>
          + New Habit
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-value">{habits.length}</div>
            <div className="stat-label">Total Habits</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-value">{completedToday}</div>
            <div className="stat-label">Done Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <div className="stat-value">{totalStreak}</div>
            <div className="stat-label">Total Streaks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div>
            <div className="stat-value">{maxStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>
      </div>

      {habits.length > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span>Today's Progress</span>
            <span>{completedToday} / {habits.filter(h => h.frequency === "daily").length || habits.length} completed</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%`
              }}
            />
          </div>
        </div>
      )}

      <div className="filter-tabs">
        {["all", "daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">
              {tab === "all" ? habits.length : habits.filter((h) => h.frequency === tab).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" />
          <p>Loading your habits...</p>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🌱</span>
          <h3>No habits yet</h3>
          <p>Create your first habit to start tracking your progress</p>
          <button className="add-habit-btn" onClick={() => setModalOpen(true)}>
            + Add First Habit
          </button>
        </div>
      ) : (
        <div className="habits-grid">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              todayDate={today}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <HabitModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditHabit(null); }}
        onSave={handleSave}
        editHabit={editHabit}
      />
    </div>
  );
};

export default Dashboard;
