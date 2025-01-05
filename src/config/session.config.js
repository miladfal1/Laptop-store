const session = require("express-session");

const sessionConfig = session({
  secret: process.env.SECRET_KEY,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
});

module.exports = sessionConfig;
