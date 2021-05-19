export class ProtocolEntry {
  label: string = "";
  type: "number" | "select" | "table" | null = null;
  private _isValid: boolean = true;
  protected setValid(valid: boolean): void {
    this._isValid = valid;
  }
  protected setType(type: "number" | "select" | "table") {
    this.type = type;
  }
  public isValid = () => {
    return this._isValid;
  };
}
