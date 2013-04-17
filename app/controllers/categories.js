var mongoose = require('mongoose')
  , Category = mongoose.model('Category')

//Create a category
exports.create = function (req, res) {
  var category = new Category(req.body)
  category.save(function (err) {
    if (err) throw new Error('Error while saving comment')
  })
}

// Delete a category
exports.destroy = function(req, res){
  var category = req.category
  category.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    req.session.success = 'Category deleted!';
    res.send({ 'res': 'ok' })
  })
}

//List all caegories
exports.list = function (req, res) {
  Category
    .find({})
    .exec(function(err, categories) {
      if (err) return res.render('500')
      res.jsonp(categories)
    })
}

