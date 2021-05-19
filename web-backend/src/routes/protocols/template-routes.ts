import { onlyUser } from "../../index";
import * as ProtocolController from "../../controllers/protocolController";
const router = require("express").Router();

/**
 * @api {get} /web/protocols/templates/
 * @apiName GetAllProtcolTemplates
 * @apiGroup Protocol Templates
 * @apiVersion 0.1.0
 * @apiDescription Get all protocol Templates. Used by both glasses and
 */
router.get("/", ProtocolController.getAllProtocolTemplates);

/**
 * @api {post} /web/protocols/templates/
 * @apiName PostProtcolTemplate
 * @apiGroup Protocol Templates
 * @apiVersion 0.1.0
 * @apiDescription Save or create protcol template.
 */
router.post("/", onlyUser(), ProtocolController.saveOrCreateTemplate);

/**
 * @api {delete} /web/protocols/templates/:id
 * @apiName DeleteProtcolTemplate
 * @apiParam {Number} id Protocol to delete by id.
 * @apiGroup Protocol Templates
 * @apiVersion 0.1.0
 * @apiDescription Delete protcol template by id.
 */
router.delete("/:id", ProtocolController.deleteTemplate);

module.exports = router;
