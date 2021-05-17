import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import LoginPageView from "./views/login/loginPageView";
import DashboardPageView from "./views/dashboard/dashboardPageView";
import { EventBus } from "./eventbus";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import Auth from "./auth";

export class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    EventBus.instance.on("updateApp", () => {
      this.forceUpdate();
    });
  }
  render() {
    return (
      <>
        <ContinuosCheckBackendConnection />
        <Router>
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/login" exact component={LoginPageView} />
            <Route path="/impressum" exact component={Impressum} />

            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </>
    );
  }
}

function Impressum() {
  return (
    <div>
      <h2>Impressum</h2>
    </div>
  );
}

function MainPage() {
  if (!Auth.isLoggedIn()) {
    return <LoginPageView />;
  }
  return <DashboardPageView />;
}

function NotFoundPage() {
  return (
    <>
      Seite konnte nicht gefunden werden.
      <br />
      <Link to="/">Zurück</Link>
    </>
  );
}

class ContinuosCheckBackendConnection extends React.Component {
  state = { error: false };
  render() {
    return this.state.error ? (
      <>
        <Dialog
          fullWidth
          open={this.state.error}
          onClose={() => {}}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Backend error..</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    ) : null;
  }
}
