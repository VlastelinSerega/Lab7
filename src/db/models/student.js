const { Model, DataTypes } = require("sequelize");
const uuid = require("uuid");

class Student extends Model {}

exports.initStudent = (sequelize) => {
  Student.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid.v1(),
      },
      firstName: {
        type: DataTypes.STRING(30),
      },
      lastName: {
        type: DataTypes.STRING(30),
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { sequelize, modelName: "student", timestamps: true }
  );
};

exports.default = Student;
