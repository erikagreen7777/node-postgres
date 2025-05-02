const pool = require("../../db/mealMinderModel");
const bcrypt = require("bcrypt");

// TODO: finish hooking it up

const saveInventory = async (body) => {
  try {
    return await new Promise(function (resolve, reject) {
      const { firstName, lastName, email, password } = body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      pool.query(
        "INSERT INTO products (name, product_quantity, carbohydrates_serving, calcium_serving) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, hashedPassword],
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
