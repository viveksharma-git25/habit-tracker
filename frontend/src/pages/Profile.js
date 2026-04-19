import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHabits } from "../context/HabitContext";
import { toast } from "react-toastify";
import axios from "axios";
import StreakBadge from "../components/habits/StreakBadge";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { habits } = useHabits();
  const [activeTab, setActiveTab] = useState("info");
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    age: user?.age || "",
    location: user?.location || "",
    avatar: user?.avatar || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completions?.some((c) => c.date === today && c.completed)).length;
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completions?.filter((c) => c.completed).length || 0), 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);
  const currentStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("/api/user/profile", profileForm);
      updateUser(res.data);
      toast.success("Profile updated! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await axios.put("/api/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          {profileForm.avatar ? (
            <img src={profileForm.avatar} alt="avatar" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-placeholder">{getInitials(user?.name)}</div>
          )}
        </div>
        <div className="profile-hero-info">
          <h1>{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="profile-tags">
            {user?.location && <span className="profile-tag">📍 {user.location}</span>}
            {user?.age && <span className="profile-tag">🎂 Age {user.age}</span>}
            <span className="profile-tag">📅 Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="pstat-card">
          <div className="pstat-icon">📋</div>
          <div className="pstat-val">{totalHabits}</div>
          <div className="pstat-label">Total Habits</div>
        </div>
        <div className="pstat-card">
          <div className="pstat-icon">✅</div>
          <div className="pstat-val">{completedToday}</div>
          <div className="pstat-label">Done Today</div>
        </div>
        <div className="pstat-card">
          <div className="pstat-icon">🎯</div>
          <div className="pstat-val">{totalCompletions}</div>
          <div className="pstat-label">All Time</div>
        </div>
        <div className="pstat-card">
          <div className="pstat-icon">🔥</div>
          <div className="pstat-val">{currentStreak}</div>
          <div className="pstat-label">Active Streaks</div>
        </div>
        <div className="pstat-card">
          <div className="pstat-icon">🏆</div>
          <div className="pstat-val">{bestStreak}</div>
          <div className="pstat-label">Best Streak</div>
        </div>
      </div>

      {habits.length > 0 && (
        <div className="streak-showcase">
          <h3>Habit Streaks</h3>
          <div className="streak-list">
            {habits.map((h) => (
              <div key={h._id} className="streak-row" style={{ borderLeftColor: h.color }}>
                <div className="streak-row-left">
                  <span className="streak-row-icon">{h.icon}</span>
                  <span className="streak-row-name">{h.title}</span>
                </div>
                <StreakBadge streak={h.streak} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-tabs">
        <button className={`ptab ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
          Edit Profile
        </button>
        <button className={`ptab ${activeTab === "password" ? "active" : ""}`} onClick={() => setActiveTab("password")}>
          Change Password
        </button>
      </div>

      {activeTab === "info" && (
        <form onSubmit={handleProfileSave} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="Your age"
                value={profileForm.age}
                onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                min="1"
                max="120"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. New Delhi, India"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              placeholder="Tell us about yourself..."
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Avatar URL</label>
            <input
              type="url"
              placeholder="https://your-image-url.com/photo.jpg"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
            />
          </div>

          <button type="submit" className="profile-save-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handlePasswordSave} className="profile-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="profile-save-btn" disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
