import React from "react";
import { Label } from "../models/label";
import { Chip, Popover, Typography } from "@material-ui/core";
import LabelIcon from "@material-ui/icons/Label";
import uuid from "uuid/v4";

export class LabelChip extends React.Component<{ label: Label }> {
  state = { anchorEl: null };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  id: string = uuid();

  render() {
    let label = this.props.label;
    return (
      <>
        <Chip
          icon={<LabelIcon />}
          label={label.name}
          color="secondary"
          variant="default"
          style={{
            marginBottom: "0.5rem",
            marginLeft: "0.5rem",
            backgroundColor: label.color,
          }}
          aria-owns={Boolean(this.state.anchorEl) ? this.id : undefined}
          aria-haspopup="true"
          onMouseEnter={this.handlePopoverOpen.bind(this)}
          onMouseLeave={this.handlePopoverClose.bind(this)}
        />
        <Popover
          id={this.id}
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={this.handlePopoverClose.bind(this)}
          disableRestoreFocus
        >
          <Typography variant={"subtitle1"}>Details</Typography>
          <Typography variant={"subtitle1"}>{label.details}</Typography>
        </Popover>
      </>
    );
  }
}
