import { onlyUser } from "../../index";
import * as DeviceController from "../../controllers/deviceController";
const router = require("express").Router();

/**
 * @api {get} web/devices/
 * @apiName GetDevices
 * @apiGroup Devices
 * @apiVersion 0.1.0
 * @apiDescription Get all devices.
 */
router.get("/", onlyUser(), DeviceController.getDevices);
/**
 * @api {post} web/devices/register
 * @apiName PostDevices
 * @apiGroup Devices
 * @apiVersion 0.1.0
 * @ApiSuccess {Object} device new created device object
 * @apiDescription Register a new device
 */
router.post("/register", onlyUser(), DeviceController.registerDevice);
/**
 * @api {delete} web/devices/:code
 * @apiName DeleteDevices
 * @apiGroup Devices
 * @apiVersion 0.1.0
 * @apiDescription Delete device by code/id.
 */
router.delete("/:code", onlyUser(), DeviceController.removeDevice);

/**
 * @api {get} web/devices/:devicecode
 * @apiName GetDevice
 * @apiGroup Devices
 * @apiVersion 0.1.0
 * @apiDescription Get device by devicecode.
 */
router.get("/:devicecode", onlyUser(), DeviceController.getDevice);

/**
 * @api {post} /update/:devicecode
 * @apiParam {String} devicename name of the device
 * @apiParam {Number} workee id of the workee
 * @apiName UpdateDevices
 * @apiGroup Devices
 * @apiVersion 0.1.0
 * @apiDescription Update device by devicecode
 */
router.post("/update/:devicecode", onlyUser(), DeviceController.updateDevice);

module.exports = router;
