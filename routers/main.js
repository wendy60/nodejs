var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

var data;

/*
 * deal with general data
 * */
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

/*
 * home page
 * */
router.get('/', function(req, res, next) {

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 2;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then(function(count) {

        data.count = count;
        //Calculating the total number of pages
        data.pages = Math.ceil(data.count / data.limit);
        //The value cannot exceed pages
        data.page = Math.min(data.page, data.pages);
        //The value cannot be less than 1
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index', data);
    })
});

router.get('/view', function(req, res) {

    var contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        data.content = content;

        content.views++;
        content.save();
        //console.log(data);

        res.render('main/view', data);
    });

});

router.get('/chat', function(req, res, next) {
    res.render('main/chat_index', {});
})
module.exports = router;