const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      _id: user._doc._id.toString(),
      email: user._doc.email,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        createdBy: user.bind(this, event._doc.createdBy)
      };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          createdBy: user.bind(this, event._doc.createdBy),
          _id: event._doc._id.toString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async argas => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking._doc._id.toString(),
          createdAt: new Date(booking._doc.createdAt).toISOString,
          updatedAt: new Date(booking._doc.updatedAt).toISOString
        };
      });
    } catch (err) {
      throw err;
    }
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
          date: new Date(event._doc.date).toISOString(),
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
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = user.save();
      return {
        _id: result._doc._id.toString(),
        email: result._doc.email
      };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const existingEvent = await Event.findOne({
        _id: args.eventId
      });
      if (existingEvent) {
        throw new Error("User exists");
      }
      const booking = new Booking({
        user: "5c4cb247c8723883b891dee3",
        password: existingEvent
      });
      const result = await booking.save();
      const result = user.save();
      return {
        ...result._doc,
        _id: result._doc._id.toString(),
        createdAt: new Date(result._doc.createdAt).toISOString,
        updatedAt: new Date(result._doc.updatedAt).toISOString
      };
    } catch (err) {
      throw err;
    }
  }
};
