const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const Event = require("./models/event");
const User = require("./models/user");

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        _id: user._doc._id.toString(),
        email: user._doc.email,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          createdBy: user.bind(this, event._doc.createdBy)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

app.use(bodyParser.json());

app.use(
  "/",
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        createdBy: User!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }
    
      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }

      input UserInput {
        email: String!
        password: String!
      }
    
      type RootQuery {
        events: [Event!]! 
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }
    
      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return {
                ...event._doc,
                _id: event._doc._id.toString(),
                createdBy: user.bind(this, event._doc.createdBy)
              };
            });
          })
          .catch(err => {
            throw err;
          });
      },

      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: parseFloat(args.eventInput.price),
          date: new Date(args.eventInput.date),
          createdBy: "5c4cb247c8723883b891dee3"
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = {
              ...result._doc,
              _id: result._doc._id.toString(),
              createdBy: user.bind(this, result._doc.createdBy)
            };
            return User.findById(result._doc.createdBy);
          })
          .then(user => {
            if (!user) {
              throw new Error("User not found");
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {
        return User.findOne({ email: args.userInput.email })
          .then(user => {
            if (user) {
              throw new Error("User exists");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return {
              _id: result._doc._id.toString(),
              email: result._doc.email
            };
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect("mongodb://localhost:27017/events")
  .then(() => {
    app.listen(3000);
  })
  .catch(err => console.log(er));
