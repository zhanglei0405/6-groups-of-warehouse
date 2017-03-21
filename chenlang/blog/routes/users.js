var express = require('express');
var router = express.Router();
var userModel = require('../mongodb/mongo').userModel;
var md5 = require('../md5/md5');
var auth = require("../middleware/auth");

/* GET users listing. */
router.get('/', auth.checkNotLogin,function(req, res, next) {
  res.render('index', { title: 'Express',content:'首页内容' });
});

router.get('/reg', auth.checkNotLogin,function(req, res, next) {
  res.render('users/reg',{title:'注册页',content:'注册内容'});
});

router.post('/reg',auth.checkNotLogin, function(req, res) {
  var info = req.body;
  info.password = md5(info.password);
  info.avatar = '/stylesheets/user.jpg';
  var query = {username: info.username,password:info.password};
  userModel.findOne(query,function(err,doc){
    if(!err) {
      if(doc) {
        req.flash('error','该用户已注册');
        res.redirect('back');
      }else {
        userModel.create(info, function (err, con) {
          if (!err){
            req.flash('success','用户注册成功');
            //console.log('用户注册成功');
            res.redirect('/users/login');
          } else {
            req.flash('error','用户注册失败');
            //console.log('用户注册失败');
            res.redirect('back');
          }
        });
      }
    }else {
      req.flash('error','查询数据库失败');
      //console.log('查询数据库失败');
      res.redirect('back');
    }
  })
});

router.get('/login', auth.checkNotLogin,function(req, res, next) {
  res.render('users/login',{title:'注册页',content:'登录内容'});
});
router.post('/login', auth.checkNotLogin,function(req, res, next) {
  var info = req.body;
  info.password = md5(info.password);
  userModel.findOne(info,function(err,doc){
    if(!err) {
      if (doc) {
        req.flash('success','登录成功');
        req.session.user = doc;
        res.redirect('/');
      }else {
        req.flash('error','用户不存在，请注册');
        //console.log('用户不存在，请注册');
        res.redirect('/users/reg');
      }
    }else {
      req.flash('error','登录失败');
      //console.log('登录失败');
      res.redirect('back');
    }
  })
});

router.get('/logout', auth.checkLogin,function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
