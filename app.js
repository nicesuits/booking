const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");

const app = express();
const graphQLSchema = require("./graphql/schema");
const graphQLResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/auth");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(isAuth);

app.use(
  "/",
  graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
  })
);

mongoose
  .connect("mongodb://localhost:27017/events")
  .then(() => {
    app.listen(3001);
  })
  .catch(err => console.log(err));
