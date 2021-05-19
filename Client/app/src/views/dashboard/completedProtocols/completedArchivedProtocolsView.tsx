import React from "react";
import {
  Paper,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  FormControlLabel,
  ListItem,
  List,
  Checkbox,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { Protocol } from "../../../models/protocolModels/protocol";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Utils from "../../../utils";
import WarnIcon from "@material-ui/icons/WarningOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { EventBus } from "../../../eventbus";
import { CompletedProtocolView } from "./completedProtocolView";
import { App } from "../../../App";
import axios from "axios";
import {
  ProtocolParserV1,
  ParserError,
} from "../../../parser/protocolParserV1";
import { BackendService } from "../../../backendservice";
import Pagination from "@material-ui/lab/Pagination";

export class CompletedArchivedProtocolsView extends React.Component<{
  selected: number[];
  expanded: number;
}> {
  constructor(props) {
    super(props);
    EventBus.instance.on(
      "updateCompletedProtocolsViewAndShowSuccessMessage",
      () => {
        this.componentDidMount(this.state.page);
      }
    );
  }
  state = { loading: true, count: 0, page: 1 };

  entriesPerPage: number = 5;

  loadPage = (page: number) => {
    let data = BackendService.buildWithSessionKey(
      `/protocols/archived/${
        page * this.entriesPerPage - this.entriesPerPage
      }/${this.entriesPerPage}`,
      "GET"
    );
    axios(data)
      .then((res) => {
        App.user.protocols.completed = [];
        res.data.forEach((protocolData) => {
          //console.log(protocolData);
          let protocol: Protocol | ParserError = new ProtocolParserV1({
            protocol: protocolData.protocol,
          }).parse();
          console.log(protocol);
          if (!(protocol instanceof Protocol)) {
            console.log(protocol);
          } else {
            protocol.id = protocolData.id;
            protocol.archived = true;
            protocol.metadata.completionDate = new Date(
              Date.parse(protocolData.protocol.metadata.completionDate)
            );
            protocol.metadata.receiptDate = new Date(
              Date.parse(protocolData.protocol.metadata.receiptDate)
            );
            App.user.protocols.completed.push(protocol);
          }
        });
        this.setState({ page: page });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = async (page?: number) => {
    App.user.protocols.completed = [];
    let data = BackendService.buildWithSessionKey(
      "/protocols/archived/count",
      "GET"
    );
    await axios(data)
      .then((res) => {
        this.setState({ count: res.data.count });
      })
      .catch((error) => {
        console.log(error);
      });
    this.loadPage(
      page !== undefined && page > 0 && page <= this.calcPageCount() ? page : 1
    );
  };

  handleChangePage = (event, page) => {
    this.loadPage(page);
  };

  calcPageCount = () => {
    return Math.floor((this.state.count - 1) / this.entriesPerPage) + 1;
  };

  render() {
    return (
      <>
        <>{this.state.count} Ergebnisse.</>
        <div className="margin-top">
          {App.user.protocols.completed.map(
            (protocol: Protocol, index: number) => {
              return (
                <ExpansionPanel
                  variant={"outlined"}
                  key={`completed-protocol-${index}`}
                  expanded={this.props.expanded === index}
                  style={{ backgroundColor: "rgba(87, 49, 88, 0.1)" }}
                >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls={`additional-actions${index}-content`}
                    id={`additional-actions${index}-header`}
                    onClick={() => {
                      EventBus.instance.emit("handleExpandedChange", index);
                    }}
                  >
                    <List style={{ width: "100%", padding: "0", margin: "0" }}>
                      <ListItem style={{ padding: "0", margin: "0" }}>
                        <FormControlLabel
                          aria-label="Titel"
                          style={{ width: "auto" }}
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={
                            <Checkbox
                              checked={
                                this.props.selected.indexOf(index) !== -1
                              }
                              onClick={() => {
                                EventBus.instance.emit(
                                  "handleSelectChange",
                                  index
                                );
                              }}
                            />
                          }
                          label={
                            <>
                              {protocol.metadata.label}
                              {protocol.metadata.completionDate !== null && (
                                <Typography
                                  color={"textSecondary"}
                                  variant={"subtitle2"}
                                >
                                  {Utils.dateToString(
                                    protocol.metadata.completionDate
                                  )}
                                </Typography>
                              )}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          {!protocol.isValid() && (
                            <>
                              <Chip
                                avatar={<WarnIcon />}
                                label={"Erfordert Überprüfung"}
                              />
                            </>
                          )}
                          <IconButton
                            aria-label="download-pdf"
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            color={"secondary"}
                          >
                            <FontAwesomeIcon icon={"file-pdf"} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <CompletedProtocolView protocol={protocol} index={index} />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            }
          )}
          <Pagination
            page={this.state.page}
            onChange={this.handleChangePage.bind(this)}
            count={this.calcPageCount()}
            variant="outlined"
            color="secondary"
            style={{ marginTop: "1rem" }}
          />
        </div>
      </>
    );
  }
}
