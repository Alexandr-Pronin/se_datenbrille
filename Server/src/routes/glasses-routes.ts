
import * as ProtocolController from "../controllers/protocolController";
const router = require('express').Router();

/**
 * @api {get} /glasses/templates
 * @apiName GetAllProtcolTemplates
 * @apiGroup Glasses Templates
 * @apiVersion 0.1.0
 * @apiDescription Get all protocol Templates
 */
router.get("/templates", ProtocolController.getAllProtocolTemplates);

module.exports = router;