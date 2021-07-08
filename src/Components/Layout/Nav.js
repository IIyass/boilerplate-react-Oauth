import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Navigation = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, rgb(214, 0, 0), rgb(57, 0, 0));
  height: 3rem;
  border-radius: 2rem;
  a {
    color: white;
    font-size: 1.2rem;
    font-weight: 700;

    text-decoration: none;
  }
  ul li {
    display: inline;
  }
  button {
    width: 5%;
    height: 2rem;
  }
`;

export default class Nav extends React.Component {
  render() {
    const {
      logout,
      login,
      isAuthenticated,
      userHascopes,
      isUserAdmin,
    } = this.props.auth;
    return (
      <Navigation>
        <ul>
          <li>
            {" "}
            <Link to="/">Home</Link>
          </li>

          <li>
            {" "}
            <button onClick={isAuthenticated() ? logout : login}>
              {isAuthenticated() ? logout : login}
            </button>
          </li>
          <li>
            <Link to="/public">Public</Link>
          </li>
          {isAuthenticated() && (
            <li>
              <Link to="/private">Private</Link>
            </li>
          )}
          {isAuthenticated() && userHascopes(["read:courses"]) && (
            <li>
              <Link to="/course">Courses</Link>
            </li>
          )}
          {isAuthenticated() && isUserAdmin() && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </Navigation>
    );
  }
}
