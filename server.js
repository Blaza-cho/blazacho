const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Handle register
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Load current users
  let users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

  // Check if user exists
  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.send("❌ User already exists. Try a different username.");
  }

  // Add new user
  users.push({ username, password });
  fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

  res.send(`✅ User ${username} registered successfully!`);
});

// Handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Load current users
  let users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

  // Find user
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send(`🎉 Welcome back, ${username}!`);
  } else {
    res.send("❌ Invalid username or password.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
