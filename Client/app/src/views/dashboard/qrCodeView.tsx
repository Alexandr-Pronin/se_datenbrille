import React from "react";
import { Badge, Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { Device } from "../../models/device";
var QRCode = require("qrcode.react");

export class QRCodeView extends React.Component<{
  device?: Device;
  loading: boolean;
}> {
  render() {
    return (
      <>
        {this.props.loading ? (
          <>
            <Badge />
          </>
        ) : (
          <>
            {!!this.props.device ? (
              <>
                <QRCode
                  value={this.props.device.devicecode}
                  style={{ margin: "0 auto", display: "block" }}
                />
                <Alert severity={"info"} style={{ marginTop: "1rem" }}>
                  <AlertTitle>Hinweis</AlertTitle>
                  <p>
                    Achten Sie darauf, dass Ihre Brille mit dem Internet
                    verbunden ist.
                  </p>
                  <p>
                    Wenn Sie den Code zu einem früheren Zeitpunkt bereits
                    gescannt haben, können Sie einfach sofort auf weiter
                    klicken.
                  </p>
                </Alert>
              </>
            ) : (
              <Alert severity={"warning"}>
                Es konnte kein Gerät erstellt werden. Bitte lade die Seite neu.
              </Alert>
            )}
          </>
        )}
      </>
    );
  }
}
