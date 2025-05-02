const pool = require("../../db/mealMinderModel");
const bcrypt = require("bcrypt");

const authenticateUser = async (userData) => {
  const { email, password } = userData;
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT password, id FROM users WHERE email = $1",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            const hashedPassword = results.rows[0].password;
            const id = results.rows[0].id;
            let isMatch = bcrypt.compareSync(password, hashedPassword);
            isMatch
              ? resolve({ email, id })
              : reject("Invalid email or password");
          }
        }
      );
    });
  } catch (error) {
    throw new Error("Internal server error: authentication");
  }
};

module.exports = authenticateUser;
