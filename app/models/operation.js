﻿// operation schema

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
  , user: {type : Schema.ObjectId, ref : 'User'}
  , account : {type : Schema.ObjectId, ref : 'Account'}
  , category : {type : Schema.ObjectId, ref : 'Category'}
  , type : {type: String, enum: ['credit', 'debit']}
  , repeat : {type: String, enum: ['once', 'daily', 'weekly', 'monthly']}
  , tags : {type: [], get: getTags, set: setTags}
  , date: {type : Date, default : Date.now}
  , balance : Number
})

mongoose.model('Operation', OperationSchema)
