var mongoose = require('mongoose')
  
// show account settings
exports.show = function (req, res) {
  console.log(req.accounts)
  res.render('accounts/settings', {
      title: 'operations'
    , accounts : req.accounts
  })
}

// show user settings
exports.showGeneral = function (req, res) {
  res.render('users/settings', {
      title: 'settings'
  })
}

