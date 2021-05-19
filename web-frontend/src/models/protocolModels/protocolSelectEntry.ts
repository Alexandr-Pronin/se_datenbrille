import { ProtocolEntry } from "./protocolEntry";

export class ProtocolSelectEntry extends ProtocolEntry {
  constructor() {
    super();
    this.setType("select");
  }
  choices: string[] = [];
  possibleChoices: string[] = [];
  config: ProtocolSelectEntryConfig = new ProtocolSelectEntryConfig();

  public validate = () => {
    super.setValid(this.checkValid());
    super.setType("select");
    return this.isValid();
  };

  private checkValid = () => {
    /**
     * Check if choices are part of possibleChoices
     */
    var valid = true;
    this.choices.map((choice: string) => {
      if (this.possibleChoices.indexOf(choice) === -1) valid = false;
      return choice;
    });
    if (!valid) return false;

    /**
     * Check if limitations of min and max choices are met
     */
    if (this.config.maxChoices === -1 && this.config.minChoices === -1)
      return true;
    if (
      this.config.maxChoices !== -1 &&
      this.choices.length > this.config.maxChoices
    )
      return false;
    if (
      this.config.minChoices !== -1 &&
      this.choices.length < this.config.minChoices
    )
      return false;
    return true;
  };

  /**
   * === Overriding toJSON ===
   * Will be returned when calling object.prototype.toJSON()
   *
   * By overriding this method we prevent the JSON from containing
   * unnecessary information like functions.
   */
  toJSON() {
    return {
      label: this.label,
      type: this.type,
      choices: this.choices,
      possibleChoices: this.possibleChoices,
      config: this.config,
    };
  }
}

/**
 * === Configs ===
 * If limitations are not met,
 * the protocol will be marked as not valid
 */
class ProtocolSelectEntryConfig {
  /** -1 means there is no min/max limit */
  maxChoices: number = -1;
  minChoices: number = -1;
}
