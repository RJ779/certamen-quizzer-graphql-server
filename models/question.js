const Mongoose = require("mongoose")

const QuestionSchema = new Mongoose.Schema({
    Source: {  
        type: String,
        required: true 
    }, 
    Difficulty: {  
        type: String,
        required: true 
    }, 
    Round: {  
        type: String,
        required: true 
    }, 
    ID: {  
        type: String,
        required: true 
    }, 
    MainQuestion: {  
        type: String,
        required: true 
    }, 
    MainAnswer: {  
        type: String,
        required: true 
    }, 
    FirstFollowUpQuestion: {  
        type: String,
        required: true 
    }, 
    FirstFollowUpAnswer: {  
        type: String,
        required: true 
    }, 
    SecondFollowUpQuestion: {  
        type: String,
        required: true 
    }, 
    SecondFollowUpAnswer: {  
        type: String,
        required: true 
    }, 
})

const Question = Mongoose.model('Question', QuestionSchema, 'questions')
module.exports = Question