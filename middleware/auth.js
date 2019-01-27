const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authheader = req.get("Authorization");
  if (!authheader) {
    req.isAuth = false;
    return next();
  }
  const token = authheader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  const decodedToken = jwt.verify(token, "supersecret");
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
