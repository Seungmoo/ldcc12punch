var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

var user_router = require('./routes/user_router');

var app = express();

app.set('port', process.env.PORT || 80);
//application/x-www-form-urlencoded parsing
app.use(bodyParser.urlencoded({ extended: false }));
//application/json parsing
app.use(bodyParser.json());

//open /public folder with static
app.use('/views', static(path.join(__dirname, 'views')));

//cookie-parser setting
app.use('cookieParser');

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var router = express.Router();

router.route('/process/login').post(user_router.login);
router.route('/process/adduser').post(user_router.adduser);

app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// when process ended, database connection closed
process.on('SIGTERM', function() {
    console.log('process ended');
});

app.on('close', function() {
    console.log('Express 서버 객체가 종료됩니다.');
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('server started. port: ' + app.get('port'));
});
