require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const ssl_key = "certs/localhost.key";
const ssl_cert = "certs/localhost.crt";
const mm_model = require("./db/mealMinderModel");
const session = require("express-session");
const requireAuth = require("./routes/users/requireAuth");
// const MongoStore = require('connect-mongo')(session);

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
    cookie: {
      secure: false,
      maxAge: 3600000,
      //  httpOnly: true, // Prevent client-side access to cookies
      //  sameSite: 'strict'  // Mitigate CSRF attacks
      //   store: new MongoStore(
      //     {
      //         url: 'mongodb://localhost/session-store'
      //     }
      // )
    },
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
const createUser = require("./routes/users/createUser");
const getUsers = require("./routes/users/getUsers");
const deleteUser = require("./routes/users/deleteUser");
const updateUser = require("./routes/users/updateUser");
const userExists = require("./routes/users/userExists");
const authenticateUser = require("./routes/users/authenticateUser");

// TODO: Is there a way to not have to repeat the same code in each route?

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/dashboard", (req, res) => {
  if (req.session.userId) {
    res.json({ message: `Welcome ${req.session.email}` });
    // res.json({ message: "Login successful", session: req.session });
  } else {
    res.send("No session data found");
  }
});

app.get("/auth-status", (req, res) => {
  if (req.session.userId) {
    res.json({ isAuthenticated: true, email: req.session.email });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

app.post("/login", async (req, res) => {
  try {
    const userRecord = await authenticateUser(req.body);
    if (!userRecord) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    req.session.userId = userRecord.id;
    req.session.email = userRecord.email;
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.get("/logout", (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging out");
    } else {
      res.send("Logged out");
      redirect("/");
    }
  });
});

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
