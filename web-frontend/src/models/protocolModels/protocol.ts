import { ProtocolMetaData } from "./protocolMetaData";
import { ProtocolEntry } from "./protocolEntry";
import { Label } from "../label";

export class Protocol {
  entries: ProtocolEntry[] = [];
  metadata: ProtocolMetaData = new ProtocolMetaData();
  id: number = -1;
  archived: boolean = false;

  labels: Label[] = [];

  isValid = (): boolean => {
    let valid = true;
    this.entries.map((entry) => {
      if (!entry.isValid()) valid = false;
      return entry;
    });
    return valid;
  };

  toJSON() {
    return {
      entries: this.entries,
      metadata: this.metadata,
    };
  }
}
