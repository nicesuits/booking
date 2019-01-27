const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBook } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBook(booking);
      });
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
      return transformBook(result);
    } catch (err) {
      throw err;
    }
  },
  cancelEvent: async args => {
    try {
      const booking = await Booking.findById({ _id: args.bookingId }).populate(
        "event"
      );
      const event = {
        ...booking.event._doc,
        _id: booking._doc._id.toString(),
        createdBy: user.bind(this, event._doc.createdBy)
      };
      Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
