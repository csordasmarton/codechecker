import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  private cookieName = "__ccPrivilegedAccessToken";

  saveToken(token: string, days: number | undefined) {
    let expires = "";
    if (!days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie = `${this.cookieName}=${token}${expires}`;
  }

  removeToken() {
    document.cookie = `${this.cookieName}=;
      expires=Thu, 01 Jan 1970 00:00:01 GMT`
  }

  getToken() {
    var value = "; " + document.cookie;
    var parts = value.split("; " + this.cookieName + "=");
    if (parts.length == 2) return parts.pop().split(";").shift().trim();
  }

  hasToken() {
    return this.getToken().length !== 0;
  }
}