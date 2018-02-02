

var login = function(req, res) {

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
}

var adduser = function(req, res) {
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
}

module.exports.login = login;
module.exports.adduser = adduser;
