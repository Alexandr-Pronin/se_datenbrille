import { ProtocolEntry } from "./protocolEntry";
import { ProtocolSelectEntry } from "./protocolSelectEntry";
import { ProtocolNumberEntry } from "./protocolNumberEntry";

export default class ProtocolTableEntry extends ProtocolEntry {
  constructor() {
    super();
    this.setType("table");
  }
  zeilen: Zeile[] = [];
  config: ProtocolTableEntryConfig = new ProtocolTableEntryConfig();

  toJSON() {
    return {
      label: this.label,
      type: this.type,
      zeilen: this.zeilen,
      config: this.config,
    };
  }
}

export class Zeile {
  header?: boolean;
  spalten: Spalte[] = [new Spalte()];
}

export class Spalte {
  zeilen?: Zeile[];
  content?: ProtocolNumberEntry | ProtocolSelectEntry | string;
}

/**
 * === Configs ===
 * If limitations are not met,
 * the protocol will be marked as not valid
 */
class ProtocolTableEntryConfig {
  //TODO
}
