import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventPage from "./pages/Event";
import UserPage from "./pages/User";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/bookings" component={BookingPage} />
          <Route path="/events" component={EventPage} />
          <Route path="/user" component={UserPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
