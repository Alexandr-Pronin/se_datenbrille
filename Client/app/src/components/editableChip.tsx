import React from "react";
import { Chip } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

export class EditableChip extends React.Component<
  any & { color: string; backgroundColor: string }
> {
  state = {
    edit: this.props.edit ? this.props.edit : false,
    value: this.props.value,
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSave = () => {
    if (this.state.value.trim().length === 0 && this.props.value.length === 0) {
      this.props.onDelete();
      return;
    }
    if (this.state.value.trim().length === 0) {
      this.setState({ edit: false, value: this.props.value });
    } else {
      this.setState({ edit: false });
      this.props.onChange(this.state.value.trim());
    }
  };

  render() {
    return (
      <>
        {this.state.edit ? (
          <Chip
            icon={this.props.icon}
            label={
              <input
                style={{ border: "none", outline: "none" }}
                size={this.state.value.length || 1}
                autoFocus
                type="text"
                value={this.state.value}
                onChange={this.handleChange.bind(this)}
                onBlur={this.handleSave.bind(this)}
              />
            }
            color={this.props.color}
            variant={this.props.variant}
            onDelete={this.handleSave.bind(this)}
            deleteIcon={<DoneIcon />}
            style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}
          />
        ) : (
          <Chip
            icon={this.props.icon}
            label={this.state.value}
            color={this.props.color}
            variant={this.props.variant}
            onDelete={this.props.onDelete}
            onClick={() => {
              this.setState({ edit: true });
            }}
            style={{
              marginBottom: "0.5rem",
              marginRight: "0.5rem",
              backgroundColor: this.props.backgroundColor,
            }}
          />
        )}
      </>
    );
  }
}
