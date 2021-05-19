import React from "react";
import { EventBus } from "../../../eventbus";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  IconButton,
  Tooltip,
  Popover,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
} from "@material-ui/core";
import { LoadingButton } from "../../../components/loadingButton";
import { Label } from "../../../models/label";
import { App } from "../../../App";
import { BackendService } from "../../../backendservice";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import DeleteIcon from "@material-ui/icons/Delete";
import { ChromePicker } from "react-color";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/HelpOutline";
import { LabelChip } from "../../../components/labelChip";

export class LabelEditor extends React.Component {
  constructor(props) {
    super(props);
    EventBus.instance.on("openLabelEditor", () => {
      this.setState({ open: true, error: "", loading: false });
      this.loadLabelsFromBackend();
    });

    //TODO remove, mock
    /*let lbl1 = new Label();
    lbl1.name = "Testlabel";
    lbl1.details = "Labeldetails";
    lbl1.id = 1;
    lbl1.color = "blue";

    let lbl2 = new Label();
    lbl2.name = "Testlabel2";
    lbl2.details = "Labeldetails2";
    lbl2.id = 2;
    lbl2.color = "green";

    this.copy.push(lbl1);
    this.copy.push(lbl2);*/
  }

  loadLabelsFromBackend = () => {
    let data = BackendService.buildWithSessionKey("/labels", "GET");
    axios(data).then((res) => {
      App.user.protocols.labels = res.data;
      this.copy = JSON.parse(JSON.stringify(App.user.protocols.labels));
      this.forceUpdate();
    });
  };

  state: {
    open: boolean;
    loading: boolean;
    error: string;
    colorPickerAnchor: HTMLElement | null;
    colorPickerLabel: Label;
  } = {
    open: false,
    loading: false,
    error: "",
    colorPickerAnchor: null,
    colorPickerLabel: new Label(),
  };

  copy: Label[] = [];

  handleClose = () => {
    this.setState({ open: false, error: "", loading: false });
  };

  deleteLabel = (index) => {
    this.copy.splice(index, 1);
    this.forceUpdate();
  };

  closeColorPicker = () => {
    this.setState({ colorPickerAnchor: null });
  };

  openColorPicker = (lbl: Label, event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      colorPickerAnchor: event.currentTarget,
      colorPickerLabel: lbl,
    });
  };

  handleColorChange = (color) => {
    this.state.colorPickerLabel.color = color.hex;
    this.forceUpdate();
  };

  handleNameChange = (label: Label, event) => {
    label.name = event.target.value;
    this.forceUpdate();
  };

  handleDetailsChange = (label: Label, event) => {
    label.details = event.target.value;
    this.forceUpdate();
  };

  handleAddClicked = () => {
    let lbl = new Label();
    lbl.name = "Neues Label";
    lbl.details = "";
    lbl.color = "green";

    this.copy.push(lbl);
    this.forceUpdate();
  };

  handleSaveClicked = () => {
    this.setState({ loading: true });
    let data = BackendService.buildWithSessionKey(
      "/labels",
      "POST",
      {},
      this.copy
    );
    axios(data)
      .then(() => {
        App.user.protocols.labels = this.copy;
        this.handleClose();
      })
      .catch(() => {
        this.setState({ error: "Beim Speichern ist ein Fehler aufgetreten." });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <>
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Labels bearbeiten</DialogTitle>
          <DialogContent>
            <Alert variant="standard" color="info" icon={<InfoIcon />}>
              <DialogContentText>
                Labels dienen der Gruppierung und Sortierung von Protokollen.
                <br />
                Hinterlegte Details werden angezeigt, wenn man mit der Maus über
                das Label fährt.
              </DialogContentText>
            </Alert>
            {this.state.error.length > 0 && (
              <Alert severity="error">{this.state.error}</Alert>
            )}
            <br />
            <Popover
              id={"colorPickerPopover"}
              open={Boolean(this.state.colorPickerAnchor)}
              anchorEl={this.state.colorPickerAnchor}
              onClose={this.closeColorPicker.bind(this)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <ChromePicker
                color={this.state.colorPickerLabel.color}
                onChange={this.handleColorChange.bind(this)}
              />
            </Popover>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Vorschau</TableCell>
                  <TableCell align="left">Text</TableCell>
                  <TableCell align="right">Farbe</TableCell>
                  <TableCell align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.copy.map((lbl: Label, index: number) => {
                  return (
                    <React.Fragment key={"vdwouk-" + index}>
                      <TableRow>
                        <TableCell style={{ border: "none" }}>
                          <LabelChip label={lbl} />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={lbl.name}
                            onChange={this.handleNameChange.bind(this, lbl)}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title="Farbe ändern"
                            aria-label="change_color"
                          >
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              color={"secondary"}
                              onClick={this.openColorPicker.bind(this, lbl)}
                            >
                              <div
                                style={{
                                  backgroundColor: lbl.color,
                                  borderRadius: "50%",
                                  border: "9px solid white",
                                  height: "15px",
                                  width: "15px",
                                }}
                              ></div>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            color={"secondary"}
                            onClick={this.deleteLabel.bind(this, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={3}>
                          <TextField
                            label="Details"
                            value={lbl.details}
                            onChange={this.handleDetailsChange.bind(this, lbl)}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            <div style={{ textAlign: "center" }}>
              <IconButton onClick={this.handleAddClicked.bind(this)}>
                <AddIcon />
              </IconButton>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose.bind(this)}
              color="primary"
              disabled={this.state.loading}
            >
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
      </>
    );
  }
}
