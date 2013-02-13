/* Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport')

require('express-namespace')

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./authorization')
  , mongourl

//mongodb appfog connection
var generate_mongo_url = function(obj){
	obj.hostname = (obj.hostname || 'localhost')
	obj.port = (obj.port || 27017)
	obj.db = (obj.db || 'test')
	if(obj.username && obj.password){
		return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db
	}
	else{
		return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db
	}
}

if(process.env.VCAP_SERVICES){
	var env = JSON.parse(process.env.VCAP_SERVICES)
	console.log(env)
	var mongo = env['mongodb-1.8'][0]['credentials']
	mongourl = generate_mongo_url(mongo)
}
else{
	mongourl = config.db
}


  
// Bootstrap db connection
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
mongoose.connect(mongourl)

// Bootstrap models
var models_path = __dirname + '/app/models'
  , model_files = fs.readdirSync(models_path)
model_files.forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config
require('./config/passport').boot(passport, config)

var app = express()                                       // express app
require('./settings').boot(app, config, passport)         // Bootstrap application settings

// Bootstrap routes
require('./config/routes')(app, passport, auth)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)
