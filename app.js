const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
