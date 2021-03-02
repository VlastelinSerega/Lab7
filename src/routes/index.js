const studentRoutes = require("./students");
const groupRoutes = require("./groups");

module.exports = (app) => {
  app.use("/students", studentRoutes);
  app.use("/groups", groupRoutes);
};
