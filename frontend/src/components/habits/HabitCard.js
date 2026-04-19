import React from "react";
import "./HabitCard.css";

const HabitCard = ({ habit, onToggle, onEdit, onDelete, todayDate }) => {
  const todayCompletion = habit.completions?.find((c) => c.date === todayDate);
  const isCompletedToday = todayCompletion?.completed || false;

  const getStreakEmoji = (streak) => {
    if (streak === 0) return "💤";
    if (streak < 3) return "🌱";
    if (streak < 7) return "🔥";
    if (streak < 14) return "⚡";
    if (streak < 30) return "🚀";
    return "🌟";
  };

  return (
    <div className={`habit-card ${isCompletedToday ? "completed" : ""}`} style={{ borderLeftColor: habit.color }}>
      <div className="habit-card-header">
        <div className="habit-icon-title">
          <span className="habit-icon">{habit.icon}</span>
          <div>
            <h3 className="habit-title">{habit.title}</h3>
            {habit.description && <p className="habit-desc">{habit.description}</p>}
          </div>
        </div>
        <div className="habit-actions">
          <button className="action-btn edit-btn" onClick={() => onEdit(habit)} title="Edit">
            ✏️
          </button>
          <button className="action-btn delete-btn" onClick={() => onDelete(habit._id)} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className="habit-card-footer">
        <div className="habit-meta">
          <span className="frequency-badge">{habit.frequency}</span>
          <div className="streak-info">
            <span className="streak-emoji">{getStreakEmoji(habit.streak)}</span>
            <span className="streak-count">{habit.streak}</span>
            <span className="streak-label">streak</span>
          </div>
          {habit.longestStreak > 0 && (
            <div className="best-streak">
              <span>Best: {habit.longestStreak}</span>
            </div>
          )}
        </div>

        <button
          className={`toggle-btn ${isCompletedToday ? "done" : ""}`}
          onClick={() => onToggle(habit._id, todayDate)}
        >
          {isCompletedToday ? "✓ Done" : "Mark Done"}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
