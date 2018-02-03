var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

//var user_router = require('./routes/user_router');
var engine = require('ejs-locals');

var login2 = require('./routes/login2');
var index = require('./routes/index');
var main = require('./routes/main');
var app = express();


app.set('port', process.env.PORT || 80);
//application/x-www-form-urlencoded parsing
app.use(bodyParser.urlencoded({ extended: false }));
//application/json parsing
app.use(bodyParser.json());
//open /public folder with static
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));app.set('view engine', 'ejs');
app.engine('ejs', engine);
//cookie-parser setting
app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

//ROUTER
app.use('/login2',login2);
app.use('/main',main);
app.use('/', index);


var errorHandler = expressErrorHandler({
    static: {
        '404': './views/404.html'
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
