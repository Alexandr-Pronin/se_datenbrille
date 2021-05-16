export default class Utils {
  /**
   * @param date Date object
   * @returns string in format dd.MM.yy
   */
  public static dateToString = (date: Date): string => {
    let day: string = Utils.appendZero(date.getDate());
    let month: string = Utils.appendZero(date.getMonth() + 1);
    let year: string = date.getFullYear() + "";

    return `${day}.${month}.${year}`;
  };

  /**
   * @param date Date object
   * @param noSeconds Whether to show seconds or not
   * @param delimiter the char between date and time, default: whitespace
   * @returns string in format dd.MM.yy HH:mm[:ss]
   */
  public static dateTimeToString = (
    date: Date,
    noSeconds?: boolean,
    delimiter?: string
  ): string => {
    delimiter = delimiter || " ";
    let dateString: string = Utils.dateToString(date);
    let hours: string = Utils.appendZero(date.getHours());
    let minutes: string = Utils.appendZero(date.getMinutes());
    let seconds: string = Utils.appendZero(date.getSeconds());
    let timeString: string = noSeconds
      ? `${hours}:${minutes}`
      : `${hours}:${minutes}:${seconds}`;

    return `${dateString}${delimiter}${timeString}`;
  };

  public static appendZero(val: number | string): string {
    return val < 10 ? "0" + val : "" + val;
  }

  public static isObject(obj) {
    var type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
  }

  public static copyObject(src): any {
    let target = {};
    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        if (Utils.isObject(src[prop])) {
          target[prop] = Utils.copyObject(src[prop]);
        } else {
          target[prop] = src[prop];
        }
      }
    }
    return target;
  }
}
