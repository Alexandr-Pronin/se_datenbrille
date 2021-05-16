import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createConnection, Connection } from "typeorm";
import { Response } from "express";
import path from "path";

// Custom imports
import Request from "./interfaces/request";
import Session from "./session";
import auth from "./auth";

// Controllers
import * as UserController from "./controllers/userController";
import * as PdfController from "./controllers/pdfController";
import * as DeviceController from "./controllers/deviceController";

const app = express();
const PORT = process.env.PORT || 3001;

// enable cors for every route
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const session = new Session();
session.init();
session.mock("test");

let connection: Connection;
createConnection()
  .then(async (conn) => {
    connection = conn;
    app.listen(PORT, () => {
      console.log("Backend listening on PORT " + PORT);
    });
  })
  .catch((error) => console.log(error));

let onlyUser = () => {
  return function (req: Request, res: Response, next: any) {
    if (session.get(req.headers.session_key)) next();
    else res.send(403);
  };
};

//only for pdf testing in browser (BEFORE auth middleware)
//app.get("/templatetopdf", PdfController.testTemplateToPdf);

/**
 * Login/Session handling BEFORE auth middleware
 */
app.get("/web/checksession", UserController.checkSession);
app.get("/web/login", UserController.attemptLogin);

app.post("/approvedevice/:devicecode", DeviceController.approveDevice);

/**
 * Auth middleware
 */
app.use(auth);

app.use("/web", require("./routes/web-routes"));
app.use("/glasses", require("./routes/glasses-routes"));
app.use(require("./routes/dev-routes"));

export { connection, session, onlyUser, app };
