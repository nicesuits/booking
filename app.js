const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");

const app = express();
const graphQLSchema = require("./graphql/schema");
const graphQLResolvers = require("./graphql/resolvers");

app.use(bodyParser.json());

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
    app.listen(3000);
  })
  .catch(err => console.log(er));
