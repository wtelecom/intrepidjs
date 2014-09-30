/**
 * Module dependencies.
 */

var express = require('express'),
    favicon = require('serve-favicon'),
    expressStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    busboy = require('connect-busboy'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session),
    redis = require("redis"),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    rek = require('rekuire'),
    routescan = require('express-routescan'),
    db = require('mongoose'),
    passport = require('passport'),
    i18n = require("i18n"),
    i18nRoutes = require("i18n-node-angular"),
    oAuth2Provider = require('oauth2-provider').OAuth2Provider,
    mubsub = require('mubsub'),
    nodemailer = require('nodemailer'),
    settings = require('./settings'),
    checkSiteSetting = rek('libs/check_site_settings'),
    loadResources = rek('libs/load_resources'),
    loadSiteParams = rek('libs/load_site_params'),
    loadWidgets = rek('libs/load_widgets'),
    loadModules = rek('libs/load_modules'),
    loadCustomMiddlewares = rek('middlewares/custom_data');

// Initializing passport
var localStrategy = require('passport-local').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    APIKeyStrategy = require('passport-localapikey').Strategy,
    passportStrategies = rek('utils/passport_strategies');

// Initializing Express
var app = express();

// Initializing Static Files
settings.staticFiles(app);

// Initializing oAuth provider
var myOAP = new oAuth2Provider(
    {
        crypt_key: 'test',
        sign_key: 'test2'
    }
);

// Setting environment vars
app.set('env', 'development');
app.set('port', settings.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//app.use(favicon());
//app.use(morgan());
//app.use(bodyParser({keepExtensions:true, uploadDir: path.join(__dirname,'/public/files')}));
app.use(bodyParser(
    {
        limit: 10 * 1024 * 1024
    }
));
app.use(busboy(
    {
        highWaterMark: 2 * 1024 * 1024,
        limits: {
            fileSize: 10 * 1024 * 1024
        }
    }
));
app.use(express.query());
app.use(methodOverride());
app.use(cookieParser(settings.secret));
//app.use(session({ secret: settings.secret }));
app.use(
    session(
        {
            store: new redisStore(
                {
                    host: 'localhost',
                    port: 6379
                }
            ),
            secret: settings.secret
        }
    )
);

// Initializing oAuth methods
app.use(myOAP.oauth());
app.use(myOAP.login());

// Initializing Passport middlewares
app.use(passport.initialize());
//app.use(passport.initialize({ userProperty: 'currentUser' }));
app.use(passport.session());

// Initializing i18n
i18n.configure({
    locales: ['en', 'es', 'ar'],
    cookie: 'IntrepidJS_locales',
    directory: __dirname + '/locales'
});
app.use(i18n.init);
app.use(i18nRoutes.getLocale);
i18nRoutes.configure(app, {directory : __dirname + "/locales/"});

// Loading custom middlewares 
loadCustomMiddlewares(app);

// Main static route
app.use('/' , expressStatic(path.join(__dirname, 'public')));

// Initialized app router
// app.use(app.router);

// loading passport strategies
passportStrategies(localStrategy, BasicStrategy, APIKeyStrategy);

// Check site setting
checkSiteSetting(settings);

// Load site params
loadSiteParams(app, settings);

// Load resources
// loadResources(app, settings.themesPath + settings.site.theme.content);
loadResources(app, settings.themesPath);

// Load modules
loadModules(app, settings.modulesPath, settings.modules, false, function() {
    // Load widgets
    loadWidgets(app, function() {
        // Init routes
        routescan(app, {
            directory: app.get('site_routes'),
            ignoreInvalid: settings.invalid_routes
        });

        app.get(exports.apiPrefix + '/token/auth',
            passport.authenticate('basic', { session: false }),
            function(req, res) {
                res.json(req.user);
            }
        );

        app.post(exports.apiPrefix + '/authenticated',
            passport.authenticate('localapikey', { session: false }),
            function(req, res) {
                res.json({ message: "Authenticated" });
            }
        );
        
        // TODO: Improve this shit, please
        settings.app_instance = app;
    });
});

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true,
        showMessage: true
    }));
}

// production only
if ('production' == app.get('env')) {
    app.use(errorHandler());
}

// Create reusable transporter object using SMTP transport
settings.mail_instance = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'user@domain.com',
        pass: 'password'
    }
});

// MongoDB constructor
var dbURL = settings.dbSettings.dbURL;
var dbCon = db.connect(dbURL);

// development only
if ('development' == app.get('env')) {
    // db.set('debug', true);
}

// Initializing server
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// Initializing redis client
var redisClient = redis.createClient();

// Initializing SocketIO
var socketio = rek('utils/socketio')(server, redisStore, redisClient);




