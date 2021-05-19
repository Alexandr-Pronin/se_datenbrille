import React from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Icon,
  Typography,
  IconButton,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { EventBus } from "../../../eventbus";
import { LoadingButton } from "../../../components/loadingButton";
import { BackendService } from "../../../backendservice";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";
import { ProtocolSelectEntry } from "../../../models/protocolModels/protocolSelectEntry";
import { EditableChip } from "../../../components/editableChip";

export class ProtocolEntryEditSelectView extends React.Component<{
  entry: ProtocolSelectEntry;
  template: ProtocolTemplate;
}> {
  state = { open: true, error: "", loading: false };

  backup: any = JSON.parse(JSON.stringify(this.props.entry));

  handleClose = () => {
    EventBus.instance.emit("updateEditTemplateView");
  };

  //rollback
  handleCancel = () => {
    this.props.entry.choices = this.backup.choices;
    this.props.entry.possibleChoices = this.backup.possibleChoices;
    this.props.entry.config = this.backup.config;
    this.props.entry.label = this.backup.label;
    this.handleClose();
  };

  handleLabelChange = (event) => {
    this.props.entry.label = event.target.value;
    this.forceUpdate();
  };

  stopLoading = () => {
    this.setState({ loading: false });
  };

  startLoading = () => {
    this.setState({ loading: true });
  };

  handleConfigMinValueChange = (event) => {
    this.props.entry.config.minChoices =
      event.target.value === "" ? -1 : Number(event.target.value);
    this.forceUpdate();
  };

  handleConfigMaxValueChange = (event) => {
    this.props.entry.config.maxChoices = Number(event.target.value) || -1;
    this.forceUpdate();
  };

  handleDeleteChoice = (index: number) => {
    let ci: number;
    if (
      (ci = this.props.entry.choices.indexOf(
        this.props.entry.possibleChoices[index]
      )) !== -1
    )
      this.props.entry.choices.splice(ci, 1);
    this.props.entry.possibleChoices.splice(index, 1);
    this.forceUpdate();
  };

  handleChoiceChange = (index: number, value: string) => {
    this.props.entry.possibleChoices[index] = value;
    console.log("Change: " + value);
    this.forceUpdate();
  };

  handleSaveClicked = () => {
    if (this.props.entry.label.trim().length === 0) {
      this.setState({ error: "Die Bezeichnung/Frage darf nicht leer sein." });
      return;
    }
    if (this.props.entry.possibleChoices.length === 0) {
      this.setState({
        error: "Fügen Sie mindestens eine Antwortmöglichkeit hinzu.",
      });
      return;
    }
    if (
      this.props.entry.config.minChoices !== null &&
      this.props.entry.config.maxChoices !== null &&
      this.props.entry.config.minChoices > this.props.entry.config.maxChoices
    ) {
      this.setState({
        error:
          "Die mindestens geforderte Anzahl an Auswahlen muss kleiner oder gleich der Höchstzahl sein.",
      });
      return;
    }
    let index = this.props.template.protocol.entries.indexOf(this.props.entry);
    if (index === -1)
      this.props.template.protocol.entries.push(this.props.entry);

    console.log(index);

    let body = {
      id: this.props.template.id,
      protocol: this.props.template.protocol,
    };

    this.startLoading();

    let data = BackendService.buildWithSessionKey(
      "/protocols/templates",
      "POST",
      {},
      body
    );
    axios(data)
      .then((res) => {
        this.props.template.id = res.data.id;
        this.stopLoading();
        this.handleClose();
      })
      .catch((error) => {
        this.setState({
          error:
            "Template konnte nicht gespeichert werden: " +
            BackendService.extractErrorText(error),
          loading: false,
        });
      });
  };

  render() {
    let addButtonDisabled = false;
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleCancel.bind(this)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Auswahl / Multiple Choice
        </DialogTitle>
        <DialogContent>
          {this.state.error.trim().length > 0 && (
            <Alert severity="warning">{this.state.error}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Bezeichnung/Frage"
            type="text"
            fullWidth
            value={this.props.entry.label}
            onChange={this.handleLabelChange.bind(this)}
          />
          <hr color={"white"} style={{ marginTop: "3rem" }} />
          {this.props.entry.possibleChoices.length === 0 ? (
            <Typography color={"textSecondary"} variant={"subtitle2"}>
              Fügen Sie Antwortmöglichkeiten hinzu.
            </Typography>
          ) : (
            <Typography color={"textSecondary"} variant={"subtitle2"}>
              Klicken Sie auf eine Antwort, um sie zu bearbeiten.
            </Typography>
          )}
          {this.props.entry.possibleChoices.map(
            (choice: string, index: number) => {
              if (
                choice.length === 0 &&
                index === this.props.entry.possibleChoices.length - 1
              )
                addButtonDisabled = true;
              return (
                <EditableChip
                  key={"28e7an-" + index}
                  icon={<Icon>check_box_outline_blank</Icon>}
                  value={choice}
                  color="primary"
                  variant="outlined"
                  onChange={(value) => {
                    this.handleChoiceChange(index, value);
                  }}
                  edit={
                    choice.length === 0 &&
                    index === this.props.entry.possibleChoices.length - 1
                  }
                  onDelete={this.handleDeleteChoice.bind(this, index)}
                />
              );
            }
          )}
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              this.props.entry.possibleChoices.push("");
              this.forceUpdate();
            }}
            disabled={addButtonDisabled}
          >
            <Icon>add</Icon>
          </IconButton>
          <hr color={"white"} style={{ marginTop: "3rem" }} />
          <Icon fontSize={"inherit"}>settings</Icon> Einstellungen
          <div style={{ paddingLeft: "1rem" }}>
            <TextField
              margin="dense"
              label="Mindestanzahl anzukreuzender Antworten"
              type="number"
              fullWidth
              value={
                this.props.entry.config.minChoices !== -1
                  ? this.props.entry.config.minChoices
                  : ""
              }
              onChange={this.handleConfigMinValueChange.bind(this)}
            />
            <TextField
              margin="dense"
              label="Höchstanzahl anzukreuzender Antworten"
              type="number"
              fullWidth
              value={
                this.props.entry.config.maxChoices !== -1
                  ? this.props.entry.config.maxChoices
                  : ""
              }
              onChange={this.handleConfigMaxValueChange.bind(this)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel.bind(this)} color="primary">
            Abbrechen
          </Button>
          <LoadingButton
            loading={this.state.loading}
            onClick={this.handleSaveClicked.bind(this)}
          >
            Speichern
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
}
