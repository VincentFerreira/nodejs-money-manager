var mongoose = require('mongoose')
  , Account = mongoose.model('Account')
  
  
// show account
exports.show = function (req, res) {
  var account = req.account
  console.log(account)
  res.render('accounts/show', {
      title: account.name
    , account: account
  })
}