const Mongoose = require("mongoose")

const QuestionSchema = new Mongoose.Schema({
    source: {  
        type: String,
        required: true 
    }, 
    difficulty: {  
        type: String,
        required: true 
    }, 
    round: {  
        type: String,
        required: true 
    }, 
    id: {  
        type: String,
        required: true 
    }, 
    mainQuestion: {  
        type: String,
        required: true 
    }, 
    mainAnswer: {  
        type: String,
        required: true 
    }, 
    firstFollowUpQuestion: {  
        type: String,
        required: true 
    }, 
    firstFollowUpAnswer: {  
        type: String,
        required: true 
    }, 
    secondFollowUpQuestion: {  
        type: String,
        required: true 
    }, 
    secondFollowUpAnswer: {  
        type: String,
        required: true 
    }, 
})

const Question = Mongoose.model('Question', QuestionSchema, 'questions')
module.exports = Question
