const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Question = require('./models/Question.js')
const TimeTrialQuestion = require('./models/TimeTrialQuestion.js')

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
    "Multiple choice answers, optional"
    MCAnswers: [String]
}

type TimeTrialQuestion {
  id: ID!
  "The source from which the question has been drawn"
  source: String!
  "The category to which the question belongs"
  category: String!
  "The question"
  question: String!
  "The correct answer to the question"
  answer: String!
  "The soonest an answerer can be sure that they can answer the question - the optimal word to buzz in on."
  optimalWord: String!
  "Multiple choice answers, optional"
  MCAnswers: [String]
}

  type Query {
    questionCount: Int!
    allQuestions: [Question!]!
    twentyQuestions: [Question!]!
    twentyTimeTrialQuestionsByCategory(category: String): [TimeTrialQuestion!]!
    twentyQuestionsBySourceOrDifficulty(source: String, difficulty: String): [Question!]!
    twentyMCQuestionsBySourceOrDifficulty(source: String, difficulty: String): [Question!]!
    getMultipleChoiceAnswers: [String!]!
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
      twentyMCQuestionsBySourceOrDifficulty: async (root, args) => {
        if (args.difficulty && args.source) {
          const questions = await Question.find({difficulty: args.difficulty, source: args.source}).limit(20).exec()
          const questionsForMC = await Question.aggregate([{ $sample: {size: 180} }])
          const answers = questionsForMC.map((question, index) => (index < 60) ? question.mainAnswer : (index < 120) ? question.firstFollowUpAnswer : question.secondFollowUpAnswer)
          for (const question of questions) {
            question["MCAnswers"] = answers.splice(0, 9)
           }
           return questions

          } else if (args.difficulty) {
          const questions = await Question.aggregate([{$match: {difficulty: args.difficulty}}, { $sample: { size: 20 } }])
          const questionsForMC = await Question.aggregate([{ $sample: {size: 180} }])
          const answers = questionsForMC.map((question, index) => (index < 60) ? question.mainAnswer : (index < 120) ? question.firstFollowUpAnswer : question.secondFollowUpAnswer)
         for (const question of questions) {
          question.MCAnswers = answers.splice(0, 9)
         }
         return questions
        } else if (args.source) {
          const questions = await Question.find({source: args.source}).limit(20).exec()
          const questionsForMC = await Question.aggregate([{ $sample: {size: 180} }])
          const answers = questionsForMC.map((question, index) => (index < 60) ? question.mainAnswer : (index < 120) ? question.firstFollowUpAnswer : question.secondFollowUpAnswer)
         for (const question of questions) {
          question.MCAnswers = answers.splice(0, 9)
         }
         return questions
        } else {
          return []
        }
      },
      twentyTimeTrialQuestionsByCategory: async (root, args) => {
          const questions = await TimeTrialQuestion.find({category: args.category}).limit(20).exec()
          const questionsForMC = await TimeTrialQuestion.aggregate([{ $match: { category: args.category } }, { $sample: {size: 60} }])
          const answers = questionsForMC.map(question => question.answer)
          for (const question of questions) {
            question["MCAnswers"] = answers.splice(0, 3)
           }
          return questions
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
  

