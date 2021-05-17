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
  Fab,
  Table,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Menu,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { EventBus } from "../../../eventbus";
import { LoadingButton } from "../../../components/loadingButton";
import { BackendService } from "../../../backendservice";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";
import ProtocolTableEntry, {
  Zeile,
  Spalte,
} from "../../../models/protocolModels/protocolTableEntry";
import { ProtocolNumberEntry } from "../../../models/protocolModels/protocolNumberEntry";
import { ProtocolSelectEntry } from "../../../models/protocolModels/protocolSelectEntry";
import uuid from "uuid/v4";
import { EditableChip } from "../../../components/editableChip";

export class ProtocolEntryEditTableView extends React.Component<{
  entry: ProtocolTableEntry;
  template: ProtocolTemplate;
}> {
  constructor(props) {
    super(props);
    EventBus.instance.on("updateProtocolEntryEditTableView", () => {
      this.forceUpdate();
    });
  }
  state = { open: true, error: "", loading: false };

  backup: any = JSON.parse(JSON.stringify(this.props.entry));

  handleClose = () => {
    EventBus.instance.emit("updateEditTemplateView");
  };

  //rollback
  handleCancel = () => {
    this.props.entry.zeilen = this.backup.zeilen;
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

  handleSaveClicked = () => {
    if (this.props.entry.label.trim().length === 0) {
      this.setState({ error: "Die Bezeichnung/Frage darf nicht leer sein." });
      return;
    }
    if (
      this.props.entry.zeilen.length === 0 ||
      this.props.entry.zeilen[0].spalten?.length === 0
    ) {
      this.setState({
        error: "Fügen Sie mindestens eine Zeile und eine Spalte hinzu.",
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
    console.log(this.props.entry);
    return (
      <Dialog
        fullWidth
        open={this.state.open}
        onClose={this.handleCancel.bind(this)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">ENDLICH: Tabelle!!!</DialogTitle>
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
          {this.props.entry.zeilen.length === 0 && (
            <Typography color={"textSecondary"} variant={"subtitle2"}>
              Fügen Sie eine Zeile hinzu.
            </Typography>
          )}
          {this.buildTableRecursive()}
          <Button
            variant="outlined"
            onClick={() => {
              this.props.entry.zeilen.push(new Zeile());
              this.forceUpdate();
            }}
          >
            <Icon>add</Icon>
            Zeile
          </Button>
          <hr color={"white"} style={{ marginTop: "3rem" }} />
          <Icon fontSize={"inherit"}>settings</Icon> Einstellungen
          <div style={{ paddingLeft: "1rem" }}>TODO</div>
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

  buildTableRecursive = () => {
    return (
      <Table>
        <TableBody>
          {this.props.entry.zeilen.map((zeile: Zeile, index: number) => {
            return this.buildTableRowRecursive(
              zeile,
              this.props.entry.zeilen,
              index
            );
          })}
        </TableBody>
      </Table>
    );
  };

  buildTableRowRecursive = (
    zeile: Zeile,
    parent: Zeile[] | undefined,
    index: number
  ) => {
    {
      if (zeile.spalten.length === 0) {
        if (parent) {
          parent.splice(index, 1);
          EventBus.instance.emit("updateProtocolEntryEditTableView");
        }
        return;
      }
      return (
        <TableRow key={uuid()}>
          <TableCell>
            <RowMenu zeile={zeile} parent={parent} index={index} />
          </TableCell>

          {zeile.spalten.map((spalte: Spalte, indexSpalte: number) => {
            return this.buildTableCellRecursive(spalte, zeile, indexSpalte);
          })}
        </TableRow>
      );
    }
  };

  buildTableCellRecursive = (spalte: Spalte, parent: Zeile, index: number) => {
    {
      if (spalte.zeilen && spalte.zeilen.length === 0) {
        spalte.zeilen = undefined;
      }
      return (
        <TableCell key={uuid()} style={{ border: "1px solid black" }}>
          {spalte.zeilen && spalte.zeilen.length > 0 && (
            <Table>
              <TableBody>
                {spalte.zeilen.map((zeile: Zeile, zeileIndex: number) => {
                  return this.buildTableRowRecursive(
                    zeile,
                    spalte.zeilen,
                    zeileIndex
                  );
                })}
              </TableBody>
            </Table>
          )}
          {spalte.content && (
            <>
              {spalte.content instanceof ProtocolNumberEntry && <>ZAHL</>}
              {spalte.content instanceof ProtocolSelectEntry && <>SELECT</>}
              {
                <div
                  style={{
                    fontWeight: parent.header ? "bold" : "inherit",
                  }}
                >
                  {spalte.content}
                </div>
              }
              <NewCellMenu spalte={spalte} parent={parent} index={index} edit />
            </>
          )}
          {!spalte.content && !spalte.zeilen && (
            <>
              <NewCellMenu spalte={spalte} parent={parent} index={index} />
            </>
          )}
        </TableCell>
      );
    }
  };
}

class RowMenu extends React.Component<{
  zeile: Zeile;
  parent?: Zeile[];
  index: number;
}> {
  state = { anchor: null };
  handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchor: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchor: null });
  };

  handleAddSpalte = () => {
    this.props.zeile.spalten.push(new Spalte());
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleDeleteZeile = () => {
    this.props.parent?.splice(this.props.index, 1);
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleAddZeileTop = () => {
    this.props.parent?.splice(this.props.index, 0, new Zeile());
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleAddZeileBottom = () => {
    this.props.parent?.splice(this.props.index + 1, 0, new Zeile());
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleMarkAsHeader = () => {
    this.props.zeile.header = true;
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  render() {
    return (
      <>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={this.handleOpen.bind(this)}
        >
          <Icon>menu</Icon>
        </IconButton>
        <Menu
          anchorEl={this.state.anchor}
          keepMounted
          open={Boolean(this.state.anchor)}
          onClose={this.handleClose.bind(this)}
        >
          <MenuItem onClick={this.handleAddZeileTop.bind(this)}>
            Neue Zeile oberhalb
          </MenuItem>
          <MenuItem onClick={this.handleAddZeileBottom.bind(this)}>
            Neue Zeile unterhalb
          </MenuItem>
          <MenuItem onClick={this.handleAddSpalte.bind(this)}>
            Neue Spalte
          </MenuItem>
          <MenuItem onClick={this.handleMarkAsHeader.bind(this)}>
            Zeile als Header markieren
          </MenuItem>
          <MenuItem onClick={this.handleDeleteZeile.bind(this)}>
            Zeile Löschen
          </MenuItem>
        </Menu>
      </>
    );
  }
}

class NewCellMenu extends React.Component<{
  spalte: Spalte;
  parent?: Zeile;
  index: number;
  edit?: boolean;
}> {
  state = { anchor: null };
  handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchor: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchor: null });
  };

  handleAddZeile = () => {
    this.props.spalte.content = undefined;
    if (!this.props.spalte.zeilen)
      this.props.spalte.zeilen = [new Zeile(), new Zeile()];
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleAddSpalte = () => {
    this.props.spalte.content = undefined;
    let z: Zeile = new Zeile();
    z.spalten.push(new Spalte());
    if (!this.props.spalte.zeilen) this.props.spalte.zeilen = [z];
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleDeleteSpalte = () => {
    this.props.parent?.spalten.splice(this.props.index, 1);
    if (this.props.parent?.spalten.length === 0) this.props.parent.spalten = [];
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleSetNumberEntry = () => {
    this.props.spalte.content = new ProtocolNumberEntry();
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleSetSelectEntry = () => {
    this.props.spalte.content = new ProtocolSelectEntry();
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleSetValue = (val: string) => {
    this.props.spalte.content = val;
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  handleDeleteValue = () => {
    this.props.spalte.content = undefined;
    EventBus.instance.emit("updateProtocolEntryEditTableView");
  };

  render() {
    return (
      <>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={this.handleOpen.bind(this)}
        >
          <Icon>{this.props.edit ? "edit" : "add"}</Icon>
        </IconButton>
        <Menu
          anchorEl={this.state.anchor}
          keepMounted
          open={Boolean(this.state.anchor)}
          onClose={this.handleClose.bind(this)}
        >
          <MenuItem onClick={this.handleAddZeile.bind(this)}>
            Zelle in zwei Zeilen teilen
          </MenuItem>
          <MenuItem onClick={this.handleAddSpalte.bind(this)}>
            Zelle in zwei Spalten teilen
          </MenuItem>
          <MenuItem onClick={this.handleDeleteSpalte.bind(this)}>
            Zelle löschen
          </MenuItem>
          <MenuItem onClick={this.handleSetNumberEntry.bind(this)}>
            Zahlenwertabfrage
          </MenuItem>
          <MenuItem onClick={this.handleSetSelectEntry.bind(this)}>
            Auswahl
          </MenuItem>
          <MenuItem>
            Text eingeben:
            <EditableChip
              icon={<Icon>text_fields</Icon>}
              value={"Titel"}
              color="primary"
              variant="outlined"
              onChange={(value) => {
                this.handleSetValue(value);
              }}
              onDelete={this.handleDeleteValue.bind(this)}
            />
          </MenuItem>
        </Menu>
      </>
    );
  }
}
