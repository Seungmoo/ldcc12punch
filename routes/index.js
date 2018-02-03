var express	   = require('express');
var router = express.Router();

var user_database = require('../database/user_database');
var authUser = user_database.authUser;
var addUser = user_database.addUser;

router.get('/',function(req,res,next) {
    res.render('index',{title: 'Express'});
});

module.exports = router;
