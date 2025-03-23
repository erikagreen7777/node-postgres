const pool = require("../db/mealMinderModel");

const createUser = (body) => {
  return new Promise(function (resolve, reject) {
    const { first_name, last_name, email } = body;
    pool.query(
      "INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *",
      [first_name, last_name, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new user has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

module.exports = createUser;
