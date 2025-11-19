const express = require("express");
const app = express();
const path = require("path");

// static
app.use(express.static("public"));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// CATEGORY ROUTES
app.get("/tree-algorithms", (req, res) => {
  res.render("tree-algorithms");
});

app.get("/sorting-algorithms", (req, res) => {
  res.render("sorting-algorithms");
});

app.get("/graph-algorithms", (req, res) => {
  res.render("graph-algorithms");
});

app.get("/dynamic-programming", (req, res) => {
  res.render("dynamic-programming");
});

app.get("/greedy-algorithms", (req, res) => {
  res.render("greedy-algorithms");
});

app.get("/searching-algorithms", (req, res) => {
  res.render("searching-algorithms");
});

// COMING SOON PAGE
app.get("/comingsoon", (req, res) => {
  res.render("ComingSoon");  // rename file if needed
});

app.get("/sorting-algorithms", (req, res) => res.render("sorting-algorithms"));
app.get("/dynamic-programming", (req, res) => res.render("dynamic-algorithms"));
app.get("/graph-algorithms", (req, res) => res.render("graph-algorithms"));
app.get("/searching-algorithms", (req, res) => res.render("searching-algorithms"));

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/123", (req, res) => {
  res.render("123");
});

// Linear Search Page
app.get("/linear-search", (req, res) => {
  res.render("linear-search");
});

// Binary Search Page
app.get("/binary-search", (req, res) => {
  res.render("binary-search");
});

app.listen(3000, () => console.log("Server running"));
