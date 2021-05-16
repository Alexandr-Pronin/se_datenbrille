import { Device } from "./device";
import { Workee } from "./workee";
import { Protocols } from "./protocolModels/protocols";

export class User {
  devices: Device[] = [];
  workees: Workee[] = [];
  email: string = "";
  unternehmen: string = "";
  vorname: string = "";
  nachname: string = "";
  protocols: Protocols = new Protocols();

  get name() {
    return `${this.vorname} ${this.nachname}`;
  }
}

export class UserBuilder {
  user: User = new User();
  setVorname = (val) => {
    this.user.vorname = val;
    return this;
  };

  setNachname = (val) => {
    this.user.nachname = val;
    return this;
  };

  setEmail = (val) => {
    this.user.email = val;
    return this;
  };

  setUnternehmen = (val) => {
    this.user.unternehmen = val;
    return this;
  };

  setDevices = (devices: Device[]) => {
    this.user.devices = devices;
    return this;
  };

  setWorkees = (workees: Workee[]) => {
    this.user.workees = workees;
    return this;
  };

  build = () => {
    return this.user;
  };
}
