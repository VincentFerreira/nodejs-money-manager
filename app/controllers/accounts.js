// TODO correction des erreurs crashantes + suivi des erreurs : voir si il n'y a pas d'amelioration a faire ici :
//au niveau de resume : if (err) return next(err) et if (!accounts) return next(new Error('Failed to load Accounts for user ' + id))
//verifier que ce n'est pas cela qui fait fort crasher
var mongoose = require('mongoose')
  , Account = mongoose.model('Account')
  , Operation = mongoose.model('Operation')
  , ObjectId = require('mongoose').Types.ObjectId
  , _ = require('underscore')
  , async = require('async')
  
  
var getAccountBalance = function getAccountBalance(account,callback) {
  Operation.find( { 'account' : new ObjectId(account.id), 'date': {$lt: new Date()} })
  //.populate(operation , category=...).exec... for cat' balances ? or for a special date ...
  .exec(function(err,operations) { 
    var balance = 0
    for(i=0;i<operations.length;i++){
      balance = balance + (operations[i].type=="credit"? operations[i].amount:-operations[i].amount)
      operations[i].balance = parseFloat(balance).toFixed(2) 
    }
    var res = { 'balance': balance }
    account.balance = balance
    callback(res)
  }) 
}  
  
// resume accounts
exports.resume = function (req, res) {
  Account.find({ 'user._id' : new ObjectId(req.user.id) })
  .exec(function (err, accounts) {
    if (err) return next(err)
    if (!accounts) return next(new Error('Failed to load Accounts for user ' + id))
    
    res.render('accounts/resume', {
            page:'resume'
          , title: 'resume'
          , accounts: accounts
        })
  })
}

// listing of accounts from user
exports.list = function (req, res) {
  Account.find({ 'user._id' : new ObjectId(req.user.id) })
    .exec(function(err, accounts) {
      if (err) return res.render('500')
      for(i=0;i<accounts.length;i++){
        getAccountBalance(accounts[i], function(balance) {
          accounts[i].balance = balance
          console.log(accounts)
        })
      }
      res.jsonp(accounts)
    })
}
  
// Create an account
exports.create = function (req, res) {
  var account = new Account(req.body)
  account.user = req.user
  account.save(function(err){
    if (err) return next(err)
    res.redirect('/users/'+req.user.id+'/accounts/'+account.id+'/operations')
  })
}  
  
// Update account
exports.update = function(req, res){
  var account = req.account

  account = _.extend(account, req.body)

  account.save(function(err, doc) {
    if (err) {
      res.render('accounts/settings', {
        title: 'operations'
        , accounts : req.accounts
        , errors: err.errors
      })
    }
    else {
      res.redirect('/users/'+req.user.id+'/accounts/'+req.account.id+'/settings')
    }
  })
}
  
// Delete an account and, if the user is the only owner, all operations attached
exports.destroy = function(req, res){
  var account = req.account
  Operation.remove( { 'account' : new ObjectId(account.id)} , function(err,res) { console.log(res) })
  account.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    if (err) return next(err)
    req.session.success = 'Account deleted!';
    res.redirect('/users/'+req.user.id+'/accounts')
  })
}

//account balance at the day of today
exports.balance = function(req, res){
  var account = req.account
  getAccountBalance(account, function(balance) {
    res.send(balance)
  })
}


// show account
exports.show = function (req, res) {
  var account = req.account
  res.render('accounts/show', {
      title: account.name
    , account: account
  })
}