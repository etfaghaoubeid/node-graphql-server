const express = require('express');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql')
const schema = require('./schemas/user')

const app = express();
app.use("/graphql", expressGraphQL({
    schema:schema,
    graphiql: true,
}))

app.listen(7777,()=>console.log("app start"))