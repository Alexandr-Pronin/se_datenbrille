import { ProtocolEntry } from "./protocolEntry";

export class ProtocolNumberEntry extends ProtocolEntry {
  constructor() {
    super();
    this.setType("number");
  }
  value: number | null = null;
  config: ProtocolNumberEntryConfig = new ProtocolNumberEntryConfig();

  public validate = () => {
    super.setValid(this.checkValid());
    super.setType("number");
    return this.isValid();
  };

  private checkValid = () => {
    /**
     * Check if limitations of min and max values are met
     */
    if (this.value === null) return false;
    if (this.config.maxValue === null && this.config.minValue === null)
      return true;
    if (this.config.minValue !== null && this.value < this.config.minValue)
      return false;
    if (this.config.maxValue !== null && this.value > this.config.maxValue)
      return false;
    return true;
  };

  toJSON() {
    return {
      label: this.label,
      type: this.type,
      value: this.value,
      config: this.config,
    };
  }
}

/**
 * === Configs ===
 * If limitations are not met,
 * the protocol will be marked as not valid
 */
class ProtocolNumberEntryConfig {
  /** null means there is no min/max limit */
  maxValue: number | null = null;
  minValue: number | null = null;
}
