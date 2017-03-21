var express = require('express');
var router = express.Router();
var md5 = require('../md5/test')//引入自定义的加密文件
//权限判断
var auth =require('../middleware/auth')
//引入自定义模块
var userModel = require('../mongoodb/db').userModel;
/* GET users listing. */
router.get('/',function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.get('/reg',auth.checkNotLogin,function(req,res){
   res.render('user/reg',{title:'注册',content:'用户注册'})
})
//用户注册表单提交
router.post('/reg',function(req,res){
    var userInfo = req.body;//获取表单提交内容

    userInfo.password = md5(userInfo.password)
        //s=48  像素默认为48  userInfo.email指用户邮箱地址
    userInfo.avatar= "https://secure.gravatar.com/avatar/"+userInfo.email+"?s=48";
    var query = {username:userInfo.username,password:userInfo.password}
   userModel.findOne(query,function(err,doc){
        if(!err){
            if(doc){
                console.log('当前用户已经注册')
                req.flash('error','当前用户已注册，请更换用户名')
                res.redirect('back')
            }else{
                userModel.create(userInfo,function(err,doc){
                    if(!err){
                        console.log(doc)
                        req.flash('success','注册成功')
                        res.redirect('/user/login')
                    }else{
                        req.flash('error','注册失败')
                        res.redirect('back')
                    }
                })
            }
        }else{
            req.flash('error','查询数据库失败')
            res.redirect('back')
        }
    })


})
//登录
router.get('/login',auth.checkNotLogin,function(req,res){
  res.render('user/login',{title:'登录',content:'用户登录'})
})
router.post('/login',function(req,res){
    var userInfo = req.body;
    userInfo.password = md5(userInfo.password)
    //数据库中查找该用户信息
    userModel.findOne(userInfo,function(err,doc){
        if(!err){
            if(doc){
                req.flash('success','登陆成功')
                //req.session.user = userInfo;
                req.session.user = doc;
                console.log(req.session.user)
                res.redirect('/')
            }else{
                req.flash('error','当前用户未注册，请注册')
                res.redirect('/user/reg')
            }
        }else{
            req.flash('error','查找数据库失败')
            res.redirect('back')
        }
    })
})
//退出
router.get('/logout',auth.checkLogin,function(req,res){
    req.flash('success','退出成功')
    req.session.user=null;
  //点击退出直接跳转首页
  res.redirect('/')
})

module.exports = router;
