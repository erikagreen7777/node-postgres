require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");

const app = express();
const port = 3001;

// Load SSL certificate
const options = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT),
};

// Middleware
app.use(express.json());

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

app.get("/users", (req, res) => {
  getUsers()
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/users", (req, res) => {
  createUser(req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
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

// require("dotenv").config();
// const express = require("express");
// const app = express();
// const port = 3001;

// // const meal_minder_model = require("db/mealMinderModel");
// const createUser = require("./routes/createUser");
// const getUsers = require("./routes/getUsers");
// const deleteUser = require("./routes/deleteUser");
// const updateUser = require("./routes/updateUser");

// app.use(express.json());

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Access-Control-Allow-Headers"
//   );
//   next();
// });

// app.get("/users", (req, res) => {
//   getUsers()
//     .then((response) => {
//       res.status(200).send(response);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });
// //   res.status(200).send("Hello World!");
// // });

// app.post("/users", (req, res) => {
//   createUser(req.body)
//     .then((response) => {
//       res.status(200).send(response);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// app.delete("/users/:id", (req, res) => {
//   deleteUser(req.params.id)
//     .then((response) => {
//       res.status(200).send(response);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// app.put("/users/:id", (req, res) => {
//   const id = req.params.id;
//   const body = req.body;
//   updateUser(id, body)
//     .then((response) => {
//       res.status(200).send(response);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// app.listen(port, () => {
//   console.log(`App running on port ${port}.`);
// });
