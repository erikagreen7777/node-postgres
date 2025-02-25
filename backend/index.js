require("dotenv").config();
const express = require("express");
const app = express();
const port = 3001;

const meal_minder_model = require("db/mealMinderModel");

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/", (req, res) => {
  meal_minder_model
    .getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
//   res.status(200).send("Hello World!");
// });

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
