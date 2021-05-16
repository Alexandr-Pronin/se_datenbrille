import React from "react";
import {
  Paper,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
  TextField,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { App } from "../../App";
import MailIcon from "@material-ui/icons/MailOutline";
import UserIcon from "@material-ui/icons/PersonOutline";
import FaceIcon from "@material-ui/icons/Face";
import AddUser from "@material-ui/icons/PersonAdd";
import AddIcon from "@material-ui/icons/Check";
import { WorkeeBuilder, Workee } from "../../models/workee";
import Alert from "@material-ui/lab/Alert";
import FadeIn from "react-fade-in";
import axios from "axios";
import { BackendService } from "../../backendservice";

export default class AccountView extends React.Component {
  state: { addworkee: string; error: string } = { addworkee: "", error: "" };

  handleDeleteWorkee = (workee: Workee) => {
    const index = App.user.workees.indexOf(workee);
    if (index !== -1) {
      let data = BackendService.buildWithSessionKey(
        `/workees/${workee.id}`,
        "DELETE"
      );
      axios(data)
        .then(() => {
          App.user.workees.splice(index, 1);
        })
        .catch(() => {
          this.setState({
            error: "Beim löschen des Mitarbeiters ist ein Fehler aufgetreten.",
          });
        })
        .finally(() => {
          App.update();
        });
    }
  };

  handleAddWorkee = () => {
    var name = this.state.addworkee.trim();
    if (name.length === 0) {
      this.setState({
        error: "Geben Sie zuerst den Namen des Mitarbeiters an.",
      });
      return;
    }
    if (App.user.workees.find((w) => w.name === name)) {
      this.setState({
        error: "Es existiert bereits ein Mitarbeiter mit diesem Namen.",
      });
      return;
    }
    let data = BackendService.buildWithSessionKey(
      "/workees",
      "POST",
      {},
      { name: name }
    );
    axios(data)
      .then((res) => {
        App.user.workees.push(
          new WorkeeBuilder().setName(name).setId(res.data.id).build()
        );
      })
      .catch((err) => {
        this.setState({
          error: "Beim anlegen des Mitarbeiters ist ein Fehler aufgetreten.",
        });
      })
      .finally(() => {
        this.setState({ addworkee: "" });
        App.update();
      });
  };

  handleAddWorkeeChange = (event) => {
    this.setState({ addworkee: event.target.value });
  };

  componentDidMount() {
    let data = BackendService.buildWithSessionKey("/workees", "GET");
    axios(data)
      .then((res) => {
        App.user.workees = [];
        res.data.forEach((element) => {
          App.user.workees.push(
            new WorkeeBuilder().setName(element.name).setId(element.id).build()
          );
        });
      })
      .catch((err) => {
        this.setState({
          error: "Beim abrufen der Mitarbeiter ist ein Fehler aufgetreten.",
        });
      })
      .finally(() => {
        App.update();
      });
  }

  render() {
    return (
      <FadeIn
        delay={App.config.fadeInDelay}
        transitionDuration={App.config.fadeInDuration}
      >
        <Paper className={"padding margin-top"}>
          <Snackbar
            open={this.state.error.length > 0}
            autoHideDuration={5000}
            onClose={(event?: React.SyntheticEvent, reason?: string) => {
              reason !== "clickaway" && this.setState({ error: "" });
            }}
          >
            <Alert severity="warning">{this.state.error}</Alert>
          </Snackbar>
          <h6
            className={"MuiTypography-root MuiTypography-h6"}
            style={{ lineHeight: "3rem" }}
          >
            <Badge>
              <Avatar
                style={{ border: "1px dotted black", marginRight: "0.5rem" }}
                alt={App.user.name}
                src={"/img/avatar/1.jpg"}
              />
              {App.user.unternehmen}
            </Badge>
          </h6>
          <List dense={true}>
            <ListItem>
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              <ListItemText primary={App.user.name} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary={App.user.email} />
            </ListItem>
          </List>
        </Paper>

        <Paper className={"margin-top padding"}>
          <h6
            className={"MuiTypography-root MuiTypography-h6"}
            style={{ lineHeight: "3rem" }}
          >
            Mitarbeiter
          </h6>

          {App.user.workees.length === 0 ? (
            <Typography color="textSecondary">
              Fügen Sie Mitarbeiter hinzu.
            </Typography>
          ) : (
            App.user.workees.map((workee) => {
              return (
                <Chip
                  key={`workee-${workee.id}`}
                  icon={<FaceIcon />}
                  label={workee.name}
                  onDelete={this.handleDeleteWorkee.bind(this, workee)}
                  color="secondary"
                  variant="outlined"
                  style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}
                />
              );
            })
          )}

          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <AddUser />
            </Grid>
            <Grid item>
              <TextField
                value={this.state.addworkee}
                label="Mitarbeiter hinzufügen"
                onChange={this.handleAddWorkeeChange.bind(this)}
              />
            </Grid>
            <Grid item>
              <IconButton
                aria-label="add"
                onClick={this.handleAddWorkee.bind(this)}
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </FadeIn>
    );
  }
}
