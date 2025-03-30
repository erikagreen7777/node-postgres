require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const ssl_key = "certs/localhost.key";
const ssl_cert = "certs/localhost.crt";
const mm_model = require("./db/mealMinderModel");
const session = require("express-session");
const requireAuth = require("./routes/requireAuth");

const app = express();
const port = process.env.PORT ?? 3001;

// Load SSL certificate
const options = {
  key: fs.readFileSync(ssl_key, "utf-8"),
  cert: fs.readFileSync(ssl_cert, "utf-8"),
};

// Middleware
app.use(express.json());
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// CORS Headers
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

// Routes
const createUser = require("./routes/createUser");
const getUsers = require("./routes/getUsers");
const deleteUser = require("./routes/deleteUser");
const updateUser = require("./routes/updateUser");
const userExists = require("./routes/userExists");
const authenticateUser = require("./routes/authenticateUser");

// TODO: Is there a way to not have to repeat the same code in each route?

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// app.get("/dashboard", requireAuth, (req, res) => {
//   res.render("https://localhost:3000/dashboard")
// });

// app.post("/login", (req, res) => {
//   if (validCredentials) {
//     req.session.userId = userId; // Set session identifier
//     res.redirect("https://localhost:3000/dashboard");
//   } else {
//     res.render("login", { error: "Invalid username or password" });
//   }
// });

app.get("/userExists", (req, res) => {
  userExists(req.query.email)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/authenticateUser", (req, res) => {
  authenticateUser(req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) =>
      res
        .status(error.status || 500)
        .send(error.message || "Authentication failed")
    );
});

app.get("/users", (req, res) => {
  getUsers()
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/createUser", (req, res) => {
  createUser(req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) =>
      res.status(error.status || 500).send(error.message || "An error occurred")
    );
});

app.delete("/users/:id", (req, res) => {
  deleteUser(req.params.id)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.put("/users/:id", (req, res) => {
  updateUser(req.params.id, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

// Start HTTPS Server
https.createServer(options, app).listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
