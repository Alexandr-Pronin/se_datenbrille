import React from "react";
import { Chip, Icon } from "@material-ui/core";
import WarnIcon from "@material-ui/icons/WarningOutlined";
import { ProtocolSelectEntry } from "../../../models/protocolModels/protocolSelectEntry";

interface ProtocolSelectEntryViewProps {
  entry: ProtocolSelectEntry;
  noChecks?: boolean;
  noValue?: boolean;
}

export class ProtocolSelectEntryView extends React.Component<
  ProtocolSelectEntryViewProps
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
          <Chip label={"Auswahl"} size={"small"} style={this.styles.chip} />
          {this.props.entry.config.minChoices !== null && (
            <Chip
              label={<>mindestens {this.props.entry.config.minChoices}</>}
              size={"small"}
              style={this.styles.chip}
              variant={"outlined"}
            />
          )}
          {this.props.entry.config.maxChoices !== null && (
            <Chip
              label={<>höchstens {this.props.entry.config.maxChoices}</>}
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
          {!this.props.noValue && <hr />}
          {this.props.noValue && (
            <div style={{ width: "100%", padding: "0.5rem" }}></div>
          )}
          <div style={this.styles.value}>
            {!this.props.noValue && <>Auswahl: </>}
            {this.props.entry.possibleChoices.map((choice, index) => {
              return (
                <Chip
                  key={index}
                  icon={
                    this.props.entry.choices.indexOf(choice) === -1 ? (
                      <Icon>check_box_outline_blank</Icon>
                    ) : (
                      <Icon>check_box</Icon>
                    )
                  }
                  label={choice}
                  color="primary"
                  variant="outlined"
                  style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}
                  disabled={
                    this.props.entry.choices.indexOf(choice) === -1 &&
                    !this.props.noValue
                  }
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
