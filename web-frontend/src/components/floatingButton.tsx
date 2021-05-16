import React from "react";
import { Zoom, Fab } from "@material-ui/core";
import { App } from "../App";

export class FloatingButton extends React.Component<{
  onclick?:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  left?: boolean;
}> {
  render() {
    return (
      <div
        style={
          this.props.left
            ? {
                position: "absolute",
                right: "13rem",
                bottom: "0",
                height: "auto",
                width: "auto",
              }
            : {
                position: "absolute",
                right: "0",
                bottom: "0",
                height: "auto",
                width: "auto",
              }
        }
      >
        <Zoom
          timeout={App.config.fadeInDuration}
          in
          style={{
            transitionDelay: `${App.config.fadeInDuration}ms`,
          }}
          unmountOnExit
        >
          <Fab
            variant="extended"
            color={this.props.left ? "secondary" : "primary"}
            aria-label="add"
            className="action-button-bottom-right"
            onClick={this.props.onclick && this.props.onclick}
          >
            {this.props.children}
          </Fab>
        </Zoom>
      </div>
    );
  }
}
