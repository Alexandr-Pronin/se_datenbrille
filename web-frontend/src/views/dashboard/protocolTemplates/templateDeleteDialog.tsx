import React from "react";
import { EventBus } from "../../../eventbus";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { BackendService } from "../../../backendservice";
import { App } from "../../../App";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";
import Alert from "@material-ui/lab/Alert";

export class TemplateDeleteDialog extends React.Component {
  constructor(props) {
    super(props);
    EventBus.instance.on("showTemplateDeleteDialog", (index) => {
      this.setState({
        template: App.user.protocols.templates[index],
        show: true,
      });
    });
  }

  state: { error: string; show: boolean; template: ProtocolTemplate } = {
    error: "",
    show: false,
    template: new ProtocolTemplate(),
  };

  handleClose = () => {
    this.setState({ show: false, error: "" });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleDeleteConfirmed = () => {
    let data = BackendService.buildWithSessionKey(
      `/protocols/templates/${this.state.template.id}`,
      "DELETE"
    );
    axios(data)
      .then((res) => {
        App.user.protocols.templates.splice(
          App.user.protocols.templates.indexOf(this.state.template),
          1
        );
        this.handleClose();
        EventBus.instance.emit("updateTemplatesView");
      })
      .catch((error) => {
        this.setState({
          error: `Template konnte nicht gelöscht werden: ${error.response.data}`,
        });
      });
  };

  render() {
    return (
      <Dialog
        open={this.state.show}
        onClose={this.handleClose.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sind Sie sicher?"}</DialogTitle>
        <DialogContent>
          {this.state.error.trim().length > 0 && (
            <Alert severity="warning">{this.state.error}</Alert>
          )}
          <DialogContentText id="alert-dialog-description">
            Das Protokoll-Template "
            {this.state.template.protocol.metadata.label}" wird endgültig
            gelöscht. Die mit diesem Template aufgenommenen Protokolle sind
            davon unberührt.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            Abbrechen
          </Button>
          <Button
            onClick={this.handleDeleteConfirmed.bind(this)}
            color="primary"
            autoFocus
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
