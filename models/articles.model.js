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
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    WITH cte_comment_count AS (
    SELECT comments.article_id, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY comments.article_id)
    
    SELECT articles.*, CAST(cte_comment_count.comment_count AS INTEGER) FROM articles
    LEFT JOIN cte_comment_count ON cte_comment_count.article_id = articles.article_id
    WHERE articles.article_id = $1;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: "No article with this article id number",
        });
      } else {
        console.log(result.rows[0]);
        return result.rows[0];
      }
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
