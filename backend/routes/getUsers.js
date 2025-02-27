const pool = require("../db/mealMinderModel");

const testUsers = {
  id: 1,
  username: "testuser1",
  email: "test@email.com",
};
//get all merchants our database
const getUsers = async () => {
  // try {
  //   return await new Promise(function (resolve, reject) {
  //     pool.query("SELECT * FROM users", (error, results) => {
  //       if (error) {
  //         reject(error);
  //       }
  //       if (results && results.rows) {
  //         resolve(results.rows);
  //       } else {
  //         reject(new Error("No results found"));
  //       }
  //     });
  //   });
  // } catch (error) {
  //   console.error(error);
  //   throw new Error("Internal server error");
  // }
  return testUsers;
};

module.exports = getUsers;
