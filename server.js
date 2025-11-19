// server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const User = require("./models/User");
const Comment = require("./models/Comment");

const app = express();

// ------------------ CONFIG ------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/AlgoWebsite";
const SESSION_SECRET = "your-secret";

// ------------------ MONGO ------------------
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ------------------ MIDDLEWARE ------------------
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Make user globally available
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Auth middleware
function ensureAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// ------------------ BASIC PAGES ------------------
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// ------------------ REGISTER ------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.send("Fill all fields");

    const exists = await User.findOne({ email });
    if (exists) return res.send("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    req.session.user = { _id: user._id, name: user.name };
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Signup error");
  }
});

// ------------------ LOGIN ------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("Invalid");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Invalid");

  req.session.user = { _id: user._id, name: user.name };
  res.redirect("/");
});

// ------------------ LOGOUT ------------------
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// ------------------ PAGE COMMENT ROUTES ------------------

// ---- BUBBLE SORT (123) ----
app.get("/123", async (req, res) => {
  const comments = await Comment.find({ page: "123" }).sort({ createdAt: -1 });
  res.render("123", { comments, commentAction: "/123/comment", deleteAction: "/123/delete/" });
});

// Additional EJS page routes
app.get("/dynamic-algorithms", (req, res) => res.render("dynamic-algorithms"));
app.get("/graph-algorithms", (req, res) => res.render("graph-algorithms"));
app.get("/greedy-algorithms", (req, res) => res.render("greedy-algorithms"));
app.get("/searching-algorithms", (req, res) => res.render("searching-algorithms"));
app.get("/sorting-algorithms", (req, res) => res.render("sorting-algorithms"));
app.get("/tree-algorithms", (req, res) => res.render("tree-algorithms"));
app.get("/home", (req, res) => res.render("home"));
app.get("/ComingSoon", (req, res) => res.render("ComingSoon"));

app.post("/123/comment", ensureAuth, async (req, res) => {
  await Comment.create({
    userName: req.session.user.name,
    userId: req.session.user._id,
    content: req.body.content,
    page: "123"
  });
  res.redirect("/123");
});

app.post("/123/delete/:id", ensureAuth, async (req, res) => {
  await Comment.deleteOne({ _id: req.params.id, userId: req.session.user._id });
  res.redirect("/123");
});

// ---- LINEAR SEARCH ----
app.get("/linear-search", async (req, res) => {
  const comments = await Comment.find({ page: "linear-search" }).sort({ createdAt: -1 });
  res.render("linear-search", { comments, commentAction: "/linear-search/comment", deleteAction: "/linear-search/delete/" });
});

app.post("/linear-search/comment", ensureAuth, async (req, res) => {
  await Comment.create({
    userName: req.session.user.name,
    userId: req.session.user._id,
    content: req.body.content,
    page: "linear-search"
  });
  res.redirect("/linear-search");
});

app.post("/linear-search/delete/:id", ensureAuth, async (req, res) => {
  await Comment.deleteOne({ _id: req.params.id, userId: req.session.user._id });
  res.redirect("/linear-search");
});

// ---- BINARY SEARCH ----
app.get("/binary-search", async (req, res) => {
  const comments = await Comment.find({ page: "binary-search" }).sort({ createdAt: -1 });
  res.render("binary-search", { comments, commentAction: "/binary-search/comment", deleteAction: "/binary-search/delete/" });
});

app.post("/binary-search/comment", ensureAuth, async (req, res) => {
  await Comment.create({
    userName: req.session.user.name,
    userId: req.session.user._id,
    content: req.body.content,
    page: "binary-search"
  });
  res.redirect("/binary-search");
});

app.post("/binary-search/delete/:id", ensureAuth, async (req, res) => {
  await Comment.deleteOne({ _id: req.params.id, userId: req.session.user._id });
  res.redirect("/binary-search");
});

// ------------------ START ------------------
app.listen(3000, () => console.log("Server running on port 3000"));
