var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'seungmoomysql.ctxaja8hdied.ap-northeast-2.rds.amazonaws.com',
    user: 'dltmdan92',
    password: '1568919am!',
    database: 'ldcc12punch',
    debug: false
});

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

module.exports.authUser = authUser;
module.exports.addUser = addUser;
