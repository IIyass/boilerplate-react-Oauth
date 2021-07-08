import React from "react";
class Callback extends React.Component {
  componentDidMount() {
    // Handle authentification if expected values are in the URL.
    if (/acces_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  }

  render() {
    return <h1>Loading ...</h1>;
  }
}

export default Callback;
