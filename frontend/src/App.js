import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventPage from "./pages/Event";
import MainNavigation from "./components/Navigation/mainNavigation";
import AuthContext from "./context/authcontext";

class App extends Component {
  state = { userId: null, token: null };
  login = (userId, token, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  login = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              userId: this.state.userId,
              token: this.state.token,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="events" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && (
                  <Route path="/bookings" component={BookingPage} />
                )}
                <Route path="/events" component={EventPage} />
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
