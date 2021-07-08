import React from "react";
import { Link } from "react-router-dom";

export default class Home extends React.Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <>
        Home sweet Home
        {isAuthenticated() ? (
          <Link to="/profil">View Profil</Link>
        ) : (
          <button onClick={login}>Log In</button>
        )}
      </>
    );
  }
}
