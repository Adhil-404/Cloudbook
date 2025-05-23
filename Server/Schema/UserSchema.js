const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    unique: true,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  age: {
    type:String,
    required: true
  },

  // Gender: {
  //   type: String,
  //   required: true

  // },

  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('user', userSchema)