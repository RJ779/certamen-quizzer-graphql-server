const express = require('express')
const { graphqlHTTP } = require("express-graphql");
const app = express()
require('dotenv').config()
const schema = require('./schema/schema')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(7070, () => console.log('server running'))