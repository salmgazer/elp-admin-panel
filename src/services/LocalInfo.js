export default class LocalInfo {
  static get keys() {
    return {
      userToken: "userToken",
      userNickName: "userNickname",
      userPicture: "userPicture",
      userEmail: "userEmail"
    };
  }

  static get userToken() {
    return localStorage.getItem(this.keys.userToken);
  }

  static set userToken(userToken) {
    localStorage.setItem(this.keys.userToken, userToken);
  }

  static set userNickname(nickname) {
    localStorage.setItem(this.keys.userNickName, nickname);
  }

  static get userNickname() {
    return localStorage.getItem(this.keys.userNickName)
  }

  static get userPicture() {
    return localStorage.getItem(this.keys.userPicture);
  }

  static set userPicture(pictureUrl) {
    localStorage.setItem(this.keys.userPicture, pictureUrl);
  }

  static set userEmail(email) {
    localStorage.setItem(this.keys.userEmail, email);
  }

  static get userEmail() {
    return localStorage.getItem(this.keys.userEmail);
  }

  static logout() {
    localStorage.removeItem(this.keys.userToken);
    window.location.href = "/";
  }
}
