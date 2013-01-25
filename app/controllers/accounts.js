var mongoose = require('mongoose')
  , Account = mongoose.model('Account')
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
  
// Create an account
exports.create = function (req, res) {
  console.log(req.body)
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
  
// Delete an account
exports.destroy = function(req, res){
  var account = req.account
  console.log('DELETING : '+account)
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
  console.log(account)
  res.render('accounts/show', {
      title: account.name
    , account: account
  })
}