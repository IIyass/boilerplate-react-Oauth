import auth0 from "auth0-js";

export default class Auth {
  constructor(history) {
    // Passing React Router history in . So Auth can perform redirects.
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid rofil email read:courses";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE, // here we protect "localhost:3001" by sending an access token to this audience.
      responseType: "token id_token", // Give us a JWT token to authenticate the user when they login.
      scope: this.requestedScopes, // openid: standard claims (iss,sub,aud,exp,nb..).
      // When the user signs up, they'll be presented with consent screen so they can sonsent to us using this data.
    });
  }

  login = () => {
    this.auth0.authorize();
  };
  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expire_at");
    localStorage.removeItem("id_token");
    localStorage.removeItem("scopes");
    this.userProfile = null;
    // Delete Our info just in browser we need to treat it in our server .
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000", // set this in dashboard.
    });
  };
  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      // parsHash is destructing our URL that contain JWT token

      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push("/");
      } else {
        this.history.push("/");
        alert(`Error:${err.error}.Check the console for more details`);
      }
    });
  };

  setSession = (authResult) => {
    //set the time that token will expire
    const expireAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime() // Calcul unix epoch time when the token will expire
    );
    const scopes = authResult.scope || this.requestedScopes || "";

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("expire_at", expireAt);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("scopes", JSON.stringify(scopes));
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expire_at"));
    return new Date().getTime() < expiresAt;
  }

  getAccesToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }
    return accessToken;
  };

  getProfile = (cb) => {
    if (this.userProfile) return cb(this.userProfile);
    // this userInfo endpoint is part of Oauth standard.
    this.auth0.client.userInfo(this.getAccesToken(), (err, profil) => {
      if (profil) this.userProfile = profil;
      cb(profil, err);
    });
  };

  userHascopes(scopes) {
    const grantedScopes = (
      JSON.parse(localStorage.getItem("scopes")) || ""
    ).split(" ");
    return scopes.every((scope) => grantedScopes.includes(scope));
  }
  // Decoding Access_token to get access to custum claims (Roles)
  parseJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  isUserAdmin = () => {
    const accessToken = this.getAccesToken();
    return (
      this.parseJwt(accessToken)["http://localhost:3000/roles"][0] === "admin"
    );
  };
}
