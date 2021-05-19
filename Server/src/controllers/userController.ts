import { Request, Response } from "express";
import { session } from "../index";
import crypto from "crypto";
import atob from "atob";
import User from "../entities/user";
/**
 * GET /user/checksession
 * Check if session is valid
 */
export const checkSession = async (req: Request, res: Response) => {
  if (!session.get(req.headers.session_key)) {
    res.status(401).end();
  } else {
    res.status(200).end();
  }
};

export const attemptLogin = async (req: Request, res: Response) => {
  //Basic KAJHDSOUGBAWL==
  //nutzername:password
  var auth = atob(req.headers.authorization.split("Basic ")[1]).split(":");
  if (auth.length != 2) {
    res.status(405).end();
    return;
  }
  let email = auth[0];
  let password = auth[1];

  let hashedPw = crypto.createHash("sha256").update(password).digest("hex");
  User.findOneOrFail({ email: email, password: hashedPw })
    .then((user: User) => {
      let key = session.create(user);
      res.json({ session_key: key, user: user.toJSON() });
    })
    .catch(() => {
      res.status(401).end();
    });
};
