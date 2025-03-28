const pool = require("../db/mealMinderModel");
const bcrypt = require("bcrypt");

// TODO: add further email, firstname, lastname, and password validation?

const createUser = async (body) => {
  try {
    return await new Promise(function (resolve, reject) {
      const { firstName, lastName, email, password } = body;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const hashedPassword = hash;
      pool.query(
        "INSERT INTO users (first_name, last_name, email, salt, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [firstName, lastName, email, salt, hashedPassword],
        (error, results) => {
          if (error) {
            console.log(`Error: ${error}`);
            reject(error);
          }
          if (results && results.rows) {
            resolve(JSON.stringify(results.rows[0]));
          }
        }
      );
    });
  } catch (e) {
    throw new Error("Something went wrong");
  }
};

module.exports = createUser;
