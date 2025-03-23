const pool = require("../db/mealMinderModel");

const updateUser = (id, body) => {
  return new Promise(function (resolve, reject) {
    const { first_name, last_name, email, id } = body;
    pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *",
      [first_name, last_name, email, id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(`User updated: ${JSON.stringify(results.rows[0])}`);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

module.exports = updateUser;
