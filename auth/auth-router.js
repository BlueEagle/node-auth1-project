const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Users = require("./auth-model");

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, rounds);
  Users.add({ username, password: hash })
    .then((user) => {
      res.status(201).json({ user }).end();
    })
    .catch((error) => res.status(500).json({ error }).end());
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username }).then((users) => {
    const user = users[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.loggedIn = user.username;
      res
        .status(200)
        .json({
          loggedIn: user.username,
          cookie: req.session.cookie,
        })
        .end();
    } else {
      res.status(401).json({ error: "You shall not pass!" }).end();
    }
  });
});

module.exports = router;
