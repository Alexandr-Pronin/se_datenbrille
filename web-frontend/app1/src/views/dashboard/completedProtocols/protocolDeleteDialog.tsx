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
import Alert from "@material-ui/lab/Alert";

export class ProtocolDeleteDialog extends React.Component<{ ids: number[] }> {
  state: { error: string } = {
    error: "",
  };

  handleClose = () => {
    this.setState({ error: "" });
    EventBus.instance.emit("hideDeleteConfirmDialog");
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleDeleteConfirmed = () => {
    let data = BackendService.buildWithSessionKey(
      "/protocols/delete",
      "POST",
      {},
      {
        ids: this.props.ids,
      }
    );
    axios(data)
      .then((res) => {
        this.props.ids.map((id: number, index: number) => {
          let i: number = App.user.protocols.completed.findIndex(
            (obj) => obj.id === id
          );
          if (i !== -1) App.user.protocols.completed.splice(i, 1);
        });
        this.handleClose();
        EventBus.instance.emit(
          "updateCompletedProtocolsViewAndShowSuccessMessage",
          "Protokoll gelöscht."
        );
      })
      .catch((error) => {
        this.setState({
          error: `Protokoll konnte nicht gelöscht werden: ${BackendService.extractErrorText(
            error
          )}`,
        });
      });
  };

  render() {
    return (
      <Dialog
        open={true}
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
            {this.props.ids.length > 1 ? (
              <>Es werden {this.props.ids.length} Protokolle </>
            ) : (
              <>Es wird {this.props.ids.length} Protokoll </>
            )}
            endgültig gelöscht. Sind Sie sicher?
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
