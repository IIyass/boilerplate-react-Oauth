import React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Home from "./Components/Home";
import Profil from "./Components/Profil";
import Nav from "./Components/Layout/Nav";
import Auth from "./Components/Auth";
import styled from "styled-components";
import Callback from "./Components/Callback";
import Public from "./Components/Public";
import Courses from "./Components/Courses";
import Private from "./Components/Private";
import Admin from "./Components/Admin";

const Body = styled.div`
width=80%;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
  }
  render() {
    return (
      <BrowserRouter>
        <Nav auth={this.auth} />
        <Body>
          <Route
            path="/"
            exact
            render={(props) => <Home auth={this.auth} {...props} />}
          />
          <Route
            path="/callback"
            render={(props) => <Callback auth={this.auth} {...props} />}
          />
          <Route path="/public" component={Public} />
          <Route
            path="/private"
            render={(props) =>
              this.auth.isAuthenticated ? (
                <Private auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />

          <Route
            path="/course"
            render={(props) =>
              this.auth.isAuthenticated &&
              this.auth.userHascopes(["read:courses"]) ? (
                <Courses auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            path="/profil"
            exact
            render={(props) =>
              this.auth.isAuthenticated ? (
                <Profil auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            path="/admin"
            exact
            render={(props) =>
              this.auth.isAuthenticated && this.auth.isUserAdmin() ? (
                <Admin auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </Body>
      </BrowserRouter>
    );
  }
}
