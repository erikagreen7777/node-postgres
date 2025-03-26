const pool = require("../db/mealMinderModel");

const userExists = async (userEmail) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT * FROM users WHERE email = $1",
        [userEmail],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            resolve();
          }
        }
      );
    });
  } catch (error) {
    // console.error(error);
    throw new Error("Internal server error");
  }
};

module.exports = userExists;
