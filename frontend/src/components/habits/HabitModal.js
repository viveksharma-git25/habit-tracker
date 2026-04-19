import React, { useState, useEffect } from "react";
import "./HabitModal.css";

const ICONS = ["⭐", "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "🎯", "🎨", "🎵", "💊", "🌿", "🧠", "❤️", "✍️", "🛠️", "🌅", "🏋️", "🚴"];
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#84cc16", "#f97316"];

const HabitModal = ({ isOpen, onClose, onSave, editHabit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "daily",
    color: "#6366f1",
    icon: "⭐",
  });

  useEffect(() => {
    if (editHabit) {
      setForm({
        title: editHabit.title || "",
        description: editHabit.description || "",
        frequency: editHabit.frequency || "daily",
        color: editHabit.color || "#6366f1",
        icon: editHabit.icon || "⭐",
      });
    } else {
      setForm({ title: "", description: "", frequency: "daily", color: "#6366f1", icon: "⭐" });
    }
  }, [editHabit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editHabit ? "Edit Habit" : "Create New Habit"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Habit Name *</label>
            <input
              type="text"
              placeholder="e.g. Morning Meditation"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="What is this habit about?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Frequency</label>
            <div className="frequency-options">
              {["daily", "weekly", "monthly"].map((freq) => (
                <button
                  type="button"
                  key={freq}
                  className={`freq-btn ${form.frequency === freq ? "active" : ""}`}
                  onClick={() => setForm({ ...form, frequency: freq })}
                >
                  {freq === "daily" ? "📅 Daily" : freq === "weekly" ? "📆 Weekly" : "🗓️ Monthly"}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-grid">
              {ICONS.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  className={`icon-btn ${form.icon === icon ? "active" : ""}`}
                  onClick={() => setForm({ ...form, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-grid">
              {COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`color-btn ${form.color === color ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setForm({ ...form, color })}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {editHabit ? "Save Changes" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
