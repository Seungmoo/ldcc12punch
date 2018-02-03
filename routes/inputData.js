// 디비에 데이터 쌓기

var express = require('express');
var router = express.Router();

var iot_database = require('../database/iot_database');
/**
    DB methods
**/

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'seungmoomysql.ctxaja8hdied.ap-northeast-2.rds.amazonaws.com',
    user: 'dltmdan92',
    password: '1568919am!',
    database: 'datas',
    debug: false
});

router.post('/insertdata', function(req, res, next) {
    /**
        paramDatas from raspberry pi
    **/

    if(pool) {
        //DB method execute

    } else {

    }
});
