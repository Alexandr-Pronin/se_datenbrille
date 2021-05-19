import React from "react";
import { ProtocolNumberEntry } from "../../../models/protocolModels/protocolNumberEntry";
import { Chip } from "@material-ui/core";
import WarnIcon from "@material-ui/icons/WarningOutlined";

interface ProtocolNumberEntryViewProps {
  entry: ProtocolNumberEntry;
  noChecks?: boolean;
  noValue?: boolean;
}

export class ProtocolNumberEntryView extends React.Component<
  ProtocolNumberEntryViewProps
> {
  styles = {
    header: {
      width: "100%",
    },
    chip: {
      borderRadius: "0.5rem",
      marginLeft: "0.5rem",
    },
    value: {},
  };

  render() {
    return (
      <>
        <div style={this.styles.header}>
          {this.props.entry.label}{" "}
          <Chip label={"Zahl"} size={"small"} style={this.styles.chip} />
          {this.props.entry.config.minValue !== null && (
            <Chip
              label={<>&ge; {this.props.entry.config.minValue}</>}
              size={"small"}
              style={this.styles.chip}
              variant={"outlined"}
            />
          )}
          {this.props.entry.config.maxValue !== null && (
            <Chip
              label={<>&le; {this.props.entry.config.maxValue}</>}
              size={"small"}
              style={this.styles.chip}
              variant={"outlined"}
            />
          )}
          {!this.props.noChecks && !this.props.entry.validate() && (
            <Chip
              avatar={
                <WarnIcon
                  style={{ backgroundColor: "inherit", color: "inherit" }}
                />
              }
              label={"Grenzen nicht eingehalten"}
              size={"small"}
              color={"secondary"}
              style={{ float: "right" }}
              variant={"outlined"}
            />
          )}
          {!this.props.noValue && (
            <>
              <hr />
              <div style={this.styles.value}>= {this.props.entry.value}</div>
            </>
          )}
        </div>
      </>
    );
  }
}
