// TODO correction des erreurs crashantes + suivi des erreurs : voir si il n'y a pas d'amelioration a faire ici :
//au niveau de resume : if (err) return next(err) et if (!accounts) return next(new Error('Failed to load Accounts for user ' + id))
//verifier que ce n'est pas cela qui fait fort crasher
var mongoose = require('mongoose')
  , Account = mongoose.model('Account')
  , Operation = mongoose.model('Operation')
  , ObjectId = require('mongoose').Types.ObjectId
  , _ = require('underscore')
  
  
// resume accounts
exports.resume = function (req, res) {
  Account.find({ 'user._id' : new ObjectId(req.user.id) })
      .exec(function (err, accounts) {
        if (err) return next(err)
        if (!accounts) return next(new Error('Failed to load Accounts for user ' + id))
        res.render('accounts/resume', {
            title: 'resume'
          , accounts: accounts
        })
      })
}

// listing of accounts from user
exports.list = function (req, res) {
  Account.find({ 'user._id' : new ObjectId(req.user.id) })
    .exec(function(err, accounts) {
      if (err) return res.render('500')
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
  
// show account
exports.show = function (req, res) {
  var account = req.account
  res.render('accounts/show', {
      title: account.name
    , account: account
  })
}