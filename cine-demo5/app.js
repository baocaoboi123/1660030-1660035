var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var ejs = require('ejs');
var authMiddleware = require('./middlewares/auth');
var db = require('./models/db');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
var expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var multer = require('multer');
const nodemailer = require('nodemailer'); 
var app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['aktnqdeldtv'],
  maxAge: 24 * 60 *60 *1000
}))
app.use(expressLayouts);
app.set('layout', './layouts/full-width')


app.use(authMiddleware);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use('/javascripts', express.static(__dirname + 'public/javascripts'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/stylesheets', express.static(__dirname + 'public/stylesheets'))
app.use('/fonts', express.static(__dirname + 'public/fonts'))
app.use('/videos', express.static(__dirname + 'public/videos'))
app.use('/csv', express.static(__dirname + 'public/csv'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

var authRouter = require('./routes/auth');
app.use('/auth', authRouter);
var phimdangchieuRouter = require('./routes/phimdangchieu');
app.use('/phimdangchieu', phimdangchieuRouter);
var phimRouter = require('./routes/phim');
app.use('/phim', phimRouter);
var muaveRouter = require('./routes/muave');
app.use('/muave', muaveRouter);
var quanlyRouter = require('./routes/quanly');
app.use('/quanly', quanlyRouter);
var thongkeRouter = require('./routes/thongke');
app.use('/thongke', thongkeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
