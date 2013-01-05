var mongoose = require('mongoose')
  , Operation = mongoose.model('Operation')
  
// show operations
exports.show = function (req, res) {
  console.log(req.accounts)
  res.render('accounts/operations', {
      title: 'operations'
    , accounts : req.accounts
  })
}