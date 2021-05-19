import { App } from "./App";
import axios from "axios";
import { EventBus } from "./eventbus";
import { BackendService as BS } from "./backendservice";
import { UserBuilder } from "./models/user";

export default class Auth {
  private static _SESSION_COOKIE_PATH = "/";
  private static _SESSION_COOKIE_NAME = "session_key";

  public static isLoggedIn() {
    return !!App.cookies.get("session_key");
  }

  public static logout() {
    App.cookies.remove("session_key", { path: Auth._SESSION_COOKIE_PATH });
    EventBus.instance.emit("updateApp");
  }

  public static getSessionKey() {
    const session_key = App.cookies.get(Auth._SESSION_COOKIE_NAME);
    return session_key ? session_key : "";
  }

  public static checkSession() {
    var promise = new Promise((resolve, reject) => {
      if (Auth.isLoggedIn()) {
        var config = BS.buildWithSessionKey(BS.path.checkSession, "GET");
        axios(config).then(
          (res) => {
            if (res.status !== 200) {
              Auth.logout();
              reject("any");
            } else resolve();
          },
          (error) => {
            Auth.logout();
            reject("Session probably expired");
          }
        );
      } else {
        reject("Cookie not set");
      }
    });
    return promise;
  }

  public static attempt = (email, password) => {
    var promise = new Promise((resolve, reject) => {
      var config = BS.buildBasicAuthRequest(email, password);
      axios(config).then(
        (res) => {
          if (res.status === 200) {
            App.cookies.set(Auth._SESSION_COOKIE_NAME, res.data.session_key, {
              path: Auth._SESSION_COOKIE_PATH,
            });
            App.user = new UserBuilder()
              .setVorname(res.data.user.firstname)
              .setNachname(res.data.user.lastname)
              .setUnternehmen("Leipziger Verkehrsbetriebe")
              .setEmail(res.data.user.email)
              .build();

            resolve();
          } else reject();
        },
        (error) => {
          var msg = "";
          if (
            error.response !== undefined &&
            error.response.status !== undefined
          ) {
            if (error.response.status === 401)
              msg = "Nutzername oder Passwort falsch.";
            else msg = "Es ist ein Fehler aufgetreten.";
          } else {
            msg = "Verbindungsfehler";
          }
          Auth.logout();
          reject(msg);
        }
      );
    });
    return promise;
  };

  public static mock(key: string) {
    App.cookies.set(Auth._SESSION_COOKIE_NAME, key, {
      path: Auth._SESSION_COOKIE_PATH,
    });
  }
}
