const express = require("express");
const server = express();
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const helmet = require("helmet");
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const dbConnection = require("./database/db-config.js");
const protected = require("./auth/protected-mw.js");

const sessionConfiguration = {
  name: "monster",
  secret: "keep it secreter, keep it safer!",
  cookie: {
    maxAge: 1000 * 60 * 10, // after 10 mins the cookie expires
    secure: process.env.COOKIE_SECURE || false, // if true cookie is only sent over https
    httpOnly: true, // JS cannot touch this cookie
  },
  resave: false,
  saveUninitialized: true, // GDPR Compliance, the client should drive this
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60, // delete expired sessions every hour
  }),
};

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfiguration));

server.use("/api/auth", authRouter);
server.use("/api/users", protected, usersRouter);

server.get("/", (req, res) =>
  res.send(`The API works, just access the recources at '/api/'...`)
);

module.exports = server;
