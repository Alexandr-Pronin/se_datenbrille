import { Response } from "express";
import { session } from "../index";
import Device from "../entities/device";
import Request from "../interfaces/request";
import { DeviceService } from "../services/deviceService";
/**
 * GET /devices
 * @returns device list
 */
export const getDevices = async (req: Request, res: Response) => {
  let devices: Device[] = await Device.find({ user_id: req.user.id });
  let object: {}[] = [];
  devices.map((device) => {
    object.push(device.toJSON());
  });
  res.json(object);
};

/**
 * POST /devices
 * Add a new device
 * @returns the new device object
 * @returns 400 Bad Request if device cannot be assigned to the user account, device name already
 * exists or devicecode has wrong length.
 */
export const registerDevice = async (req: Request, res: Response) => {
  Device.findOneOrFail({ user_id: req.user.id, approved: 0 })
    .then((device: Device) => {
      res.json(device.toJSON());
    })
    .catch(() => {
      Device.find({ user_id: req.user.id }).then((devices: Device[]) => {
        let devicename = "";
        for (let i = 0; i < 1000; i++) {
          if (devices.findIndex((d) => d.devicename === "Brille-" + i) === -1) {
            devicename = "Brille-" + i;
            break;
          }
        }
        let device: Device = DeviceService.generateNewDevice(devicename);
        device.user_id = req.user.id;
        device.save();
        res.json(device.toJSON());
      });
    });
};

/**
 * POST /devices/update/:devicecode
 * Update a device
 * @returns the new device object
 * @returns 400 Bad Request if device cannot be assigned to the user account or device name already
 * exists.
 */
export const updateDevice = async (req: Request, res: Response) => {
  let newName = req.body.devicename;
  let devicecode = req.params.devicecode;
  let newWorkee = req.body.workee;

  Device.findOneOrFail({ devicecode: devicecode, user_id: req.user.id })
    .then((device: Device) => {
      device.devicename = newName;
      device.workee = newWorkee;
      device.save();
      res.sendStatus(200);
    })
    .catch(() => {
      res.status(400).end();
    });
};

/**
 * DELETE /devices/:code
 * Delete a device
 * @returns 200 if successful
 * @returns 400 Bad Request if device cannot be deleted.
 */
export const removeDevice = async (req: Request, res: Response) => {
  let device = await Device.findOne({ devicecode: req.params.code });
  if (!device) {
    res.send(400);
    return;
  }
  await device.remove().then(() => {
    res.send(200);
  });
};

/**
 * Get device with devoce_code
 * @returns undefined if key not valid
 * @returns device if key valid
 */
export const getDeviceByCode = async (device_code: any) => {
  if (!device_code) return undefined;
  return await Device.findOne({ devicecode: device_code });
};

/**
 * @param devicecode device code
 */
export const getDevice = async (req: Request, res: Response) => {
  Device.findOneOrFail({ devicecode: req.params.devicecode })
    .then((device: Device) => {
      res.json(device.toJSON());
    })
    .catch(() => {
      res.status(404).end();
    });
};

/**
 * Called by glasses to approve them
 * @param devicecode device code
 */
export const approveDevice = async (req: Request, res: Response) => {
  Device.findOneOrFail({ devicecode: req.params.devicecode, approved: 0 })
    .then((device: Device) => {
      device.approved = 1;
      device.save();
      res.status(200).end();
    })
    .catch(() => {
      res.status(404).end();
    });
};
