var mongoose = require('mongoose')
  , Account = mongoose.model('Account')
  , ObjectId = require('mongoose').Types.ObjectId
  
  
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
  
// show account
exports.show = function (req, res) {
  var account = req.account
  console.log(account)
  res.render('accounts/show', {
      title: account.name
    , account: account
  })
}