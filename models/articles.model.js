const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles 
    WHERE article_id = $1;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: "No article with this article id number",
        });
      } else return result.rows[0];
    });
};
