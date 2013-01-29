var mongoose = require('mongoose')
  , Operation = mongoose.model('Operation')
  , ObjectId = require('mongoose').Types.ObjectId
  , _ = require('underscore')
  
// show operations
exports.show = function (req, res) {
  res.render('accounts/operations', {
      title: 'operations'
    , accounts : req.accounts
  })
}

// listinf of operations
exports.list = function (req, res) {
  console.log("req.account.id"+req.account.id);
  Operation
    .find({ 'user._id' : new ObjectId(req.user.id), 'account' : new ObjectId(req.account.id)})
    .sort({'date': 1}) // sort by date
    .exec(function(err, operations) {
      if (err) return res.render('500')
      res.jsonp(operations)
    })
}

// Create an operation
exports.create = function (req, res) {
  var operation = new Operation()
  console.log("operation, req.body : "+req.body)
  operation = _.extend(operation, req.body)
  console.log("operation : "+operation)
  operation.account = req.account
  operation.user = req.user
  operation.date = new Date(req.body.date);
  console.log("unformated : "+req.body.date);
  console.log(new Date(req.body.date));
  operation.save(function(err){
    if (err) {next(err)}
    else {
      res.send({ 'res': 'ok' })
    }
  })
}  