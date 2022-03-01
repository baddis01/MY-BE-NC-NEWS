const express = require("express");
const {
  getArticleById,
  patchArticleVotes,
  getAllArticles,
} = require("./controllers/articles.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require("./controllers/errors.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const { getAllUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
