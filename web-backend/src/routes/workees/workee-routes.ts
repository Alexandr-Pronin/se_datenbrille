import { onlyUser } from "../../index";
import * as WorkeeController from "../../controllers/workeeController";
const router = require("express").Router();

/**
 * @api {get} /web/workees
 * @apiName GetWorkees
 * @apiGroup Workees
 * @apiVersion 0.1.0
 * @apiDescription Get all workees
 */
router.get("/", WorkeeController.list);

/**
 * @api {delete} /web/workees/:id
 * @apiParam {id} workee id
 * @apiName DeleteWorkee
 * @apiGroup Workees
 * @apiVersion 0.1.0
 * @apiDescription Delete a workee
 */
router.delete("/:id", onlyUser(), WorkeeController.remove);

/**
 * @api {post} /web/workees
 * @apiName AddWorkee
 * @apiParam {name} workee name
 * @apiGroup Workees
 * @apiVersion 0.1.0
 * @apiDescription Add a workee
 */
router.post("/", onlyUser(), WorkeeController.add);

module.exports = router;
