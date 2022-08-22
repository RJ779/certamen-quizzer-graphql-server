const graphql = require('graphql');
const Question = require('../models/Question');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList 
} = graphql;


const QuestionType = new GraphQLObjectType({
    name: 'Question',
    description: 'this represents a certamen question',
    fields: () => ({
        id: { type: GraphQLID },
        Source: { type: GraphQLString }, 
        Difficulty: { type: GraphQLString },
        Round: { type: GraphQLString },
        ID: { type: GraphQLString },
        MainQuestion: { type: GraphQLString },
        MainAnswer: { type: GraphQLString },
        FirstFollowUpQuestion: { type: GraphQLString },
        FirstFollowUpAnswer: { type: GraphQLString },
        SecondFollowUpQuestion: { type: GraphQLString },
        SecondFollowUpAnswer: { type: GraphQLString },
    })
})


const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'root query',
    fields: {
        question: {
            type: QuestionType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Question.findById(args.id);
            }
        },
        questions: {
            type: new GraphQLList(QuestionType),
            resolve(parent, args) {
                return Question.find({});
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQueryType,
});