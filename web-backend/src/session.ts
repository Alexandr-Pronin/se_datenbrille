import User from "./entities/user";

/**
 * This class holds all session data.
 * Session data contains the session key, the timestamp it has been created/refreshed
 * and the username and user id
 * The system checks every x minutes whether the session expired or not.
 * Sessions can be refreshed after a valid request.
 */
export default class Session {
  sessions: SessionEntry[] = [];
  lifetime: number = 60 * 60 * 1000;
  checkinterval: number = 1 * 60 * 1000;

  getSessions() {
    return this.sessions;
  }

  init() {
    var that = this;
    setInterval(function () {
      console.log(
        "Checking " + Object.entries(that.sessions).length + " session entries"
      );
      var toRemove: number[] = [];
      that.getSessions().map((entry: SessionEntry, index: number) => {
        if (new Date().getTime() - entry.timestamp > that.lifetime) {
          console.log("Session " + entry.key + " expired.");
          toRemove.push(index);
        }
      });
      toRemove.map((index: number) => {
        that.sessions.splice(index, 1);
      });
    }, this.checkinterval); //Jede 1 min
  }

  mock = (keymock: string) => {
    let user = {
      person: {
        mail: "testmail@test.de",
      },
      id: 1,
    };
    var key = keymock;
    var sessionEntry = new SessionEntry();
    sessionEntry.username = user.person.mail;
    sessionEntry.userid = user.id;
    sessionEntry.key = key;
    this.sessions.push(sessionEntry);
  };

  create = (user: User): string => {
    var key = this.genSessionKey();
    var sessionEntry = new SessionEntry();
    sessionEntry.username = user.email;
    sessionEntry.userid = user.id;
    sessionEntry.key = key;
    this.sessions.push(sessionEntry);
    return key;
  };

  refresh(key: string) {
    var entry: SessionEntry | undefined = this.get(key);
    if (entry) entry.timestamp = new Date().getTime();
  }

  get = (key: string | string[]): SessionEntry | undefined => {
    return this.sessions.find((session) => session.key === key);
  };

  genSessionKey() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export class SessionEntry {
  key: string = "";
  timestamp: number = new Date().getTime();
  username: string = "";
  userid: number;
}
