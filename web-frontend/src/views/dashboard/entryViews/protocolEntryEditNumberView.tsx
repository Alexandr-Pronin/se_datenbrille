import React from "react";
import { ProtocolNumberEntry } from "../../../models/protocolModels/protocolNumberEntry";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Icon,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { EventBus } from "../../../eventbus";
import { LoadingButton } from "../../../components/loadingButton";
import { BackendService } from "../../../backendservice";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";

export class ProtocolEntryEditNumberView extends React.Component<{
  entry: ProtocolNumberEntry;
  template: ProtocolTemplate;
}> {
  state = { open: true, error: "", loading: false };

  backup: any = JSON.parse(JSON.stringify(this.props.entry));

  handleClose = () => {
    EventBus.instance.emit("updateEditTemplateView");
  };

  //rollback
  handleCancel = () => {
    this.props.entry.value = this.backup.value;
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
    this.props.entry.config.minValue =
      event.target.value === "" ? null : Number(event.target.value);
    this.forceUpdate();
  };

  handleConfigMaxValueChange = (event) => {
    this.props.entry.config.maxValue = Number(event.target.value) || null;
    this.forceUpdate();
  };

  handleSaveClicked = () => {
    if (this.props.entry.label.trim().length === 0) {
      this.setState({ error: "Die Bezeichnung/Frage darf nicht leer sein." });
      return;
    }
    if (
      this.props.entry.config.minValue !== null &&
      this.props.entry.config.maxValue !== null &&
      this.props.entry.config.minValue > this.props.entry.config.maxValue
    ) {
      this.setState({
        error:
          "Der kleinste Wert muss kleiner oder gleich dem größten Wert sein.",
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
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleCancel.bind(this)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Zahlenwertabfrage</DialogTitle>
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
          <Icon fontSize={"inherit"}>settings</Icon> Einstellungen
          <div style={{ paddingLeft: "1rem" }}>
            <TextField
              margin="dense"
              label="Kleinster Wert"
              type="number"
              fullWidth
              value={
                this.props.entry.config.minValue !== null
                  ? this.props.entry.config.minValue
                  : ""
              }
              onChange={this.handleConfigMinValueChange.bind(this)}
            />
            <TextField
              margin="dense"
              label="Größter Wert"
              type="number"
              fullWidth
              value={
                this.props.entry.config.maxValue !== null
                  ? this.props.entry.config.maxValue
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
