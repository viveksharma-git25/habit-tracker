import React from "react";
import "./StreakBadge.css";

const StreakBadge = ({ streak, size = "md" }) => {
  const getLevel = (s) => {
    if (s === 0) return { emoji: "💤", label: "Inactive", color: "#64748b" };
    if (s < 3) return { emoji: "🌱", label: "Sprouting", color: "#84cc16" };
    if (s < 7) return { emoji: "🔥", label: "On Fire", color: "#f97316" };
    if (s < 14) return { emoji: "⚡", label: "Electric", color: "#eab308" };
    if (s < 30) return { emoji: "🚀", label: "Rocket", color: "#8b5cf6" };
    return { emoji: "🌟", label: "Legend", color: "#f59e0b" };
  };

  const level = getLevel(streak);

  return (
    <div className={`streak-badge streak-badge--${size}`} style={{ borderColor: level.color }}>
      <span className="streak-badge__emoji">{level.emoji}</span>
      <div className="streak-badge__info">
        <span className="streak-badge__count" style={{ color: level.color }}>{streak}</span>
        <span className="streak-badge__text">day streak</span>
      </div>
    </div>
  );
};

export default StreakBadge;
