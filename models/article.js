const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    author: {
        type: String, 
        required: true
    }, 
    title: {
        type: String, 
        required: true, 
        trim: true, 
        unique: true
    }, 
    slug: {
        type: String, 
        required: true, 
        trim: true, 
        unique: true
    },
    content: {
        type: String, 
        required: true, 
        trim: true
    }, 
    created_at: {
        type: Date, 
        default: Date.now
    }, 
    updated_at: {
        type: Date, 
        required: false
    }

})

module.exports = mongoose.model('Article', articleSchema)