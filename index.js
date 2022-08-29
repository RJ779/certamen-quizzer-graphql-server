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
    twentyQuestions: [Question!]!
    twentyQuestionsBySourceOrDifficulty(source: String, difficulty: String): [Question!]!
    uniqueSources: [String!]!
    uniqueDifficulties: [String!]!
  }
`

// to do: add enum for difficulties 

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
      twentyQuestions: async () =>  {
        return Question.aggregate([{ $sample: { size: 20 } }])
      },
      twentyQuestionsBySourceOrDifficulty: async (root, args) => {
        if (args.difficulty && args.source) {
          return Question.find({difficulty: args.difficulty, source: args.source}).limit(20).exec()
        } else if (args.difficulty) {
          return Question.aggregate([{$match: {difficulty: args.difficulty}}, { $sample: { size: 20 } }])
        } else if (args.source) {
          return Question.find({source: args.source}).limit(20).exec()
        } else {
          return []
        }
      },
      uniqueSources: async () => {
        return Question.distinct("source")
      },
      uniqueDifficulties: async () => {
        return Question.distinct("difficulty")
      },
    }
  }
  
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })  

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });
  

