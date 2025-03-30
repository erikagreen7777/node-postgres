const pool = require("../db/mealMinderModel");
const bcrypt = require("bcrypt");

const authenticateUser = async (userData) => {
  const { email, password: enteredPassword } = userData;
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT password FROM users WHERE email = $1",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            const hashedPassword = results.rows[0].password;
            const isMatch = bcrypt.compareSync(enteredPassword, hashedPassword);

            if (isMatch) {
              resolve({ isMatch });
            } else {
              reject(new Error("Invalid credentials"));
            }
          }
        }
      );
    });
  } catch (error) {
    throw new Error("Internal server error: authentication");
  }
};

module.exports = authenticateUser;
