import { Response } from "express";
import Request from "../interfaces/request";
import Label from "../entities/label";
/**
 * POST /web/labels
 * save all labels
 * @returns 200
 */
export const postLabels = async (req: Request, res: Response) => {
  Label.delete({ user_id: req.user.id }).then(() => {
    let labels = req.body;
    labels.forEach((l: Label) => {
      let label: Label = new Label();
      label.name = l.name;
      label.details = l.details;
      label.user_id = req.user.id;
      label.color = l.color;
      label.save();
    });
    res.sendStatus(200);
  });
};

/**
 * GET /web/labels
 * get all labels
 * @returns label[]
 */
export const getLabels = async (req: Request, res: Response) => {
  Label.find({ user_id: req.user.id }).then((labels: Label[]) => {
    let obj: any = [];
    labels.forEach((label: Label) => {
      obj.push(label.toJSON());
    });
    res.json(obj);
  });
};
