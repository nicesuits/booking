import React from "react";
import { NavLink } from "react-router-dom";
import "./mainNavigation.css";

const mainNavigation = props => (
  <header className="main-navigation__header">
    <div className="main-navigation__logo">
      <h1>Booking Events App</h1>
    </div>
    <div className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Sign In</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Events</NavLink>
        </li>
      </ul>
    </div>
  </header>
);

export default mainNavigation;
