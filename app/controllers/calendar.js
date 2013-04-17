var mongoose = require('mongoose')
  , Operation = mongoose.model('Operation')
  , ObjectId = require('mongoose').Types.ObjectId
  
// show operations
exports.show = function (req, res) {
  res.render('calendar/show', {
      title: 'calendar'
  })
}

// list operations as calendar events
exports.index = function (req, res) {
  
  Operation
    .find({ 'user' : new ObjectId(req.user.id) })
    .sort({'date': 1}) // sort by date
    .exec(function(err, operations) {
      if (err) return res.render('500')
      var events = []
      var i = 0;
      for(i;i<operations.length;i++){
        events[i] = {"title" : operations[i].name + "\n"+ operations[i].amount , "start" : operations[i].date}
      }
      res.jsonp(events)
    })

}