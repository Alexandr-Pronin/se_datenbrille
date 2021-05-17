import React from "react";
import FadeIn from "react-fade-in";
import { App } from "../../../App";
import {
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  List,
  ListItem,
  FormControlLabel,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Icon,
} from "@material-ui/core";
import AddFileIcon from "@material-ui/icons/Add";
import EditLabelIcon from "@material-ui/icons/LabelOutlined";
import { CoverLoader } from "../../../components/coverLoader";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import Utils from "../../../utils";
import { ProtocolTemplate } from "../../../models/protocolModels/protocolTemplate";
import { EventBus } from "../../../eventbus";
import NewTemplateForm from "./newTemplateForm";
import { BackendService } from "../../../backendservice";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { TemplateDeleteDialog } from "./templateDeleteDialog";
import { EditTemplateView } from "./editTemplateView";
import { FloatingButton } from "../../../components/floatingButton";
import { ProtocolParserV1 } from "../../../parser/protocolParserV1";
import { Protocol } from "../../../models/protocolModels/protocol";
import { LabelEditor } from "./labelEditor";
import { Label } from "../../../models/label";
import { LabelChip } from "../../../components/labelChip";

export default class ProtocolTemplatesView extends React.Component {
  constructor(props) {
    super(props);
    EventBus.instance
      .on("updateTemplatesView", () => {
        this.forceUpdate();
      })
      .on("closeTemplateEditView", () => {
        this.setState({ editTemplateId: -1 });
      });
  }
  state = {
    editTemplateId: -1, //TODO set to -1
    loading: true,
    error: "",
    showError: false,
  };

  handleDownloadClicked = (filename: string, id?: number) => {
    if (!id) return;
    let data = BackendService.buildWithSessionKey(
      `/templatetopdf/${id}`,
      "GET"
    );
    data.responseType = "blob";
    this.setState({ loading: true });
    axios(data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {})
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleNewTemplateClicked = () => {
    EventBus.instance.emit("openNewTemplateForm");
  };

  componentDidMount = async () => {
    let data = BackendService.buildWithSessionKey(
      "/protocols/templates",
      "GET"
    );
    await axios(data)
      .then((res) => {
        App.user.protocols.templates = [];
        res.data.map((template, index) => {
          let protocol = new ProtocolParserV1({
            protocol: template.protocol,
          }).parse();
          //console.log(protocol);
          if (!(protocol instanceof Protocol)) {
            console.log(protocol);
            this.setState({
              error: "Ein fehlerhaftes Template konnte nicht geladen werden.",
              showError: true,
            });
          } else {
            template.protocol = protocol;
            App.user.protocols.templates.push(
              ProtocolTemplate.fromJSON(template)
            );
            App.user.protocols.templates[index].createdAt = new Date(
              Date.parse(template.createdAt)
            );
          }
          return index;
        });
        this.setState({
          loading: false,
          ///*TODO: remove the following*/ editTemplateId: 27,
        });
      })
      .catch((error) => {
        this.setState({
          error: "Daten konnten nicht abgefragt werden.",
          showError: true,
        });
      });
  };

  lbl1 = new Label();

  render() {
    this.lbl1.name = "Testlabel";
    this.lbl1.details = "Labeldetails";
    this.lbl1.id = 1;
    this.lbl1.color = "blue";
    return (
      <>
        <NewTemplateForm />
        <TemplateDeleteDialog />
        <LabelEditor />
        <Snackbar
          open={this.state.showError}
          autoHideDuration={5000}
          onClose={(event?: React.SyntheticEvent, reason?: string) => {
            reason !== "clickaway" && this.setState({ showError: false });
          }}
        >
          <Alert severity="warning">{this.state.error}</Alert>
        </Snackbar>
        {this.state.editTemplateId !== -1 ? (
          <EditTemplateView id={this.state.editTemplateId} />
        ) : (
          <>
            <FloatingButton onclick={this.handleNewTemplateClicked.bind(this)}>
              <AddFileIcon style={{ marginRight: "0.75rem" }} />
              Neue Vorlage
            </FloatingButton>
            <FloatingButton
              onclick={() => {
                EventBus.instance.emit("openLabelEditor");
              }}
              left={true}
            >
              <EditLabelIcon style={{ marginRight: "0.75rem" }} />
              Labels
            </FloatingButton>
            <FadeIn
              delay={App.config.fadeInDelay}
              transitionDuration={App.config.fadeInDuration}
            >
              <Paper className={"margin-top padding"}>
                {this.state.loading && <CoverLoader />}
                <h6 className={"MuiTypography-root MuiTypography-h6"}>
                  Protokollvorlagen
                </h6>
                {App.user.protocols.templates.length === 0 && (
                  <Typography color={"textSecondary"} variant={"subtitle2"}>
                    Fügen Sie Ihr erstes Tempalte hinzu, indem Sie unten rechts
                    auf <strong>+ NEUE VORLAGE</strong> klicken.
                  </Typography>
                )}
                {App.user.protocols.templates.map(
                  (template: ProtocolTemplate, index: number) => {
                    let protocol = template.protocol;
                    return (
                      <List
                        key={"ptl-" + index}
                        style={{ width: "100%", padding: "0", margin: "0" }}
                      >
                        <ListItem
                          button
                          onClick={() => {
                            this.setState({
                              editTemplateId: template.id,
                            });
                          }}
                        >
                          <div>
                            {protocol.metadata.label}
                            <br />
                            <Typography
                              color={"textSecondary"}
                              variant={"subtitle2"}
                            >
                              {template.createdAt && (
                                <>
                                  erstellt am{" "}
                                  {Utils.dateToString(template.createdAt)}
                                </>
                              )}
                            </Typography>
                          </div>
                          <LabelChip label={this.lbl1} />
                          {template.protocol.labels.map(
                            (label: Label, index: number) => {
                              return (
                                <LabelChip
                                  key={"lblchip-" + index}
                                  label={label}
                                />
                              );
                            }
                          )}
                          <ListItemSecondaryAction>
                            <IconButton
                              aria-label="download-pdf"
                              onClick={(event) => {
                                event.stopPropagation();
                                this.handleDownloadClicked(
                                  template.protocol.metadata.label,
                                  template.id
                                );
                              }}
                              onFocus={(event) => event.stopPropagation()}
                              color={"primary"}
                            >
                              <Icon style={{ color: "black" }}>get_app</Icon>
                            </IconButton>
                            <IconButton
                              aria-label="delete-template"
                              onClick={(event) => {
                                EventBus.instance.emit(
                                  "showTemplateDeleteDialog",
                                  index
                                );
                                event.stopPropagation();
                              }}
                              onFocus={(event) => event.stopPropagation()}
                              color={"secondary"}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    );
                  }
                )}
              </Paper>
            </FadeIn>
          </>
        )}
      </>
    );
  }
}
