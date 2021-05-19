import Device from "../entities/device";
import { v4 as uuid } from "uuid";

export class DeviceService {
  /**
   * Generates a new device
   * @returns Device
   */
  public static generateNewDevice = (devicename: string): Device => {
    let device = new Device();
    device.devicecode = DeviceService.generateCode();
    device.devicename = devicename;
    device.approved = 0;
    return device;
  };

  private static generateCode = () => {
    return uuid().split("-").join("");
  };
}
