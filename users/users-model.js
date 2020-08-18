const db = require("../database/db-config");

module.exports = {
  get,
};

function get() {
  return db("users");
}
