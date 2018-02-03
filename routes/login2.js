var express	   = require('express');
var router = express.Router();

var user_database = require('../database/user_database');
var authUser = user_database.authUser;
var addUser = user_database.addUser;

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'seungmoomysql.ctxaja8hdied.ap-northeast-2.rds.amazonaws.com',
    user: 'dltmdan92',
    password: '1568919am!',
    database: 'ldcc12punch',
    debug: false
});

router.get('/', function(req,res,next){
  res.render('./login/login' ,{title: 'Login'});
});
router.get('/searchUser', function(req,res,next){
  res.render('./login/searchUser' ,{title: 'searchUser'});
});

router.post('/authuser', function(req, res, next) {
    var paramId = req.body.username || req.query.username;
    var paramPass = req.body.pass || req.query.pass;

    if(pool) {
        authUser(paramId, paramPassword, function(err, rows) {
            if(err) {
                res.render('./login/loginerror', {title: 'Login Error'});
            }

            if(rows) {
                var userId = rows[0].id;
                var username = rows[0].name;
                res.render('./login/loginsuccess', {title: username, id: userId});
            } else {
                res.render('./login/loginfailed', {title: 'Login Failed'});
            }
        });
    } else {
        res.render('dberror', {title: 'DB ERROR OCCURED'});
    }

});

router.post('/updateuser', function(req, res, next) {
    // var id --> 세션으로 선언한다.
    var paramPassword = req.body.pass || req.query.pass;
    var paramName = req.body.name || req.query.name;
    var paramEmail = req.body.email || req.query.email;
    var paramPhoneNum = req.body.phoneNum || req.query.phoneNum;
    var paramGrade = req.body.grade || req.query.grade;
    var paramGroup = req.body.group || req.query.group;
});

module.exports = router;
