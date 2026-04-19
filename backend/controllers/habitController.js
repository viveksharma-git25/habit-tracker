const Habit = require("../models/Habit");

const calculateStreak = (completions, frequency) => {
  if (!completions || completions.length === 0) return 0;

  const sorted = completions
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort((a, b) => new Date(b) - new Date(a));

  if (sorted.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const msPerDay = 86400000;
  const msPerWeek = 7 * msPerDay;

  for (let i = 0; i < sorted.length; i++) {
    const date = new Date(sorted[i]);
    date.setHours(0, 0, 0, 0);

    if (frequency === "daily") {
      const diff = Math.round((today - date) / msPerDay);
      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    } else if (frequency === "weekly") {
      const diff = Math.round((today - date) / msPerWeek);
      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    } else {
      const todayMonth = today.getFullYear() * 12 + today.getMonth();
      const dateMonth = date.getFullYear() * 12 + date.getMonth();
      const diff = todayMonth - dateMonth;
      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHabit = async (req, res) => {
  const { title, description, frequency, color, icon } = req.body;

  try {
    const habit = await Habit.create({
      user: req.user._id,
      title,
      description,
      frequency,
      color,
      icon,
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Habit.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleCompletion = async (req, res) => {
  const { date } = req.body;

  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const existingIndex = habit.completions.findIndex((c) => c.date === date);

    if (existingIndex >= 0) {
      habit.completions[existingIndex].completed = !habit.completions[existingIndex].completed;
    } else {
      habit.completions.push({ date, completed: true });
    }

    const newStreak = calculateStreak(habit.completions, habit.frequency);
    habit.streak = newStreak;
    if (newStreak > habit.longestStreak) {
      habit.longestStreak = newStreak;
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, toggleCompletion };
