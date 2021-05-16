import { App } from "../App";

export class Workee {
  name: string = "";
  id: number = 0;

  /**
   * @returns workees full name
   */
}

export class WorkeeBuilder {
  workee: Workee = new Workee();
  setName = (name: string) => {
    this.workee.name = name;
    return this;
  };
  setId = (id: number) => {
    this.workee.id = id;
    return this;
  };
  build = () => {
    return this.workee;
  };
}
