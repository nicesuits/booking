const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: (args, req) => {
    if (!req.isAuth) throw new Error("[ERROR]: Unauthenticated");
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: parseFloat(args.eventInput.price),
      date: dateToString(args.eventInput.date),
      createdBy: req.userId
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = transformEvent(result);
        return User.findById(req.userId);
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
  }
};
