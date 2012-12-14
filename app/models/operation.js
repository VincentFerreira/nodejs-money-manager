// operation schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var getTags = function (tags) {
  return tags.join(',')
}

var setTags = function (tags) {
  return tags.split(',')
}  
  
var OperationSchema = new Schema({
    name: String
  , amount : Number
  , _user: {type : Schema.ObjectId, ref : 'User'}
  , account : {type : Schema.ObjectId, ref : 'Account'}
  , type : {type: String, enum: ['credit', 'debit']}
  , repeat : {type: String, enum: ['once', 'daily', 'weekly', 'monthly']}
  , tags : {type: [], get: getTags, set: setTags}
  , createdAt: {type : Date, default : Date.now}
  , user: {}
})

mongoose.model('Operation', OperationSchema)
