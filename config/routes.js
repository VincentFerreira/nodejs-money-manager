
var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , User = mongoose.model('User')
  , Account = mongoose.model('Account')
  , Operation = mongoose.model('Operation')
  , async = require('async')
  , ObjectId = require('mongoose').Types.ObjectId

module.exports = function (app, passport, auth) {

  /*
   * USER ROUTES
   */ 
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
  app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        
        Account
            .find({ 'user._id' : new ObjectId(user.id) })
            .exec(function (err, accounts) {
                if (err) return next(err)
                if (!accounts) return next(new Error('Failed to load Accounts for user ' + id))
                req.accounts = accounts
                next() 
        })
      })
  })

  /*
   * ACCOUNT ROUTES
   */ 
  var accounts = require('../app/controllers/accounts')
  app.get('/users/:userId/accounts', auth.requiresLogin, auth.user.hasAuthorization, accounts.resume) // accounts resume
  app.get('/users/:userId/accounts/all', auth.requiresLogin, auth.user.hasAuthorization, accounts.list) // accounts list
  app.post('/users/:userId/account/', auth.requiresLogin, auth.user.hasAuthorization, accounts.create) // add account
  app.put('/users/:userId/accounts/:accountId', auth.requiresLogin, auth.account.hasAuthorization, accounts.update) //update account settings
  app.del('/users/:userId/accounts/:accountId', auth.requiresLogin, auth.account.hasAuthorization, accounts.destroy) //delete account
  app.get('/users/:userId/accounts/:accountId/balance', auth.requiresLogin, auth.account.hasAuthorization, accounts.balance) //get account balance

  
  /*
   * OPERATION ROUTES
   */ 
  var operations = require('../app/controllers/operations')
  app.get('/users/:userId/accounts/:accountId/operations', auth.requiresLogin, auth.account.hasAuthorization, operations.show) 
  //get all the operations from account of id :accountId
  app.get('/users/:userId/accounts/:accountId/operationList', auth.requiresLogin, auth.account.hasAuthorization, operations.list)
  //get all the operations from all accounts of the user
  app.get('/users/:userId/accounts/all/operationsList', auth.requiresLogin, auth.user.hasAuthorization, operations.listall)
  app.get('/users/:userId/accounts/:accountId/operation/:opId', auth.requiresLogin, auth.user.hasAuthorization, operations.get)
  app.post('/users/:userId/accounts/:accountId/operation', auth.requiresLogin, auth.account.hasAuthorization, operations.create) 
  app.put('/users/:userId/accounts/:accountId/operation/:opId', auth.requiresLogin, auth.account.hasAuthorization, operations.update)
  app.del('/users/:userId/accounts/:accountId/operation/:opId', auth.requiresLogin, auth.account.hasAuthorization, operations.destroy)
  
  /*
   * GRAPH ROUTES
   */ 
  var graphs = require('../app/controllers/graphs')
  app.get('/users/:userId/accounts/:accountId/graphs', auth.requiresLogin, auth.account.hasAuthorization, graphs.show)   
  
  /*
   * CALENDAR ROUTES
   */ 
  var calendar = require('../app/controllers/calendar')
  app.get('/users/:userId/calendar', auth.requiresLogin, auth.user.hasAuthorization, calendar.show) //render calendar view
  app.get('/users/:userId/events', auth.requiresLogin, auth.user.hasAuthorization, calendar.index) //list operations user as calendar events
  
  /*
   * SETTINGS ROUTES
   */ 
  var settings = require('../app/controllers/settings')
  app.get('/users/:userId/accounts/:accountId/settings', auth.requiresLogin, auth.account.hasAuthorization, settings.show)   
  app.get('/users/:userId/settings', auth.requiresLogin, auth.user.hasAuthorization, settings.showGeneral)   
  
  /*
   * CATEGORIES ROUTES
   */ 
  var categories = require('../app/controllers/categories')
  app.get('/categories', auth.requiresLogin, categories.list)
  app.get('/users/:userId/categories', auth.requiresLogin, auth.account.hasAuthorization, categories.list)
  app.post('/users/:userId/categories', auth.requiresLogin, auth.account.hasAuthorization, categories.create)
  app.del('/users/:userId/categories', auth.requiresLogin, auth.account.hasAuthorization, categories.destroy)
  
  app.param('accountId', function (req, res, next, id) {
    Account.findOne({ _id : id })
      .exec(function (err, account) {
        if (err) return next(err)
        if (!account) return next(new Error('Failed to load Account ' + id))
        req.account = account
        next()
      })
  })
  
  app.param('opId', function (req, res, next, id) {
    Operation.findOne({ _id : id })
      .exec(function (err, operation) {
        if (err) return next(err)
        if (!operation) return next(new Error('Failed to load Operation ' + id))
        req.operation = operation
        next()
      })
  })


/*
 * SAMPLE ROUTES (to keep in view)
 *
 */
  
  
  // article routes
  var articles = require('../app/controllers/articles')
  app.get('/articles', articles.index)
  app.get('/articles/new', auth.requiresLogin, articles.new)
  app.post('/articles', auth.requiresLogin, articles.create)
  app.get('/articles/:id', articles.show)
  app.get('/articles/:id/edit', auth.requiresLogin, auth.article.hasAuthorization, articles.edit)
  app.put('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.update)
  app.del('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy)

  app.param('id', function(req, res, next, id){
    Article
      .findOne({ _id : id })
      .populate('user', 'name') //ajoute a l'article trouvé l'objet user avec seulement sa valeur de 'name'
      .populate('comments') // ajoute les objets comments à l'article trouvé
      .exec(function (err, article) {
        if (err) return next(err)
        if (!article) return next(new Error('Failed to load article ' + id))
        req.article = article

        var populateComments = function (comment, cb) {
          User
            .findOne({ _id: comment._user })
            .select('name')
            .exec(function (err, user) {
              if (err) return next(err)
              comment.user = user
              cb(null, comment)
            })
        }

        if (article.comments.length) {
          async.map(req.article.comments, populateComments, function (err, results) {
            next(err)
          })
        }
        else
          next()
      })
  })

  // NEWS ROUTE
  app.get('/news', function(req,res){
    res.render('news', {
      title: 'G.A.E.L News'
    })
  })
  
  // home route
  app.get('/', function(req,res){
	res.render('index', {
		title: 'G.A.E.L'
	})
  })

  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
