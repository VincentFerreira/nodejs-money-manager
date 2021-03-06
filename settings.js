
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongodb')
  , lingua = require('lingua')
  , mongourl

exports.boot = function(app, config, passport){
  bootApplication(app, config, passport)
    
}

// App settings and middleware

function bootApplication(app, config, passport) {

  app.set('showStackError', true)

  app.use(express.static(__dirname + '/public'))

  app.use(express.logger(':method :url :status'))

  // set views path, template engine and default layout
  app.set('views', __dirname + '/app/views')
  app.set('view options', { layout: false })
  app.set('view engine', 'jade')

  app.configure(function () {
    // dynamic helpers
    app.use(lingua(app, {
      defaultLocale: 'en',
      path: __dirname + '/i18n'
    }))
    app.use(function (req, res, next) {
      res.locals.appName = 'G.A.E.L'
      res.locals.title = 'G.A.E.L'
      res.locals.showStack = app.showStackError    
      res.locals.req = req

      res.locals.formatDate = function (date) {
        var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
      }
      res.locals.stripScript = function (str) {
        return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      }
      res.locals.createPagination = function (pages, page) {
        var url = require('url')
          , qs = require('querystring')
          , params = qs.parse(url.parse(req.url).query)
          , str = ''

        params.page = 0
        var clas = page == 0 ? "active" : "no"
        str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">First</a></li>'
        for (var p = 1; p < pages; p++) {
          params.page = p
          clas = page == p ? "active" : "no"
          str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>'
        }
        params.page = --p
        clas = page == params.page ? "active" : "no"
        str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">Last</a></li>'

        return str
      }


      next()
    })

    // cookieParser should be above session
    app.use(express.cookieParser())
    
    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

	//mongodb appfog connection
	var generate_mongo_url = function(obj){
		obj.hostname = (obj.hostname || 'localhost')
		obj.port = (obj.port || 27017)
		obj.db = (obj.db || 'test')
		if(obj.username && obj.password){
			return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db
		}
		else{
			return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db
		}
	}

	if(process.env.VCAP_SERVICES){
		var env = JSON.parse(process.env.VCAP_SERVICES)
		console.log(env)
		var mongo = env['mongodb-1.8'][0]['credentials']
		mongourl = generate_mongo_url(mongo)
	}
	else{
		mongourl = config.db
	}

	
    app.use(express.session({
      secret: 'noobjs',
      store: new mongoStore({
        url: mongourl,
        collection : 'sessions'
      })
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(express.favicon())

    //Error flash messages
    app.use(function(req, res, next){
      res.locals.messageSuccess = ''
      res.locals.messageError = ''
      if (req.session.success) {
        res.locals.messageSuccess = req.session.success
        delete req.session.success
      }
      if (req.session.error) {
        res.locals.messageError = req.session.error
        delete req.session.error
      }
      next()
    })
    
    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500')
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl })
    })

  })

  app.set('showStackError', false)

}
