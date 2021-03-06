var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var rentalsRouter = require('./routes/rentals');
var returnsRouter = require('./routes/returns');
var branchRouter = require('./routes/branch');
var vehicletypeRouter = require('./routes/vehicletype');
var vehicleRouter = require('./routes/vehicle');
var reservationRouter = require('./routes/reservation');
var customerRouter = require('./routes/customer');

var app = express();
var initDb = require('./db').initDb;
var getDb = require('./db').getDb;
initDb();

// view engine setup
app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
        res.header('Access-Control-Max-Age', '600');
        if (req.method === 'OPTIONS') return res.sendStatus(200);
        else return next();
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/all', indexRouter);
app.use('/all/update', indexRouter);
app.use('/all/delete', indexRouter);
app.use('/all/insert', indexRouter);

app.use('/rentals', rentalsRouter);

app.use('/returns', returnsRouter);
app.use('/branch', branchRouter);
app.use('/vehicletype', vehicletypeRouter);
app.use('/vehicle', vehicleRouter);
app.use('/reservation', reservationRouter);
app.use('/customer', customerRouter);

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
  res.status(err.status || 500).send({status: err.status, message: err.message});
  res.render('error');
});

process.on('SIGINT', () => {
  getDb().close();
});

module.exports = app;
