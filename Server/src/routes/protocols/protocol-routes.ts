import { onlyUser } from "../../index";
import * as ProtocolController from "../../controllers/protocolController";
const router = require("express").Router();

/**
 * @api {get} /web/protocols/new
 * @apiName GetProtocolsNew
 * @apiGroup Protocols
 * @apiVersion 0.1.0
 * @apiSuccess {Object[]} protocols Array of the new protocols.
 * @apiSuccess {String} protocols.version Version of this protocol in regards to the template.
 * @apiDescription Used to get new protocols since last synchronisation cycle.
 */
router.get("/new", onlyUser(), ProtocolController.listNew);

/**
 * @api {post} /web/protocols/new
 * @apiName AddProtocol
 * @apiGroup Protocols
 * @apiVersion 0.1.0
 * @apiDescription Used by the data glass to save a single new protocol
 */
router.post("/new", ProtocolController.addProtocol);

/**
 * @api {delete} /web/protocols/delete/:id
 * @apiName DeleteProtocol
 * @apiGroup Protocols
 * @apiParam {Number} ID of protocol to delete.
 * @apiVersion 0.1.0
 * @apiDescription Used to delete a single protocol by its id.
 */
router.delete("/delete/:id", ProtocolController.deleteProtocol);

/**
 * @api {post} /web/protocols/delete
 * @apiName DeleteMultipleProtocols
 * @apiGroup Protocols
 * @apiVersion 0.1.0
 * @apiDescription Used to delete a list of protocols by their ids.
 */
router.post("/delete", ProtocolController.deleteMultipleProtocols);

/**
 * @api {get} /web/protocols/archive/:id
 * @apiName ArchiveProtocol
 * @apiGroup Protocols
 * @apiParam {Number} ID of protocol to archive.
 * @apiVersion 0.1.0
 * @apiDescription Used to archive a protocol.
 */
router.get("/archive/:id", ProtocolController.archiveProtocol);

/**
 * @api {get} /web/protocols/archived/count
 * @apiName GetProtocolsArchivedCount
 * @apiGroup Protocols
 * @apiVersion 0.1.0
 * @apiSuccess {Number} count Number of archived protocols.
 * @apiDescription Used to get amount of archived protocols for logged in user.
 */
router.get("/archived/count", onlyUser(), ProtocolController.countArchived);

/**
 * @api {get} /web/protocols/archived/:from/:amount
 * @apiName GetArchivedProcolsFromAmount
 * @apiGroup Protocols
 * @apiParam {Number} from  start index of archived protocols to get.
 * @apiParam {Number} amount  Amount of archived protcols to get.
 * @apiVersion 0.1.0
 * @apiDescription Used to get archived protocols with limit and offset.
 */
router.get(
  "/archived/:from/:amount",
  onlyUser(),
  ProtocolController.listArchived
);

router.use("/templates", require("./template-routes"));

module.exports = router;
