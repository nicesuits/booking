import React, { Component } from "react";
import AuthContext from "../context/authcontext";

class EventPage extends Component {
  state = {
    events: []
  };
  static context = AuthContext;

  constructor(props) {
    super(props);
    this.titleElement = React.createRef();
    this.descriptionElement = React.createRef();
    this.priceElement = React.createRef();
    this.dateElement = React.createRef();
  }

  confirmHandler = e => {
    e.preventDefault();
    const title = this.titleElement.current.value;
    const description = this.descriptionElement.current.value;
    const price = parseFloat(this.priceElement.current.value);
    const date = this.dateElement.current.value;

    // const event = { title, description, price, date };

    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price < 0 ||
      date.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            description: "${description}",
            {price: ${price},
            {date: "${date}") {
            _id
            title
            description
            price
            date
            createdBy {
              _id
              email
            }
          }
        }
        `
    };

    const token = this.context.token;

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(result => {
        if (result.status !== 200 || result.status !== 201)
          throw new Error("Failed request");
        return result.json();
      })
      .then(responseData => {
        this.fetchEvents();
      })
      .catch(err => console.log(err));
  };

  fetchEvents = () => {
    const requestBody = {
      query: `
        query {
          event({
            _id
            title
            description
            price
            date
            createdBy {
              _id
              email
            }
          })
        }
        `
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(result => {
        if (result.status !== 200 || result.status !== 201)
          throw new Error("Failed request");
        return result.json();
      })
      .then(responseData => {
        const events = responseData.data.events;
        this.setState({ events: events });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.fetchEvents();
  }

  render() {
    const eventList = this.state.events.map(event => {
      return <li key={event._id}>{event.title}</li>;
    });
    return (
      <div>
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor="title">title</label>
            <input
              id="title"
              type="text"
              placeholder="title"
              ref={this.titleElement}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Description"
              rows="4"
              ref={this.descriptionElement}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="text"
              placeholder="$0.00"
              ref={this.priceElement}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              placeholder="MM/DD/YYYY"
              ref={this.dateElement}
              required
            />
          </div>
          <div className="form-action">
            <button onClick={this.confirmHandler}>Confirm</button>
            <button>Cancel</button>
          </div>
        </form>
        <ul>{eventList}</ul>
      </div>
    );
  }
}

export default EventPage;
