import React from "react";
import { NavLink } from "react-router-dom";
import "./mainNavigation.css";
import AuthContext from "../../context/authcontext";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation__header">
          <div className="main-navigation__logo">
            <h1>Booking Events App</h1>
          </div>
          <div className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Sign In</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Events</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
