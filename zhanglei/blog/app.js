var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//打印日志的模块
var session = require('express-session');
var flash = require('connect-flash')//引入flash模块//flash依赖session
//将session信息保存到数据库中
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//post请求，表单提交的时候,req.body
var bodyParser = require('body-parser');

//引入路由容器
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article')
var detail = require('./routes/detail')
var delet= require('./routes/delet')

//创建app，
var app = express();
app.use(session({//使用模块
  secret: 'come',
  resave: true,
  saveUninitialized: true,
  store:new MongoStore({
    //数据库连接地址
    url:require('./mongooseAddr').addr
  })
}));
app.use(flash());
// view engine setup
//设置模板引擎文件根路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎文件类型
app.set('view engine', 'html');
app.engine('html',require('ejs').__express)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());//用来请求请求体是JSON对象
//处理表单提交
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//设置静态文件根路径
app.use(express.static(path.join(__dirname, 'public')));
//中间件,所有/开头的路由交给index路由器处理
app.use(function(req,res,next){
  //向所有模板引擎文件都增加user属性
  res.locals.user = req.session.user;
  res.locals.success=req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.keyword = req.session.keyword;
  next()
})
app.use('/', index);
app.use('/user', user);
app.use('/article', article);
app.use('/detail', detail);
app.use('/delet', delet);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {//错误处理中间件
  // set locals, only providing error in development
  //给末班引擎文件传递数据的第二种方式
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
