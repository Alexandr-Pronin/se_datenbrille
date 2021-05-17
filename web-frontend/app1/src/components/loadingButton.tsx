import React from "react";
import { Button, CircularProgress } from "@material-ui/core";

export class LoadingButton extends React.Component<{
  loading: boolean;
  onClick?:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  style?: React.CSSProperties;
}> {
  render() {
    return (
      <div style={this.props.style ? this.props.style : {}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={this.props.loading}
              onClick={this.props.onClick}
            >
              {this.props.children}
            </Button>
            {this.props.loading && (
              <CircularProgress
                size={24}
                style={{
                  color: "primary",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: -12,
                  marginLeft: -12,
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
