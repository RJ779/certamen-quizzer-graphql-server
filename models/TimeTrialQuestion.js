const Mongoose = require("mongoose")

const TimeTrialQuestionSchema = new Mongoose.Schema({
    source: {  
        type: String,
        required: true 
    }, 
    category: {  
        type: String,
        required: true 
    }, 
    question: {  
        type: String,
        required: true 
    }, 
    answer: {  
        type: String,
        required: true 
    }, 
    optimalWord: {  
        type: String,
        required: true 
    }, 
})

const TimeTrialQuestion = Mongoose.model('TimeTrialQuestion', TimeTrialQuestionSchema, 'questions-time-trial')
module.exports = TimeTrialQuestion