const db = require("../db/connection.js");

exports.selectAllArticles = () => {
  return db
    .query(
      `
    SELECT author, title, article_id, topic, created_at, votes FROM articles
    ORDER BY created_at DESC;
    `
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

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

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request - Missing/Incorrect Fields",
    });
  } else
    return db
      .query(
        `
    UPDATE articles
    SET
      votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
        [inc_votes, article_id]
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
