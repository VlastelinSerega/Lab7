const Router = require('express').Router;

const Student = require('../db/models/student').default;
const Group = require('../db/models/group').default;

const studentRoutes = Router();

studentRoutes.post('/', async (req, res) => {
  if (!req.body) {
    res.statusCode = 400;
    return res.end('Body is required');
  }

  const { firstName, lastName, group } = req.body;

  if (!firstName || !lastName || !group) {
    res.statusCode = 400;
    return res.end('Args are invalid');
  }

  const createdStudent = await Student.create({ firstName, lastName });

  if (!createdStudent) {
    res.statusCode = 400;
    return res.end('Cannot create a student');
  }

  const existingGroup = await Group.findOne({ where: { name: group }, raw: true });

  if (existingGroup) {
    await createdStudent.setGroup(existingGroup.id);
  } else {
    await createdStudent.createGroup({ name: group })
  }

  res.statusCode = 200;
  res.json({
    student: {
      ...(createdStudent.toJSON()),
      group: (await createdStudent.getGroup()).toJSON()
    }
  })  
});

studentRoutes.get('/:id?', async (req, res) => {
  const { id } = req.params;
  
  if (id) {
    const student = await Student.findOne({ where: { id }, include: Group });
    
    if (!student) {
      res.statusCode = 404;
      return res.end(`Student with id: ${id} was not found`);
    }
    
    res.statusCode = 200;
    return res.json({
      student: student.toJSON(),
    })
  } else {
    let students = await Student.findAll({ include: Group });

    if (!students) {
      res.statusCode = 400;
      return res.end('No students found');
    }

    students = students.map(student => student.toJSON());

    res.statusCode = 200;
    return res.json({
      students,
    })
  }
})

studentRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.statusCode = 400;
    return res.end('ID is required');
  }

  const student = await Student.findByPk(id);
  
  if (!student) {
    res.statusCode = 400;
    return res.end(`Student with id: ${id} was not found`);
  }

  await Student.destroy({
    where: {
      id
    }
  });

  res.statusCode = 200;
  return res.json({
    student: student.toJSON()
  });
});

studentRoutes.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.statusCode = 400;
    return res.end('ID is required');
  }

  const { firstName, lastName, group } = req.body;

  if (!firstName && !lastName && !group) {
    res.statusCode = 200;
    const student = await Student.findByPk(id);

    return res.json({
      student: student.toJSON()
    })
  }

  await Student.update({ firstName, lastName }, { where: { id } });

  const student = await Student.findByPk(id);

  if (!student) {
    res.statusCode = 400;
    return res.end('Student was not found');
  }

  if (group) {
    const existingGroup = await Group.findOne({ where: { name: group } });

    if (existingGroup) {
      await student.setGroup(existingGroup.id);
    } else {
      await student.createGroup({ name: group });
    }
  };

  res.statusCode = 200;
  return res.json({
    student: {
      ...(student.toJSON()),
      group: (await student.getGroup()).toJSON(),
    }
  })
})

module.exports = studentRoutes;