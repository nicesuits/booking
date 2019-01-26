const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");

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

module.exports = {
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
};
