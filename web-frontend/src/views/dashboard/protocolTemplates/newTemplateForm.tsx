import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { EventBus } from "../../../eventbus";
import Alert from "@material-ui/lab/Alert";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";
import axios from "axios";
import { BackendService } from "../../../backendservice";
import { App } from "../../../App";

export default class NewTemplateForm extends React.Component {
  constructor(props) {
    super(props);
    EventBus.instance.on("openNewTemplateForm", () => {
      this.handleClickOpen();
    });
  }

  state = { open: false, error: "", name: "" };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, error: "", name: "" });
  };

  handleCreateClicked = () => {
    if (this.state.name.trim().length === 0) {
      this.setState({
        error: "Bitte gib eine Bezeichnung für das Protokoll ein.",
      });
      return;
    }

    let template: ProtocolTemplate = new ProtocolTemplate();
    template.protocol.metadata.label = this.state.name;
    template.protocol.metadata.parserVersion = "v1";
    template.createdAt = new Date();

    let data = BackendService.buildWithSessionKey(
      "/protocols/templates",
      "POST",
      {},
      template.toJSON()
    );
    axios(data)
      .then((res) => {
        template.id = res.data.id;
        App.user.protocols.templates.push(template);
        this.handleClose();
        EventBus.instance.emit("updateTemplatesView");
      })
      .catch((error) => {
        this.setState({
          error:
            "Protokolltemplate konnte nicht erstellt werden: " +
            BackendService.extractErrorText(error),
        });
      })
      .finally(() => {});
  };

  handleNameChange = (event: any) => {
    this.setState({ name: event.target.value });
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose.bind(this)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Neues Template erstellen
        </DialogTitle>
        <DialogContent>
          {this.state.error.trim().length > 0 && (
            <Alert severity="warning">{this.state.error}</Alert>
          )}
          <DialogContentText>
            Gib bitte einen Namen ein, der dieses Protokoll-Template am besten
            beschreibt.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Protokollname"
            type="text"
            fullWidth
            value={this.state.name}
            onChange={this.handleNameChange.bind(this)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            Abbrechen
          </Button>
          <Button onClick={this.handleCreateClicked.bind(this)} color="primary">
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
