const express = require("express");
const { getArticleById } = require("./controllers/articles.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
