var express = require('express');
var router = express.Router();
var User = require('../models/User'); //constructured function
var Content = require('../models/Content');

var responseData;

router.use(function(req, res, next) {

    responseData = {
        code: 0,
        message: ''
    }
    next();
});


router.post('/user/register', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username == '') {
        responseData.code = 1;
        responseData.message = 'username cannot be empty';
        res.json(responseData);
        return;
    }

    if (password == '') {
        responseData.code = 2;
        responseData.message = 'password cannot be empty';
        res.json(responseData);
        return;
    }

    if (password != repassword) {
        responseData.code = 3;
        responseData.message = 'two passwords did not match';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username
    }).then(function(userInfo) {
        if (userInfo) {
            responseData.code = 4;
            responseData.message = 'username has been registered';
            res.json(responseData);
            return;
        }
        //save user register information to database
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo) {
        console.log(newUserInfo);
        responseData.message = 'registered successfully';
        res.json(responseData);
    });
    //console.log(req.body);
});

router.post('/user/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    /*if (password == '' || username != '') {
        responseData.code = 3;
        responseData.message = 'password cannot be empty';
        res.json(responseData);
        return;
    }

    else if (username == '' || password != '') {
        responseData.code = 4;
        responseData.message = 'username cannot be empty';
        res.json(responseData);
        return;
    }*/

    if (username == '' || password == '') {
        responseData.code = 1;
        responseData.message = 'both username and password cannot be empty';
        res.json(responseData);
        return;
    }




    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = 'username or password is wrong';
            res.json(responseData);
            return;
        }
        responseData.message = 'login successfully';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    })


});

router.get('/user/logout', function(req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});




//Get specified comments on all articles
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.data = content.comments;
        res.json(responseData);
    });

});
//submit comment
router.post('/comment/post', function(req, res) {
    //content id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username, //cookie
        postTime: new Date(),
        content: req.body.content
    };

    //Query information about the current content
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        responseData.message = 'comment successfully';
        responseData.data = newContent;
        res.json(responseData);
    });
});

module.exports = router;