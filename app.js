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
app.use('/public', static(path.join(__dirname, 'public')));

//cookie-parser setting
app.use('cookieParser');

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var router = express.Router();

router.route('/process/login').post(function(req, res) {
    console.log('/process/login called');

    var paramId = req.body.id;
    var paramPassword = req.body.password;

    console.log("request parameter : " + paramId + ', ' + paramPassword);

    if(pool) {
        authUser(paramId, paramPassword, function(err, rows) {
            if(err) {
                console.error('login process error occured : ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>Error occured in Login process</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if(rows) {
                console.dir(rows);

                var username = rows[0].name;

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req, res) {
    console.log('/process/adduser called');

    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramEmail = req.body.email;
    var paramPhoneNum = req.body.phoneNum;
    var paramGrade = req.body.grade;
    var paramGroup = req.body.group;

    console.log('request parameter : ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramEmail + ', ' + paramPhoneNum + ', ' + paramGrade + ', ' + paramGroup);

    if(pool) {
        addUser(paramId, paramPassword, paramName, paramEmail, paramPhoneNum, paramGrade, paramGroup, function(err, addedUser) {
            if(err) {
                console.error('error occured while addUser : ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
                res.write('<h2>사용자 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();

                return;
            }

            if(addedUser) {
                console.dir(addedUser);
                console.log('inserted ' + result.affectedRows + ' rows');

                var insertId = result.insertId;
                console.log('추가한 레코드의 아이디 : ' + insertId);

                res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가  실패</h2>');
				res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
    }
});

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

        var columns = ['id', 'name', 'age'];
        var tablename = 'ldcc12punch';

        var exec = conn.query()
    });
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
