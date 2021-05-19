import { Response } from "express";
import Request from "./interfaces/request";
import { session } from "./index";
import User from "./entities/user";
import * as DeviceController from "./controllers/deviceController";
import Device from "./entities/device";

/**
 * fills req.user
 * @param req
 * @param res
 * @param next
 */
const auth = async (req: Request, res: Response, next: any) => {
  if (session.get(req.headers.session_key)) {
    await User.findOne({ id: session.get(req.headers.session_key).userid })
      .then((user) => {
        req.user = user;
        let key: any = req.headers.session_key;
        session.refresh(key);
      })
      .catch(() => {
        res.send(500).end();
      });
    next();
  } else {
    //Check if device_key is set and valid
    let device: Device = await DeviceController.getDeviceByCode(
      req.headers.device_code
    );
    if (!!device) {
      req.user = await User.findOne({ id: device.user_id });
      next();
    } else res.status(401).end();
  }
};

export default auth;
