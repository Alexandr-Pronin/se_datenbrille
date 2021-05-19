import React from "react";
import { Paper, Container, Tab, Tabs, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoadingButton } from "../../components/loadingButton";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { BackendService } from "../../backendservice";
import Auth from "../../auth";
import { EventBus } from "../../eventbus";

export default class LoginPageView extends React.Component {
  state: {
    loading: boolean;
    email: string;
    password: string;
    error: string;
  } = {
    loading: false,
    email: "",
    password: "",
    error: "",
  };

  attemptLogin = () => {
    this.setState({ loading: true, error: "" });
    Auth.attempt(this.state.email, this.state.password)
      .then((res) => {
        EventBus.instance.emit("updateApp");
      })
      .catch((msg) => {
        this.setState({ error: msg });
      })
      .finally(() => this.setState({ loading: false }));
  };

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  render() {
    return (
      <div className={"main-background"}>
        <div className={"login-container"}>
          <Paper square className={"login"}>
            <Tabs
              value={0}
              onChange={() => {}}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="secondary"
              aria-label="icon label login register tabs"
            >
              <Tab
                icon={<FontAwesomeIcon icon={"paper-plane"} />}
                label="LOGIN"
              />
            </Tabs>
            <br />
            <br />
            <Container>
              {this.state.error.length > 0 && (
                <Alert severity={"warning"}>{this.state.error}</Alert>
              )}
              <br />
              <TextField
                label="E-Mail Adresse"
                fullWidth
                onChange={this.handleChangeEmail.bind(this)}
              />
              <br />
              <br />
              <TextField
                type="password"
                label="Passwort"
                fullWidth
                onChange={this.handleChangePassword.bind(this)}
              />
              <br />
              <br />
              <LoadingButton
                style={{ float: "right" }}
                onClick={this.attemptLogin.bind(this)}
                loading={this.state.loading}
              >
                Einloggen
              </LoadingButton>
              <br />
              <br />
            </Container>
          </Paper>
        </div>
      </div>
    );
  }
}
