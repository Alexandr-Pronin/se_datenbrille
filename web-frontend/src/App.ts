import Cookies from "universal-cookie";
import { User } from "./models/user";
import { EventBus } from "./eventbus";

class AppConfig {
  fadeInDuration: number = 0;
  fadeInDelay: number = 0;
}

export class App {
  public static user: User = new User();
  public static cookies: Cookies = new Cookies();
  public static appName: string = "DataBuddy";
  public static config: AppConfig = new AppConfig();

  public static update = () => {
    EventBus.instance.emit("updateApp");
  };
}
