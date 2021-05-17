export class ProtocolMetaData {
  creator: string = "";
  parserVersion: string = "v1";
  version: number = 0;
  template?: number = undefined; //Tempalte id
  completionDate: Date | null = null;
  receiptDate: Date | null = null;
  label: string = "Neues Protokoll";
}
