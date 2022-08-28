const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Question = require('./models/question.js')
const URI = process.env.MONGODB_CONNECTION_STRING

const typeDefs = gql`
type Question {
    id: ID!
    "Represents the difficulty of the question: Novice, Intermediate, or Hard"
    source: String!
    "Represents the question set (Harvard Certamen, Yale Certamen, etc.) the question was drawn from"
    difficulty: String!
    "Represents which round the question was asked in its original question set"
    round: String!
    "Represents the main, originating question for the round"
    mainQuestion: String!
    "Represents the main, originating answer for the round"
    mainAnswer: String!
    "The first follow up question for the round, if the answer to the main question was correct."
    firstFollowUpQuestion: String!
    "The answer to the first follow up question"
    firstFollowUpAnswer: String!
    "The first follow up question for the round, if the answer to the main question was correct."
    secondFollowUpQuestion: String!
    "The answer to the first follow up question"
    secondFollowUpAnswer: String!
}

  type Query {
    questionCount: Int!
    allQuestions: [Question!]!
    findQuestionsByDifficulty(difficulty: String!): [Question!]!
  }
`
mongoose.connect(URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

  const resolvers = {
    Query: {
      questionCount: async () => await Question.countDocuments({}),
      allQuestions: async () =>  {
        return Question.find({})
      },
      findQuestionsByDifficulty: async (root, args) =>
        Question.find({difficulty: args.difficulty}).exec()
    }
  }
  
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })  

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
  

