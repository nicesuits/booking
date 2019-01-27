import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventPage from "./pages/Event";
import UserPage from "./pages/User";
import MainNavigation from "./components/Navigation/mainNavigation";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="auth" exact />
              <Route path="/auth" component={AuthPage} />
              <Route path="/bookings" component={BookingPage} />
              <Route path="/events" component={EventPage} />
              <Route path="/user" component={UserPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
