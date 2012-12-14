// account schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var AccountSchema = new Schema({
    name: String
  , amount : Number
  , _user: {type : Schema.ObjectId, ref : 'User'}
  , user: {}
})

mongoose.model('Account', AccountSchema)
