const pool = require("../../db/mealMinderModel");

const deleteUser = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(`User deleted with ID: ${id}`);
    });
  });
};

module.exports = deleteUser;
