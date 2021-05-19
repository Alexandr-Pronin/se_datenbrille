import React from "react";
import { Paper, Tabs, Tab, AppBar, Button, Snackbar } from "@material-ui/core";
import FadeIn from "react-fade-in";
import { App } from "../../../App";
import { ProtocolParserV1 } from "../../../parser/protocolParserV1";
import ArchiveIcon from "@material-ui/icons/Archive";
import NewIcon from "@material-ui/icons/NewReleases";
import { CompletedNewProtocolsView } from "./completedNewProtocolsView";
import { CompletedArchivedProtocolsView } from "./completedArchivedProtocolsView";
import { EventBus } from "../../../eventbus";
import { BackendService } from "../../../backendservice";
import axios from "axios";
import { Protocol } from "../../../models/protocolModels/protocol";
import DeleteIcon from "@material-ui/icons/Delete";
import DownloadIcon from "@material-ui/icons/PictureAsPdf";
import { ProtocolDeleteDialog } from "./protocolDeleteDialog";
import Alert from "@material-ui/lab/Alert";

export class CompletedProtocolsView extends React.Component {
  constructor(props) {
    super(props);
    EventBus.instance.on("handleExpandedChange", (index) => {
      this.handleExpandedChange(index);
    });
    EventBus.instance
      .on("handleSelectChange", (index) => {
        this.handleSelectChange(index);
      })
      .on("updateCompletedProtocolsViewAndShowSuccessMessage", (msg) => {
        this.setState({
          selected: [],
          expanded: -1,
          showDeleteConfirmDialog: false,
          successMessage: msg,
        });
      })
      .on("updateCompletedProtocolsView", (resetSelection?: boolean) => {
        if (resetSelection) {
          this.setState({
            selected: [],
            expanded: -1,
            showDeleteConfirmDialog: false,
          });
        }
        this.forceUpdate();
      })
      .on("hideDeleteConfirmDialog", () => {
        this.setState({ showDeleteConfirmDialog: false });
      });
  }

  getIds = () => {
    let ids: number[] = [];
    App.user.protocols.completed.forEach((p: Protocol, index: number) => {
      if (this.state.selected.indexOf(index) !== -1) ids.push(p.id);
    });
    return ids;
  };

  state: {
    selected: number[];
    expanded: number;
    currentTab: number;
    showDeleteConfirmDialog: boolean;
    successMessage: string;
  } = {
    selected: [],
    expanded: -1, //was -1
    currentTab: 0,
    showDeleteConfirmDialog: false,
    successMessage: "",
  };

  handleSelectChange = (index) => {
    if (this.state.selected.indexOf(index) !== -1) {
      this.state.selected.splice(this.state.selected.indexOf(index), 1);
      this.setState({
        selected: this.state.selected,
      });
    } else {
      this.state.selected.push(index);
      this.setState({ selected: this.state.selected });
    }
  };

  handleExpandedChange = (index: number) => {
    if (this.state.expanded === index) this.setState({ expanded: -1 });
    else this.setState({ expanded: index });
  };

  render() {
    return (
      <>
        {this.state.showDeleteConfirmDialog && (
          <ProtocolDeleteDialog ids={this.getIds()} />
        )}
        <Snackbar
          open={this.state.successMessage.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({ successMessage: "" });
          }}
        >
          <Alert
            onClose={() => {
              this.setState({ successMessage: "" });
            }}
            severity="success"
          >
            {this.state.successMessage}
          </Alert>
        </Snackbar>
        <FadeIn
          delay={App.config.fadeInDelay}
          transitionDuration={App.config.fadeInDuration}
        >
          <AppBar position="relative" color="default">
            <Paper square>
              <Tabs
                value={this.state.currentTab}
                onChange={(event, newVal) => {
                  this.setState({
                    currentTab: newVal,
                    selected: [],
                    expanded: [],
                  });
                }}
                variant="fullWidth"
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="icon label tabs example"
              >
                <Tab icon={<NewIcon />} label="NEUE PROTOKOLLE" />
                <Tab icon={<ArchiveIcon />} label="ARCHIV" />
              </Tabs>
            </Paper>
          </AppBar>
          <Paper className="padding margin-top">
            <h6 className={"MuiTypography-root MuiTypography-h6"}>
              {this.state.currentTab === 0 ? (
                <>Neue Protokolle</>
              ) : (
                <>Abgelegte Protokolle</>
              )}
              <div style={{ float: "right" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  disabled={this.state.selected.length <= 0}
                  onClick={() => {
                    this.setState({ showDeleteConfirmDialog: true });
                  }}
                >
                  Auswahl löschen
                </Button>{" "}
                {this.state.currentTab === 0 && (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ArchiveIcon />}
                      disabled={this.state.selected.length <= 0}
                    >
                      Auswahl ablegen
                    </Button>{" "}
                  </>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  disabled={this.state.selected.length <= 0}
                >
                  Auswahl als .zip herunterladen
                </Button>
              </div>
            </h6>
            <div className="margin-top">
              {this.state.currentTab === 0 && (
                <CompletedNewProtocolsView
                  selected={this.state.selected}
                  expanded={this.state.expanded}
                />
              )}
              {this.state.currentTab === 1 && (
                <CompletedArchivedProtocolsView
                  selected={this.state.selected}
                  expanded={this.state.expanded}
                />
              )}
            </div>
          </Paper>
        </FadeIn>
      </>
    );
  }
}
