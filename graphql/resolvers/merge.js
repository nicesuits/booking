const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

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
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event._doc._id.toString(),
    date: dateToString(event._doc.date),
    createdBy: user.bind(this, event._doc.createdBy)
  };
};

const transformBook = result => {
  return {
    ...result._doc,
    _id: result._doc._id.toString(),
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(result._doc.createdAt),
    updatedAt: dateToString(result._doc.updatedAt)
  };
};

exports.transformBook = transformBook;
exports.transformEvent = transformEvent;
