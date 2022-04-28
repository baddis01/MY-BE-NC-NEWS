const express = require("express");
const {
  getArticleById,
  patchArticleVotes,
  getAllArticles,
} = require("./controllers/articles.controller");
const {
  getAllCommentsByArticleId,
  addCommentByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/comments.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require("./controllers/errors.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const { getAllUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.post("/api/articles/:article_id/comments", addCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/topics", getAllTopics);

app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
