import { Protocol } from "../models/protocolModels/protocol";
import ProtocolTableEntry from "../models/protocolModels/protocolTableEntry";
import { ProtocolNumberEntry } from "../models/protocolModels/protocolNumberEntry";
import { ProtocolSelectEntry } from "../models/protocolModels/protocolSelectEntry";

/**
 * @param jsonProtocol JSON-Object of a protocol
 */
export class ProtocolParserV1 {
  private _json: any = {};
  constructor(jsonProtocol) {
    this._json = jsonProtocol;
  }

  /**
   * @returns Protocol object if the JSON-Object is valid and complete
   * @returns undefined if e.g. important fields are missing
   */
  public parse = (): Protocol | ParserError => {
    let errors: string[] = [];
    let json: any = this._json;
    let protocol: Protocol = new Protocol();
    if (!(json = json.protocol)) {
      errors.push("The root element of a protocol object must be 'protocol'");
    }
    try {
      if (
        (isNaN(Date.parse(json.metadata.completionDate)) ||
          (protocol.metadata.completionDate = new Date(
            Date.parse(json.metadata.completionDate)
          )) === undefined) &&
        json.metadata.completionDate !== null
      )
        throw "";
    } catch (e) {
      errors.push(
        "Missing field 'completionDate' in protocol.metadata, or wrong type. Type must be DATE."
      );
    }
    try {
      if ((protocol.metadata.creator = json.metadata.creator) === undefined)
        throw "";
    } catch (e) {
      errors.push("Missing field 'creator' in protocol.metadata");
    }
    try {
      if (
        (protocol.metadata.parserVersion = json.metadata.parserVersion) ===
        undefined
      )
        throw "";
      if (json.metadata.parserVersion !== "v1")
        errors.push(
          "WARNING: The protocol seems to be using another parser version: " +
            json.metadata.parserVersion
        );
    } catch (e) {
      errors.push("Missing field 'parserVersion' in protocol.metadata");
    }
    try {
      if (
        (isNaN(Date.parse(json.metadata.receiptDate)) ||
          (protocol.metadata.receiptDate = new Date(
            Date.parse(json.metadata.receiptDate)
          )) === undefined) &&
        json.metadata.receiptDate !== null
      )
        throw "";
    } catch (e) {
      errors.push(
        "Missing field 'receiptDate' in protocol.metadata, or wrong type. Type must be DATE."
      );
    }
    try {
      if (isNaN((protocol.metadata.version = json.metadata.version))) throw "";
    } catch (e) {
      errors.push("Missing field 'version' in protocol.metadata");
    }

    try {
      if (!(protocol.metadata.label = json.metadata.label)) throw "";
    } catch (e) {
      errors.push("Missing field 'label' in protocol.metadata");
    }

    try {
      json.entries.map((entry, index) => {
        if (entry.type === "number") {
          let e: ProtocolNumberEntry = new ProtocolNumberEntry();
          e.label = entry.label;
          e.type = entry.type;
          e.value = entry.value;
          e.config = {
            maxValue: entry.config.maxValue,
            minValue: entry.config.minValue,
          };
          e.validate();
          protocol.entries.push(e);
        } else if (entry.type === "select") {
          let e: ProtocolSelectEntry = new ProtocolSelectEntry();
          e.label = entry.label;
          e.type = entry.type;
          e.choices = entry.choices;
          e.possibleChoices = entry.possibleChoices;
          e.config = {
            maxChoices: entry.config.maxChoices,
            minChoices: entry.config.minChoices,
          };
          e.validate();
          protocol.entries.push(e);
        } else if (entry.type === "table") {
          let e: ProtocolTableEntry = new ProtocolTableEntry();
          e.label = entry.label;
          e.type = entry.type;
          e.zeilen = entry.zeilen;
          protocol.entries.push(e);
        } else {
          errors.push(`wrong content type in protocol.entries[${index}]`);
        }
      });
    } catch (e) {
      errors.push(
        "Missing or incorrect field 'protocol.entries' or its content."
      );
    }

    return errors.length > 0 ? new ParserError(errors) : protocol;
  };
}

export class ParserError {
  messages: string[] = [];
  constructor(errors) {
    this.messages = errors;
  }
}
