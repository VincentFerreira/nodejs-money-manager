var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Account = mongoose.model('Account')

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  })
}

// sign up
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up'
  })
}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

// session
exports.session = function (req, res) {
  res.redirect('/users/'+req.user.id+'/accounts')
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) return res.render('users/signup', { errors: err.errors })
    //first account creation  
    var account = new Account({name:'my first account'})
    account.user = user
    account.save(function (err) {
      if (err) return res.render('users/signup', { errors: err.errors })
    })
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

// show profile
exports.show = function (req, res) {
  var user = req.profile
  console.log('user : '+user)
  res.render('users/show', {
      title: user.username
    , user: user
  })
}
