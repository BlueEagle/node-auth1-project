const express = require("express");
const router = express.Router();
const Users = require("./users-model");

router.get("/", (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json({ users }).end();
    })
    .catch((error) => res.status(500).json({ error }).end());
});

module.exports = router;
