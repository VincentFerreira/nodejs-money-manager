var mongoose = require('mongoose')
  , Operation = mongoose.model('Operation')
  
// show operations
exports.show = function (req, res) {
  res.render('calendar/show', {
      title: 'operations'
  })
}