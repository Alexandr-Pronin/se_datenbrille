import React from "react";
import MaterialTable from "material-table";
import {
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import FormattedTextField from "../../components/formattedTextField";
import { App } from "../../App";
import { EventBus } from "../../eventbus";
import { DeviceBuilder } from "../../models/device";
import Alert from "@material-ui/lab/Alert";
import FadeIn from "react-fade-in";
import { QRCodeView } from "./qrCodeView";
import { RegisterDeviceView } from "./registerDeviceView";

interface Row {
  name: string;
  workee: number | undefined;
  lastsync: Date | undefined;
}

interface TableProps {
  data: Row[];
}

interface DevicesViewProps {}

export default class DevicesView extends React.Component<
  DevicesViewProps & TableProps
> {
  constructor(props) {
    super(props);
    App.user.workees.map((workee) => {
      this.lookup[workee.id] = workee.name;
      return workee;
    });
  }
  lookup: {} = { 0: "Nicht ausgegeben" };
  columns: any = [
    { title: "Ihre Gerätekennung", field: "name" },
    {
      title: "Ausgegeben an",
      field: "workee",
      lookup: this.lookup,
    },
    { title: "Letzte Synchronisierung", field: "lastsync", type: "datetime" },
  ];

  render() {
    return (
      <FadeIn
        delay={App.config.fadeInDelay}
        transitionDuration={App.config.fadeInDuration}
      >
        <div className={"margin-top"}>
          <MaterialTable
            options={{
              paging: false,
              filtering: false,
              draggable: false,
            }}
            localization={{
              body: {
                editTooltip: "Bearbeiten",
                deleteTooltip: "Löschen",
                emptyDataSourceMessage: "Keine Geräte registriert.",
                editRow: {
                  saveTooltip: "Speichern",
                  cancelTooltip: "Abbrechen",
                  deleteText:
                    "Möchtest Du dieses Gerät wirklich entfernen? Es werden dann keine Daten mehr synchronisiert.",
                },
              },
              header: { actions: "Aktionen" },
              toolbar: { searchPlaceholder: "Gerätename Suchen" },
            }}
            title="Meine Geräte"
            columns={this.columns}
            data={this.props.data}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    if (oldData) {
                      App.user.devices[
                        this.props.data.indexOf(oldData)
                      ].workee = App.user.workees.find(
                        (w) => w.id + "" === newData.workee + ""
                      );
                      App.user.devices[
                        this.props.data.indexOf(oldData)
                      ].lastsync = newData.lastsync;
                      console.log(oldData);
                      console.log(newData);
                      console.log(App.user.devices);
                    }
                    EventBus.instance.emit("updateApp");
                  }, 600);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    App.user.devices.splice(this.props.data.indexOf(oldData));
                    EventBus.instance.emit("updateApp");
                  }, 600);
                }),
            }}
          />
        </div>
        <AddDeviceView />
      </FadeIn>
    );
  }
}

class AddDeviceView extends React.Component {
  state = {
    helpOpen: false,
    deviceCode: "",
    loading: false,
    error: "",
    showQRCode: false,
  };

  handleClose = () => {
    this.setState({ helpOpen: false });
  };

  handleShow = () => {
    this.setState({ helpOpen: true });
  };

  onDeviceCodeChange = (val) => {
    this.setState({ deviceCode: val });
  };

  handleRegisterDevice = () => {
    if (this.state.deviceCode.length === 16) {
      this.setState({ loading: true });
      App.user.devices.push(
        new DeviceBuilder()
          .setName("Brille-" + (App.user.devices.length + 1))
          .setCode(this.state.deviceCode)
          .build()
      );
      setTimeout(() => {
        this.setState({ loading: false });
        EventBus.instance.emit("updateApp");
      }, 1000);
    } else {
      this.setState({ error: "Bitte gib den 16-stelligen Gerätecode ein." });
    }
  };

  render() {
    return (
      <>
        {this.state.showQRCode && (
          <RegisterDeviceView
            onClose={() => {
              this.setState({ showQRCode: false });
            }}
          />
        )}

        <Paper className={"margin-top padding"}>
          <Snackbar
            open={this.state.error.length > 0}
            autoHideDuration={5000}
            onClose={(event?: React.SyntheticEvent, reason?: string) => {
              reason !== "clickaway" && this.setState({ error: "" });
            }}
          >
            <Alert severity="warning">{this.state.error}</Alert>
          </Snackbar>
          <h6 className={"MuiTypography-root MuiTypography-h6"}>
            Gerät verknüpfen
          </h6>
          <Grid container spacing={3}>
            <Grid item lg={6} xs={12}>
              <FormattedTextField
                label="16-stelliger Gerätecode"
                onChange={this.onDeviceCodeChange}
              />
              <br />
              <br />
              <Chip
                avatar={<Avatar>?</Avatar>}
                label="Wo finde ich den Gerätecode?"
                onClick={this.handleShow.bind(this)}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ float: "right" }}
                onClick={() => {
                  this.setState({ showQRCode: true });
                }}
              >
                QR-Code anzeigen
              </Button>
            </Grid>
            <Grid item lg={6} xs={12}>
              <div style={{ float: "right" }}>
                <CircularProgress
                  color="secondary"
                  style={{
                    marginRight: "1rem",
                    display: this.state.loading ? "" : "none",
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ float: "right" }}
                  onClick={this.handleRegisterDevice.bind(this)}
                >
                  Gerät registrieren
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Dialog
          open={this.state.helpOpen}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Wo finde ich den Gerätecode?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Öffnen Sie die {App.appName}-App auf Ihrer Datenbrille. Navigieren
              Sie im Hauptmenu zum Menupunkt "Gerätecode anzeigen" oder sagen
              Sie einfach "Gerätecode".
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
