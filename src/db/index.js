const Sequelize = require("sequelize");

const initModels = require("./models");

const db = new Sequelize("database", "postgres", "root", {
  host: "35.223.66.192",
  dialect: "postgres",
});

initModels(db);

module.exports = db;
