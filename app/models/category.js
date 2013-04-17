// operation schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var CategorySchema = new Schema({
    name: String
})

mongoose.model('Category', CategorySchema)
