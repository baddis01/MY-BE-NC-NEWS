const express = require("express");
const { getArticleById } = require("./controllers/articles.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
