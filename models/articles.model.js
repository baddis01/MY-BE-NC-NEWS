const db = require("../db/connection.js");

exports.selectAllArticles = (sort_by, order, topic) => {
  let field = "articles.created_at";
  const artFields = ["article_id", "title", "topic", "author", "body", "votes"];

  if (artFields.includes(sort_by)) {
    field = `articles.${sort_by}`;
  } else if (sort_by === "comment_count") {
    field = "comment_count";
  }

  const direction =
    typeof order !== "boolean" || order === true ? " DESC" : " ASC";

  const topicCheck = typeof topic === "string";

  return db
    .query(
      `
    WITH cte_comment_count AS (
    SELECT comments.article_id, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY comments.article_id)
    
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
    CASE 
      WHEN cte_comment_count.comment_count IS NULL 
      THEN 0 
      ELSE 
      CAST(cte_comment_count.comment_count AS INTEGER) 
    END AS comment_count
    FROM articles
    LEFT JOIN cte_comment_count ON cte_comment_count.article_id = articles.article_id
    ${topicCheck ? "WHERE articles.topic = $1" : ""}
    ORDER BY ${field + direction};
    `,
      topicCheck ? [topic] : []
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

    SELECT articles.*, 
    CASE 
      WHEN cte_comment_count.comment_count IS NULL 
      THEN 0 
      ELSE 
      CAST(cte_comment_count.comment_count AS INTEGER) 
    END AS comment_count
    FROM articles
    LEFT JOIN cte_comment_count ON cte_comment_count.article_id = articles.article_id
    WHERE articles.article_id = $1;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: "No article with this article id number",
        });
      } else return rows[0];
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
      .then(({ rows }) => {
        if (rows.length < 1) {
          return Promise.reject({
            status: 404,
            msg: "No article with this article id number",
          });
        } else return rows[0];
      });
};
