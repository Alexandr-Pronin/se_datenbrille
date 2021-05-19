import { Response } from "express";
import Request from "../interfaces/request";
import { connection, session } from "../index";
import Protocol from "../entities/protocol";
import Template from "../entities/template";

export const listNew = async (req: Request, res: Response) => {
  let newProtocols: Protocol[] = await Protocol.find({
    user_id: req.user.id,
    archived: 0,
  });
  let object: Object[] = [];
  newProtocols.map((protocol) => {
    object.push(protocol.toJSON());
  });
  res.json(object);
};

export const countArchived = async (req: Request, res: Response) => {
  let archivedProtocolsCount = await connection
    .getRepository(Protocol)
    .createQueryBuilder()
    .where({ user_id: req.user.id, archived: true })
    .getCount();
  res.json({ count: archivedProtocolsCount });
};

export const listArchived = async (req: Request, res: Response) => {
  if (isNaN(Number(req.params.from)) || isNaN(Number(req.params.amount))) {
    res.status(400).send("Params must be numbers");
    return;
  }
  let object: {}[] = [];
  await connection
    .getRepository(Protocol)
    .createQueryBuilder()
    .where({ user_id: req.user.id, archived: true })
    .offset(Number(req.params.from))
    .limit(Number(req.params.amount))
    .getMany()
    .then((protocols: Protocol[]) => {
      protocols.map((protocol) => {
        object.push(protocol.toJSON());
      });
      res.json(object);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400).end();
    });
};

export const archiveProtocol = async (req: Request, res: Response) => {
  let protocol: Protocol = await Protocol.findOne({
    user_id: req.user.id,
    id: Number(req.params.id),
  });
  if (!protocol) {
    res.sendStatus(400).end();
    return;
  }
  protocol.archived = 1;
  await protocol.save();
  res.sendStatus(200);
};

export const addProtocol = async (req: Request, res: Response) => {
  let req_protocol = req.body.protocol;
  if (!req_protocol) {
    res.sendStatus(400);
    return;
  }
  let protocol: Protocol = new Protocol();
  protocol.value = req_protocol;
  protocol.user_id = req.user.id;
  protocol.archived = 0;
  protocol
    .save()
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

export const saveOrCreateTemplate = async (req: Request, res: Response) => {
  let req_template_id = req.body.id || -1;
  let req_protocol = req.body.protocol;
  let template =
    req_template_id !== -1
      ? await Template.findOne({ id: req_template_id })
      : undefined;
  //console.log(template);
  //Create new template
  if (!template) {
    template = new Template();
    template.value = req_protocol;
    template.user_id = req.user.id;
    await connection.manager.save(template).then((new_template) => {
      res.json({
        protocol: new_template.value,
        id: new_template.id,
        createdAt: new_template.createdAt,
      });
    });
  } else {
    //Update existing template
    template.value = req_protocol;
    await template.save().then((new_template) => {
      res.json({
        protocol: new_template.value,
        id: new_template.id,
        createdAt: new_template.createdAt,
      });
    });
  }
};

export const deleteTemplate = (req: Request, res: Response) => {
  let template_id = Number(req.params.id);
  let user_id = req.user.id;
  Template.delete({ user_id: user_id, id: template_id })
    .then(() => {
      res.sendStatus(200).end();
    })
    .catch((error) => {
      res.sendStatus(404).end();
    });
};

export const deleteProtocol = (req: Request, res: Response) => {
  let protocol_id = Number(req.params.id);
  let user_id = req.user.id;
  Protocol.findOneOrFail({ user_id: user_id, id: protocol_id })
    .then(() => {
      Protocol.delete({ user_id: user_id, id: protocol_id })
        .then(() => {
          res.sendStatus(200).end();
        })
        .catch((error) => {
          res.sendStatus(500).end();
        });
    })
    .catch(() => {
      res.sendStatus(404).end();
    });
};

export const deleteMultipleProtocols = (req: Request, res: Response) => {
  let protocol_ids: number[] = [];
  req.body.ids.forEach((id: any) => {
    protocol_ids.push(Number(id));
  });

  let user_id = req.user.id;

  connection
    .createQueryBuilder()
    .delete()
    .from(Protocol)
    .where({ user_id: user_id })
    .andWhere("protocol.id IN (:...ids)", { ids: protocol_ids })
    .execute()
    .then(() => {
      res.sendStatus(200).end();
    })
    .catch(() => {
      res.sendStatus(500).end();
    });
};

/**
 * GET /protocols/templates
 * Get list with protocol templates
 */
export const getAllProtocolTemplates = async (req: Request, res: Response) => {
  await Template.find({
    user_id: req.user.id,
  })
    .then((templates: Template[]) => {
      let obj: Object[] = [];
      templates.map((template) => {
        obj.push({
          protocol: template.value,
          id: template.id,
          createdAt: template.createdAt,
        });
      });
      res.json(obj);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
};
