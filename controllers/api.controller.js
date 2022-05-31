const { fetchAllEndpoints } = require("../models/api.models");

exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndpoints()
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      next(err);
    });
};
