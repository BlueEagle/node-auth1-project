const db = require("../database/db-config");

module.exports = {
  find,
  findBy,
  findById,
  add,
};

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}

function findById(id) {
  return db("users").where({ id }).first();
}

async function add(user) {
  return db("users")
    .insert(user)
    .then((id) => {
      return findById(id);
    })
    .catch((error) => `Error: ${error}`);
}
