import React from "react";
import {
  Zoom,
  Paper,
  IconButton,
  Icon,
  Drawer,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { App } from "../../../App";
import { EventBus } from "../../../eventbus";
import AddFileIcon from "@material-ui/icons/Add";
import { FloatingButton } from "../../../components/floatingButton";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";
import { ProtocolNumberEntry } from "../../../models/protocolModels/protocolNumberEntry";
import { ProtocolEntryEditNumberView } from "../entryViews/protocolEntryEditNumberView";
import ProtocolTableEntry from "../../../models/protocolModels/protocolTableEntry";
import { ProtocolSelectEntry } from "../../../models/protocolModels/protocolSelectEntry";
import { ProtocolNumberEntryView } from "../entryViews/protocolNumberEntryView";
import { ProtocolSelectEntryView } from "../entryViews/protocolSelectEntryView";
import { CoverLoader } from "../../../components/coverLoader";
import { BackendService } from "../../../backendservice";
import axios from "axios";
import { ProtocolEntryEditSelectView } from "../entryViews/protocolEntryEditSelectView";
import { ProtocolTableEntryView } from "../entryViews/protocolTableEntryView";
import { ProtocolEntry } from "../../../models/protocolModels/protocolEntry";
import { ProtocolEntryEditTableView } from "../entryViews/protocolEntryEditTableView";

export class EditTemplateView extends React.Component<{ id: number }> {
  constructor(props) {
    super(props);
    EventBus.instance.on("updateEditTemplateView", () => {
      this.setState({ editEntry: undefined });
    });
  }
  state: {
    drawerOpen: boolean;
    editEntry?: ProtocolNumberEntry | ProtocolSelectEntry | ProtocolTableEntry;
    loading: boolean;
  } = {
    drawerOpen: false,
    editEntry: undefined,
    loading: false,
  };

  template: ProtocolTemplate = new ProtocolTemplate();

  //TODO remove this method
  componentDidMount() {
    this.setState({ editEntry: this.template.protocol.entries[0] });
  }

  hideDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  showDrawer = () => {
    this.setState({ drawerOpen: true });
  };

  handleAddField = (type: "number" | "select" | "table") => {
    if (type === "number") {
      this.setState({ editEntry: new ProtocolNumberEntry() });
    }
    if (type === "select") {
      this.setState({ editEntry: new ProtocolSelectEntry() });
    }
    if (type === "table") {
      this.setState({ editEntry: new ProtocolTableEntry() });
    }
    this.hideDrawer();
  };

  handleEditField = (entry: ProtocolEntry) => {
    this.setState({ editEntry: entry });
  };

  handleDeleteEntry = (index: number) => {
    let newObj: any = JSON.parse(JSON.stringify(this.template));
    newObj.protocol.entries.splice(index, 1);
    let data = BackendService.buildWithSessionKey(
      "/protocols/templates",
      "POST",
      {},
      newObj
    );
    this.setState({ loading: true });

    axios(data)
      .then(() => {
        this.template.protocol.entries.splice(index, 1);
      })
      .catch((error) => {
        //console.log(ProtocolTemplate.fromJSON(backup));
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    this.template = App.user.protocols.templates.find(
      (t) => t.id === this.props.id
    )!;
    console.log(this.template);
    return (
      <>
        {this.state.editEntry !== undefined && (
          <>
            {this.state.editEntry instanceof ProtocolNumberEntry && (
              <ProtocolEntryEditNumberView
                entry={this.state.editEntry!}
                template={this.template}
              />
            )}
            {this.state.editEntry instanceof ProtocolSelectEntry && (
              <ProtocolEntryEditSelectView
                entry={this.state.editEntry!}
                template={this.template}
              />
            )}
            {this.state.editEntry instanceof ProtocolTableEntry && (
              <ProtocolEntryEditTableView
                entry={this.state.editEntry!}
                template={this.template}
              />
            )}
          </>
        )}
        <FloatingButton onclick={this.showDrawer.bind(this)}>
          <AddFileIcon style={{ marginRight: "1rem" }} />
          Element einfügen
        </FloatingButton>
        <Zoom
          timeout={App.config.fadeInDuration}
          in
          style={{
            transitionDelay: `${App.config.fadeInDuration}ms`,
          }}
          unmountOnExit
        >
          <Paper className={"margin-top padding"}>
            <h6 className={"MuiTypography-root MuiTypography-h6"}>
              <IconButton
                aria-label="edit-template"
                onClick={() => {
                  EventBus.instance.emit("closeTemplateEditView");
                }}
                onFocus={(event) => event.stopPropagation()}
                color={"secondary"}
              >
                <Icon style={{ color: "black" }}>arrow_back_ios</Icon>
              </IconButton>
              Protokollvorlage bearbeiten:{" "}
              {this.template.protocol.metadata.label}
            </h6>

            <List>
              {this.state.loading && <CoverLoader />}
              {this.template && this.template.protocol.entries.length === 0 && (
                <Typography color={"textSecondary"} variant={"subtitle2"}>
                  Fügen Sie ein Element hinzu, indem Sie unten rechts auf +
                  ELEMENT HINZUFÜGEN klicken.
                </Typography>
              )}
              {this.template && this.template.protocol.entries.length > 0 && (
                <Typography color={"textSecondary"} variant={"subtitle2"}>
                  Klicken Sie auf ein Element, um es zu bearbeiten.
                </Typography>
              )}
              {this.template &&
                this.template.protocol.entries.map(
                  (entry: ProtocolEntry, index: number) => {
                    return (
                      <ListItem
                        button
                        onClick={this.handleEditField.bind(this, entry)}
                        key={index}
                      >
                        <ListItemIcon>
                          <Icon>
                            {entry instanceof ProtocolNumberEntry && (
                              <>looks_3</>
                            )}
                            {entry instanceof ProtocolSelectEntry && (
                              <>check_box</>
                            )}
                            {entry instanceof ProtocolTableEntry && (
                              <>table_chart</>
                            )}
                          </Icon>
                        </ListItemIcon>
                        <ListItemText>
                          {entry instanceof ProtocolNumberEntry && (
                            <ProtocolNumberEntryView
                              entry={entry}
                              noChecks
                              noValue
                            />
                          )}
                          {entry instanceof ProtocolSelectEntry && (
                            <ProtocolSelectEntryView
                              entry={entry}
                              noChecks
                              noValue
                            />
                          )}
                          {entry instanceof ProtocolTableEntry && (
                            <ProtocolTableEntryView entry={entry} />
                          )}
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={this.handleDeleteEntry.bind(this, index)}
                          >
                            <Icon>delete</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  }
                )}
            </List>
          </Paper>
        </Zoom>
        <Drawer
          anchor={"right"}
          open={this.state.drawerOpen}
          onClose={this.hideDrawer.bind(this)}
        >
          {
            <MenuList>
              <MenuItem onClick={this.handleAddField.bind(this, "number")}>
                <ListItemIcon>
                  <Icon>looks_3</Icon>
                </ListItemIcon>
                <Typography variant="inherit">Zahlenwertabfrage</Typography>
              </MenuItem>
              <MenuItem onClick={this.handleAddField.bind(this, "select")}>
                <ListItemIcon>
                  <Icon>check_box</Icon>
                </ListItemIcon>
                <Typography variant="inherit">Auswahl</Typography>
              </MenuItem>
              <MenuItem onClick={this.handleAddField.bind(this, "table")}>
                <ListItemIcon>
                  <Icon>table_chart</Icon>
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                  Tabelle
                </Typography>
              </MenuItem>
            </MenuList>
          }
        </Drawer>
      </>
    );
  }
}
