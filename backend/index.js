const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/skillDB")
.then(() => console.log("✅ DB Connected"))
.catch(err => console.log(err));

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  skills: [String],
  experience: Number,
  status: String
});

const User = mongoose.model("User", UserSchema);

// Career Logic
function suggestCareer(skills) {
  if (skills.includes("JavaScript")) return "Web Developer";
  if (skills.includes("React") || skills.includes("Node.js")) return "MERN Developer";
  if (skills.includes("ML") || skills.includes("Python")) return "AI Engineer";
  if (skills.includes("Cyber Security")) return "Security Analyst";
  return "Explorer";
}

// ➕ Add
app.post("/add", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("Added");
});

// 📥 Get
app.get("/users", async (req, res) => {
  const users = await User.find();

  const result = users.map(u => ({
    ...u._doc,
    career: suggestCareer(u.skills)
  }));

  res.json(result);
});

// ✏️ Update status
app.put("/update/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated");
});

// ❌ Delete
app.delete("/delete/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// 🔍 Filter (MERN / JS / ML)
app.get("/filter", async (req, res) => {
  const data = await User.find({
    skills: { $in: ["JavaScript", "ML"] }
  });
  res.json(data);
});

app.listen(5000, () => console.log("🚀 Server running"));