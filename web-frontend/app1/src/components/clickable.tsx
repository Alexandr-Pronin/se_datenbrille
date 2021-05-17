import * as React from "react";
import { EventBus } from "../eventbus";

interface ClickableProps {
  event?: Array<any>;
  onclick?: Function;
  defaultCursor?: boolean;
}

export class Clickable extends React.Component<ClickableProps> {
  onclick = () => {};

  render() {
    if (this.props.event) {
      this.onclick = () => {
        var e;
        if (this.props.event && this.props.event.length === 1) {
          e = this.props.event[0];
          EventBus.instance.emit(e);
        }
        if (this.props.event && this.props.event.length > 1) {
          e = this.props.event[0];
          var args = this.props.event[1];
          EventBus.instance.emit(e, args);
        }
      };
    } else {
      this.onclick = () => {
        if (this.props.onclick) this.props.onclick.call(this);
      };
    }
    return (
      <span
        onClick={this.onclick}
        className={this.props.defaultCursor ? "" : "clickable"}
      >
        {this.props.children}
      </span>
    );
  }
}
