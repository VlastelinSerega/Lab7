const { Model, DataTypes } = require("sequelize");
const uuid = require("uuid");

class Group extends Model {}

exports.initGroup = (sequelize) => {
  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid.v1(),
      },
      name: {
        type: DataTypes.STRING(30),
      },
    },
    { sequelize, modelName: "group", timestamps: false }
  );
};

exports.default = Group;
