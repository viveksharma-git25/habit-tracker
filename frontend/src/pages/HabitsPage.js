import React, { useState } from "react";
import { useHabits } from "../context/HabitContext";
import { toast } from "react-toastify";
import HabitModal from "../components/habits/HabitModal";
import StreakBadge from "../components/habits/StreakBadge";
import "./HabitsPage.css";

const HabitsPage = () => {
  const { habits, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [viewMonth, setViewMonth] = useState(new Date());

  const today = new Date().toISOString().split("T")[0];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(viewMonth);

  const formatDate = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const isCompleted = (habit, dateStr) => {
    return habit.completions?.some((c) => c.date === dateStr && c.completed);
  };

  const prevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1));
  };

  const handleSave = async (formData) => {
    try {
      if (editHabit) {
        await updateHabit(editHabit._id, formData);
        toast.success("Habit updated!");
        setSelected(null);
      } else {
        await createHabit(formData);
        toast.success("Habit created! 🌱");
      }
      setModalOpen(false);
      setEditHabit(null);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this habit?")) {
      await deleteHabit(id);
      setSelected(null);
      toast.success("Habit deleted");
    }
  };

  const handleToggleDay = async (habitId, dateStr) => {
    try {
      await toggleCompletion(habitId, dateStr);
    } catch {
      toast.error("Failed to update");
    }
  };

  const monthName = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="habits-page">
      <div className="habits-page-header">
        <div>
          <h1>All Habits</h1>
          <p>{habits.length} habits tracked</p>
        </div>
        <button className="add-habit-btn" onClick={() => { setEditHabit(null); setModalOpen(true); }}>
          + New Habit
        </button>
      </div>

      <div className="habits-layout">
        <div className="habits-list-panel">
          {habits.length === 0 ? (
            <div className="panel-empty">
              <span>🌱</span>
              <p>No habits yet. Create one!</p>
            </div>
          ) : (
            habits.map((habit) => {
              const comp = habit.completions?.find((c) => c.date === today);
              const doneToday = comp?.completed;
              return (
                <div
                  key={habit._id}
                  className={`habit-list-item ${selected?._id === habit._id ? "selected" : ""}`}
                  style={{ borderLeftColor: habit.color }}
                  onClick={() => setSelected(habit._id === selected?._id ? null : habit)}
                >
                  <div className="habit-list-top">
                    <div className="habit-list-title">
                      <span>{habit.icon}</span>
                      <span>{habit.title}</span>
                    </div>
                    <div className="habit-list-actions">
                      <button
                        className={`mini-toggle ${doneToday ? "done" : ""}`}
                        onClick={(e) => { e.stopPropagation(); handleToggleDay(habit._id, today); }}
                      >
                        {doneToday ? "✓" : "○"}
                      </button>
                      <button
                        className="mini-btn"
                        onClick={(e) => { e.stopPropagation(); setEditHabit(habit); setModalOpen(true); }}
                      >
                        ✏️
                      </button>
                      <button
                        className="mini-btn danger"
                        onClick={(e) => { e.stopPropagation(); handleDelete(habit._id); }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="habit-list-meta">
                    <span className="freq-pill">{habit.frequency}</span>
                    <StreakBadge streak={habit.streak} size="sm" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="calendar-panel">
          {selected ? (
            <>
              <div className="calendar-habit-info">
                <span className="cal-habit-icon">{selected.icon}</span>
                <div>
                  <h3>{selected.title}</h3>
                  {selected.description && <p>{selected.description}</p>}
                </div>
              </div>

              <div className="calendar-nav">
                <button onClick={prevMonth}>‹</button>
                <span>{monthName}</span>
                <button onClick={nextMonth}>›</button>
              </div>

              <div className="calendar-grid">
                {weekDays.map((d) => (
                  <div key={d} className="cal-weekday">{d}</div>
                ))}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} className="cal-empty" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(year, month, day);
                  const done = isCompleted(selected, dateStr);
                  const isFuture = dateStr > today;
                  const isToday = dateStr === today;
                  return (
                    <button
                      key={day}
                      className={`cal-day ${done ? "done" : ""} ${isToday ? "today" : ""} ${isFuture ? "future" : ""}`}
                      onClick={() => !isFuture && handleToggleDay(selected._id, dateStr)}
                      disabled={isFuture}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="calendar-legend">
                <div><span className="legend-dot done-dot" /> Completed</div>
                <div><span className="legend-dot miss-dot" /> Missed</div>
                <div><span className="legend-dot today-dot" /> Today</div>
              </div>
            </>
          ) : (
            <div className="cal-empty-state">
              <span>📅</span>
              <p>Select a habit to view its calendar</p>
            </div>
          )}
        </div>
      </div>

      <HabitModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditHabit(null); }}
        onSave={handleSave}
        editHabit={editHabit}
      />
    </div>
  );
};

export default HabitsPage;
