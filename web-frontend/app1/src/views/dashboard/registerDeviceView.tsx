import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { QRCodeView } from "./qrCodeView";
import { BackendService } from "../../backendservice";
import { Device } from "../../models/device";
import axios from "axios";

export class RegisterDeviceView extends React.Component<{
  onClose: any;
}> {
  state: { step: number; device?: Device; deviceLoading: boolean } = {
    step: 1,
    deviceLoading: true,
  };

  componentDidMount = () => {
    this.setState({ deviceLoading: true });
    let data = BackendService.buildWithSessionKey("/devices/register", "POST");

    axios(data)
      .then((res) => {
        this.setState({ device: res.data });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => this.setState({ deviceLoading: false }));
  };

  handleOpenStepTwo = () => {
    this.setState({ step: 2 });
    let data = BackendService.buildWithSessionKey(
      `/devices/${this.state.device!.devicecode}`,
      "GET"
    );

    this.timer = setInterval(() => {
      axios(data)
        .then((res) => {
          if (res.data.approved === 1) {
            this.handleOpenStepThree();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000);
  };

  timer?;

  handleOpenStepThree = () => {
    this.setState({ step: 3 });
  };

  handleClose = () => {
    this.setState({ step: 1, device: undefined, deviceLoading: true });
    if (!!this.timer) clearInterval(this.timer);
    this.props.onClose();
  };

  render() {
    return (
      <>
        <Dialog open={true} onClose={this.handleClose.bind(this)}>
          <DialogTitle>
            {this.state.step === 1 &&
              "Scannen Sie den QR-Code mit Ihrer Datenbrille und klicken Sie auf Weiter."}
            {this.state.step === 2 &&
              "Bitte warten Sie, während sich die Brille verbindet..."}
            {this.state.step === 3 && "Fertig!"}
          </DialogTitle>
          <DialogContent>
            {this.state.step === 1 && (
              <QRCodeView
                device={this.state.device}
                loading={this.state.deviceLoading}
              />
            )}
            {this.state.step === 2 && (
              <div style={{ width: "100%" }}>
                <CircularProgress
                  style={{ margin: "0 auto", display: "block" }}
                />
              </div>
            )}
            {this.state.step === 3 && <></>}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Abbrechen
            </Button>

            {this.state.step === 1 && !!this.state.device && (
              <Button
                onClick={this.handleOpenStepTwo.bind(this)}
                color="primary"
                variant={"contained"}
              >
                Weiter
              </Button>
            )}

            {this.state.step === 3 && (
              <Button onClick={this.handleClose.bind(this)} color="primary">
                Speichern
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
