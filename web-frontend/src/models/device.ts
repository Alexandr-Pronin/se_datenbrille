import { Workee } from "./workee";

export class Device {
  devicename: string = "";
  devicecode: string = "";
  workee: Workee | undefined = undefined;
  borrowDate: Date | undefined = undefined;
  lastsync: Date | undefined = undefined;

  asTableData = () => {
    return {
      name: this.devicename,
      workee: this.workee?.id || undefined,
      lastsync: this.lastsync,
    };
  };
}

export class DeviceBuilder {
  device: Device = new Device();
  setName = (name) => {
    this.device.devicename = name;
    return this;
  };
  setCode = (code) => {
    this.device.devicecode = code;
    return this;
  };
  build = () => {
    return this.device;
  };
}
