import Auth from "./auth";

export class ApiPath {
  checkSession: string = "/checksession";
  login: string = "/login";
}

export class BackendService {
  private static _TIMEOUT: number = 1000;
  private static _BASEURL: string = "";
  private static _APIPATH: ApiPath = new ApiPath();

  public static config = () => {
    return new BackendService();
  };

  public baseURL = (val: string) => {
    BackendService._BASEURL = val;
    return this;
  };

  public timeout = (val: number) => {
    BackendService._TIMEOUT = val;
    return this;
  };

  public static get baseurl(): string {
    return BackendService._BASEURL;
  }

  public static get path(): ApiPath {
    return BackendService._APIPATH;
  }

  /**
   * @param error response
   * @returns Error message
   */
  public static extractErrorText = (error) => {
    let str = "Unbekannter Fehler";
    if (error.response) {
      // Request made and server responded
      str = error.response.status;
    } else if (error.request) {
      // The request was made but no response was received
      str = "No Response";
    } else {
      // Something happened in setting up the request that triggered an Error
      str = error.message;
    }
    return str;
  };

  /**
   * @param url The api path, e.g. /api/login
   * @param method Request method: GET, POST, DELETE
   * @param params URL-parameters
   * @param body Request data
   * @returns Axios config object
   */
  public static buildWithSessionKey: any = (
    url: string,
    method: "GET" | "POST" | "DELETE",
    params?: Object,
    body?: Object
  ) => {
    return {
      url: url,
      method: method,
      baseURL: BackendService.baseurl,
      headers: {
        session_key: Auth.getSessionKey(),
      },
      params: params ? params : {},
      data: body ? body : {},
      timeout: BackendService._TIMEOUT,
    };
  };

  /**
   * @param username unencoded username
   * @param password unencoded password
   * @returns Axios config object with Basic Auth (Base64)
   */
  public static buildBasicAuthRequest = (
    username: string,
    password: string
  ): any => {
    //Axios automatically creates Basic Auth Header (Authorization: Basic lkOADASOGuwuiaDHd==)
    return {
      url: BackendService.path.login,
      method: "get",
      baseURL: BackendService.baseurl,
      headers: {},
      params: {},
      auth: {
        username: username,
        password: password,
      },
      timeout: BackendService._TIMEOUT,
    };
  };
}
