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

// listinf of operations
exports.list = function (req, res) {
  console.log("req.account.id"+req.account.id)
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