import React from "react";
import { Protocol } from "../../../models/protocolModels/protocol";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import FaceIcon from "@material-ui/icons/Face";
import TimeIcon from "@material-ui/icons/AccessTime";
import DeleteIcon from "@material-ui/icons/Delete";
import Utils from "../../../utils";
import { ProtocolSelectEntry } from "../../../models/protocolModels/protocolSelectEntry";
import ProtocolTableEntry from "../../../models/protocolModels/protocolTableEntry";
import { ProtocolNumberEntry } from "../../../models/protocolModels/protocolNumberEntry";
import { ProtocolNumberEntryView } from "../entryViews/protocolNumberEntryView";
import { ProtocolSelectEntryView } from "../entryViews/protocolSelectEntryView";
import axios from "axios";
import { BackendService } from "../../../backendservice";
import { EventBus } from "../../../eventbus";
import { ProtocolEntry } from "../../../models/protocolModels/protocolEntry";

interface CompletedProtocolViewProps {
  protocol: Protocol;
  index: number;
}

export class CompletedProtocolView extends React.Component<
  CompletedProtocolViewProps
> {
  archiveProtocol = () => {
    let data = BackendService.buildWithSessionKey(
      `/protocols/archive/${this.props.protocol.id}`,
      "GET"
    );
    axios(data)
      .then((res) => {
        EventBus.instance.emit(
          "updateCompletedProtocolsViewAndShowSuccessMessage",
          "Protokoll archiviert."
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Card variant={"outlined"}>
            <CardMedia
              style={{ backgroundSize: "4rem", minHeight: "5rem" }}
              image="/img/protocol.svg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography
                align={"center"}
                gutterBottom
                variant="h5"
                component="h2"
              >
                {this.props.protocol.metadata.label}
              </Typography>
              <List dense={true}>
                <ListItem>
                  <ListItemIcon>
                    <FaceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={this.props.protocol.metadata.creator}
                    secondary={"Mitarbeiter"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      this.props.protocol.metadata.completionDate !== null
                        ? Utils.dateTimeToString(
                            this.props.protocol.metadata.completionDate,
                            true
                          )
                        : "Keine Angabe"
                    }
                    secondary={"Aufnahmezeitpunkt"}
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" color="secondary" startIcon={<DeleteIcon />}>
                Löschen
              </Button>
              {!this.props.protocol.archived && (
                <Button
                  size="small"
                  color="primary"
                  startIcon={<CheckIcon />}
                  onClick={this.archiveProtocol.bind(this)}
                >
                  Protokoll ablegen
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        <Grid item lg md sm xs>
          {this.props.protocol.entries.map(
            (entry: ProtocolEntry, index: number) => {
              return (
                <Paper
                  variant={"outlined"}
                  className={"protocol-entry-container"}
                  key={`protocol-entry-${index}`}
                >
                  {entry instanceof ProtocolNumberEntry && (
                    <ProtocolNumberEntryView entry={entry} />
                  )}
                  {entry instanceof ProtocolSelectEntry && (
                    <ProtocolSelectEntryView entry={entry} />
                  )}
                  {entry instanceof ProtocolTableEntry && <></>}
                </Paper>
              );
            }
          )}
        </Grid>
      </Grid>
    );
  }
}
