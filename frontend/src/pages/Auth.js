import React, { Component } from "react";
import "./Auth.css";

class AuthPage extends Component {
  state = { isLogin: true };
  constructor(props) {
    super(props);
    this.emailElement = React.createRef();
    this.passwordElement = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(previousState => {
      return { isLogin: !previousState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailElement.current.value;
    const password = this.passwordElement.current.value;
    let requestBody = {
      query: `
      query {
        login(email: "${email}",password: "${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}){
            _id
            email
          }
        }
        `
      };
    }

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" }
    })
      .then(result => {
        if (result.status !== 200 || result.status !== 201)
          throw new Error("Failed request");
        return result.json();
      })
      .then(responseData => {
        if (responseData.data.login.token) {
          this.context.login(
            responseData.data.login.userId,
            responseData.data.login.token,
            responseData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            ref={this.emailElement}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            ref={this.passwordElement}
            required
          />
        </div>
        <div className="form-action">
          <button>Submit</button>
          <button onClick={this.switchModeHandler}>
            Switch to {this.isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
