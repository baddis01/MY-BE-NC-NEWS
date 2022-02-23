const { selectAllUsernames } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  selectAllUsernames()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
