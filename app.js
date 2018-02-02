var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

var mysql = require('mysql');
var user_router = require('./routes/user_router');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'seungmoomysql.ctxaja8hdied.ap-northeast-2.rds.amazonaws.com',
    user: 'dltmdan92',
    password: '1568919am!',
    database: 'ldcc12punch',
    debug: false
});

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

var authUser = function(id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }

            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        var columns = ['id', 'name'];
        var tablename = 'ldcc12punch';

        var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release();
            console.log('execute sql : ' + exec.sql);

            if(rows.length > 0) {
                console.log("user authenticated");
                callback(null, rows);
            } else {
                console.log("there's no user matched");
                callback(null, null);
            }
        });

        conn.on('error', function(err) {
            console.log('database error occured');
            console.dir(err);

            callback(err, null);
        });
    });
}

var addUser = function(id, password, name, email, phoneNum, grade, group, callback) {
    console.log('addUser process occured');

    pool.getConenction(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release(); // connection release;
            }

            callback(err, null);
            return;
        }
        console.log('database connection threadId : ' + conn.threadId);

        var data = {id: id, password: password, name: name, email: email, phoneNum: phoneNum, grade: grade, group: group};

        var exec = conn.query('insert into users set ?', data, function(err, result) {
            conn.release();
            console.log('execute SQL : ' + exec.sql);

            if(err) {
                console.log('Error occured on SQL executing');
                console.dir(err);

                callback(err, null);

                return;
            }

            callback(err, null);
        });
    })
}

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
