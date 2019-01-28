const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
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
      const result = await user.save();
      return {
        _id: result._doc._id.toString(),
        email: result._doc.email
      };
    } catch (err) {
      throw err;
    }
  },
  login: async args => {
    const user = await User.findOne({ email: args._doc.email });
    if (!user) throw new Error("Invalid Credentials");
    const validUser = await bcrypt.compare(args._doc.password, user.password);
    if (!validUser) throw new Error("Invalid Credentials");
    const token = jwt.sign(
      { userId: user._doc._id, email: user._doc.email },
      "supersecret",
      { expiresIn: "1h" }
    );
    return { userId: user._doc._id, token: token, tokenExpiration: 1 };
  }
};
