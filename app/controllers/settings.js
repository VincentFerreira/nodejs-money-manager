var mongoose = require('mongoose')
  
// show settings
exports.show = function (req, res) {
  console.log(req.accounts)
  res.render('accounts/settings', {
      title: 'operations'
    , accounts : req.accounts
  })
}

