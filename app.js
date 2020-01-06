//Application startup entry file
var express = require('express'); //load express module
var swig = require('swig'); //load template processing module
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cookies = require('cookies');
var app = express(); //create app 

//setting up static file hosting
var User = require('./models/User');

var socket = require('socket.io');
var server = app.listen(9001, function() {
    console.log('listening to requests on the port 9001');
});
var io = socket(server);


app.use('/public', express.static(__dirname + '/public'));

//Configure application template
//defines the template engine used by the current application
app.engine('html', swig.renderFile);

//set the directory where template files are stored
app.set('views', './views');
//template engine used for registration
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    req.cookies = new cookies(req, res);


    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })

        } catch (e) {
            next();
        }
    } else {
        next();
    }
});

swig.setDefaults({ cache: false });

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));



app.get('/', function(req, res, next) {
    //res.send('<h1>welcome to my blog!</h1>');
    //read the specified file under views, parse it and return it to the client
    res.render('index', );
})
mongoose.connect("mongodb://localhost:27017/blog", (err) => {
    if (err) {
        console.log('database connection failure');
    } else {
        console.log('database connection successful');
        app.listen(9000);
    }
});

io.on('connection', function(socket) {
    console.log('made socket connection', socket.id);


    //handle chat event
    socket.on('chat', function(data) {
        io.sockets.emit('chat', data);
    });


    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
});