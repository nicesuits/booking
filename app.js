const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");

const app = express();
const graphQLSchema = require("./graphql/schema");
const graphQLResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/auth");

app.use(bodyParser.json());
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
