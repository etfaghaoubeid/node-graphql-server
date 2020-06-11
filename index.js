const express = require('express');
const graphqllHTTP = require('express-graphql');
const {buildASTSchema} =require('graphql')

const app = express();

app.listen(3000,()=>console.log("app start"))