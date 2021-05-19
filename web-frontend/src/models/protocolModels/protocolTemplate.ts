import { Protocol } from "./protocol";
import { ProtocolParserV1, ParserError } from "../../parser/protocolParserV1";

export class ProtocolTemplate {
  protocol: Protocol = new Protocol();
  createdAt: Date | undefined = undefined;
  id: number | undefined = undefined;

  toJSON = () => {
    let json = {};
    json["protocol"] = this.protocol;
    this.createdAt && (json["createdAt"] = this.createdAt);
    this.id && (json["id"] = this.id);
    return json;
  };

  public static fromJSON = (obj): ProtocolTemplate => {
    let protocol = new ProtocolParserV1({ protocol: obj.protocol }).parse();
    if (protocol instanceof ParserError) return new ProtocolTemplate();
    let template = new ProtocolTemplate();
    template.createdAt = obj.createdAt;
    template.protocol = protocol;
    template.id = obj.id;
    return template;
  };
}
