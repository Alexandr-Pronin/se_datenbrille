import { Response } from "express";
import Request from "../interfaces/request";
const router = require('express').Router();

import * as MockController from "../controllers/mock";
import {app} from "../index";

router.get("/api/mock", MockController.index);

// catch 404 and forward to error handler
// note this is after all good routes and is not an error handler
// to get a 404, it has to fall through to this route - no error involved
router.use((req: Request, res: Response, next: any) => {
  const err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers - these take err object.
// these are per request error handlers.  They have two so in dev
// you get a full stack trace.  In prod, first is never setup

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  router.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: "Check your request.",
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
router.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: "Check your request.",
    },
  });
});

module.exports = router;