import * as React from "react";
import { render } from "react-dom";
import { EventBus } from "./eventbus";
import { App } from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { AppRouter } from "./AppRouter";
import Auth from "./auth";
import { DeviceBuilder } from "./models/device";
import { UserBuilder } from "./models/user";
import { BackendService } from "./backendservice";

library.add(fas);
library.add(fab);

/**
 * Global configuration
 * */
//if (process.env.NODE_ENV !== "production")
//BackendService.config().baseURL("http://127.0.0.1:3001/web").timeout(6000);
//else
BackendService.config()
  .baseURL("https://teambrille.herokuapp.com/web")
  .timeout(6000);

App.config.fadeInDuration = 200;
App.config.fadeInDelay = 100;

/**
 * Mocked values, for testing only
 * */
/*App.user = new UserBuilder()
  .setVorname("Angela")
  .setNachname("Merkel")
  .setUnternehmen("Leipziger Verkehrsbetriebe")
  .setEmail("nutzername@test.de")
  .build();
*/

App.user.devices.push(
  new DeviceBuilder().setCode("HIZG-BAFD-W867-BAWG").setName("Brille-1").build()
);

/**
 * Sets session key cookie to value test
 * REMOVE IN PRODUCTION
 */
//Auth.mock("test");

/**
 * Renders the app and then checks the session.
 * If it expired, the application will re-render
 * and the user will be asked to log in again.
 */
function renderApp() {
  render(<AppRouter />, document.getElementById("root"));
  if (Auth.isLoggedIn()) {
    Auth.checkSession()
      .then((success) => {})
      .catch((error) => {
        if (error === "Session probably expired") {
          EventBus.instance.emit("updateApp");
        }
      });
  }
}

EventBus.instance
  .on("changeProperty", (path: string, value: any) => {
    if (path) {
      let pathElements = path.split(".");
      let object: any = App;

      while (pathElements.length > 1) {
        object = object[pathElements.shift()!];
      }

      object[pathElements[0]] = value;
    }
    console.log("path: " + path + " value: " + value);
    renderApp();
  })
  .on("updateApp", () => {
    renderApp();
  });

export default renderApp();
