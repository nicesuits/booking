import React, { Component } from "react";
import "./Auth.css";

class AuthPage extends Component {
  render() {
    return (
      <form className="auth-form">
        <div className="form-control">
          <lable htmlFor="email">Email</lable>
          <input id="email" type="email" placeholder="Email" />
        </div>
        <div className="form-control">
          <lable htmlFor="password">Password</lable>
          <input id="password" type="password" placeholder="Password" />
        </div>
        <div className="form-action">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
