const { initGroup, default: Group } = require('./group');
const { initStudent, default: Student } = require('./student');

const initRelation = () => {
  Group.hasMany(Student, { foreignKey: 'groupId', onDelete: 'CASCADE' });
  Student.belongsTo(Group);
}

module.exports = (sequelize) => {
  initGroup(sequelize);
  initStudent(sequelize);
  initRelation();
}
