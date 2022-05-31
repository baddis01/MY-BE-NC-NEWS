const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchAllEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`)
    .then((contents) => JSON.parse(contents));
};
