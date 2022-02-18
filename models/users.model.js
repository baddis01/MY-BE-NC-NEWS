const db = require("../db/connection.js");

exports.selectAllUsernames = () => {
  return db
    .query(`SELECT username FROM users`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
};
