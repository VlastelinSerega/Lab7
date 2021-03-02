const Router = require("express").Router;

const Student = require("../db/models/group").default;
const Group = require("../db/models/group").default;

const groupRoutes = Router();

groupRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.statusCode = 400;
    return res.end("ID is required");
  }

  const group = await Group.findByPk(id);

  if (!group) {
    res.statusCode = 400;
    return res.end(`Group with id: ${id} was not found`);
  }

  await Group.destroy({
    where: {
      id,
    },
  });

  res.statusCode = 200;
  return res.json({
    group: group.toJSON(),
  });
});

groupRoutes.post("/", async (req, res) => {
  if (!req.body) {
    res.statusCode = 400;
    return res.end("Body is required");
  }

  const { name } = req.body;

  if (!name) {
    res.statusCode = 400;
    return res.end("Args are invalid");
  }

  const existingGroup = await Group.findOne({
    where: { name: name },
    raw: true,
  });

  if (existingGroup) {
    res.end("this group is already exists");
  } else {
    const createdGroup = await Group.create({ name });

    if (!createdGroup) {
      res.statusCode = 400;
      return res.end("Cannot create a group");
    }
    res.statusCode = 200;
    res.json({
      ...createdGroup.toJSON(),
    });
  }
});

groupRoutes.get("/:id?", async (req, res) => {
  const { id } = req.params;

  if (id) {
    const group = await Group.findOne({ where: { id } });

    if (!group) {
      res.statusCode = 404;
      return res.end(`Group with id: ${id} was not found`);
    }

    res.statusCode = 200;
    return res.json({
      group: group.toJSON(),
    });
  } else {
    let groups = await Group.findAll();

    if (!groups) {
      res.statusCode = 400;
      return res.end("No groups found");
    }

    groups = groups.map((group) => group.toJSON());

    res.statusCode = 200;
    return res.json({
      groups,
    });
  }
});

module.exports = groupRoutes;
