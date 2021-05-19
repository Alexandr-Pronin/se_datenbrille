import { Response } from "express";
import Request from "../interfaces/request";
import Workee from "../entities/workee";

export const list = async (req: Request, res: Response) => {
  Workee.find({
    user_id: Number(req.user.id),
  })
    .then((workees: Workee[]) => {
      res.json(workees);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};

export const remove = async (req: Request, res: Response) => {
  Workee.delete({
    user_id: Number(req.user.id),
    id: Number(req.params.id),
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};

export const add = async (req: Request, res: Response) => {
  let name: string = req.body.name;
  if (name.trim().length === 0) {
    res.sendStatus(400);
    return;
  }
  let workee: Workee = new Workee();
  workee.user_id = req.user.id;
  workee.name = name;
  workee
    .save()
    .then((newworkee: Workee) => {
      res.json({ id: newworkee.id });
    })
    .catch(() => {
      res.sendStatus(500);
    });
};
