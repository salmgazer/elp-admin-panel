export default class LocalInfo {
  static get keys() {
    return {
      userToken: "userToken",
    };
  }

  static get userToken() {
    return localStorage.getItem(this.keys.userToken);
  }

  static set userToken(userToken) {
    return localStorage.setItem(this.keys.userToken, userToken);
  }

  static logout() {
    localStorage.removeItem(this.keys.userToken);
    window.location.href = "/";
  }
}
