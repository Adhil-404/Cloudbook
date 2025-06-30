const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    coverImage: {
          type: String,
        required: true
    }


})

module.exports = mongoose.model('book', BookSchema)