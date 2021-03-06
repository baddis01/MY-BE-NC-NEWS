const db = require("../db/connection.js");

exports.selectAllCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
      LEFT JOIN articles ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      ORDER BY comments.comment_id;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: "No comments for this article id number",
        });
      } else {
        return rows;
      }
    });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments(article_id, author, body) VALUES ($1, $2, $3) RETURNING *;
    `,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1;
    `,
      [comment_id]
    )
    .then(({ rowCount, rows }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comment with this comment id number",
        });
      } else {
        return rows;
      }
    });
};
