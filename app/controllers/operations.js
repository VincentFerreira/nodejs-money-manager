var mongoose = require('mongoose')
  , Operation = mongoose.model('Operation')
  , ObjectId = require('mongoose').Types.ObjectId
  , _ = require('underscore')
  , moment = require('moment');
  
// show operations
exports.show = function (req, res) {
  res.render('accounts/operations', {
      title: 'operations'
    , accounts : req.accounts
  })
}

// listing of operations from account req.account.id
exports.list = function (req, res) {
  console.log("req.account.id"+req.account.id)
  Operation
    .find({ 'user._id' : new ObjectId(req.user.id), 'account' : new ObjectId(req.account.id)})
    .sort({'date': 1}) // sort by date
    .exec(function(err, operations) {
      if (err) return res.render('500')
      var balance = 0
      for(i=0;i<operations.length;i++){
        balance = balance + (operations[i].type=="credit"? operations[i].amount:-operations[i].amount)
        console.log(balance)
        console.log(operations[i])
        operations[i].balance = balance
        console.log('bal : '+operations[i].balance)
      }
      res.jsonp(operations)
    })
}

// listing of operations from all accounts of the user
exports.listall = function (req, res) {
  Operation
    .find({ 'user._id' : new ObjectId(req.user.id) })
    .sort({'date': 1}) // sort by date
    .exec(function(err, operations) {
      if (err) return res.render('500')
      var balance = 0
      for(i=0;i<operations.length;i++){
        balance = balance + (operations[i].type=="credit"? operations[i].amount:-operations[i].amount)
        console.log(balance)
        console.log(operations[i])
        operations[i].balance = balance
        console.log('bal : '+operations[i].balance)
      }
      res.jsonp(operations)
    })
}

// Create an operation
exports.create = function (req, res) {
  var operation = new Operation()
  console.log("operation, req.body : "+req.body)
  console.log("requ.body.date = "+req.body.date)
  var day = moment(req.body.date,"DD/MM/YYYY")
  req.body.date = new Date()
  req.body.date.setFullYear(day.year(),day.month(),day.date())
  console.log("requ.body.date = "+req.body.date)
  operation = _.extend(operation, req.body)
  console.log("ope.date = "+operation.date)
  operation.account = req.account
  operation.user = req.user
  
  function adjustToUTC(d) {
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d
  }

  operation.save(function(err){
    if (err) {
      console.log(err);
      return res.render('500')}
    else {
      res.send({ 'res': 'ok' })
    }
  })
}

// get an operation by id and return it as json
exports.get = function(req, res){
  res.jsonp(req.operation)
} 

// Delete an operation
exports.destroy = function(req, res){
  var operation = req.operation
  console.log('DELETING : '+operation)
  operation.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    if (err) return next(err)
    req.session.success = 'Operation deleted!';
    res.send({ 'res': 'ok' })
  })
}  

// Update operation
exports.update = function(req, res){
  console.log("operation, req.body : "+req.body)
  console.log("requ.body.date = "+req.body.date)
  var day = moment(req.body.date,"DD/MM/YYYY")
  req.body.date = new Date()
  req.body.date.setFullYear(day.year(),day.month(),day.date())
  console.log("requ.body.date = "+req.body.date)
  var operation = _.extend(req.operation, req.body)
  console.log("ope.date = "+operation.date)
  operation.account = req.account
  operation.user = req.user
  
  function adjustToUTC(d) {
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d
  }

  operation.save(function(err){
    if (err) {
      console.log(err);
      return res.render('500')}
    else {
      res.send({ 'res': 'ok' })
    }
  })
}