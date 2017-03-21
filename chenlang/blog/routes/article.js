var express = require('express');
var router = express.Router();
var auth = require("../middleware/auth");
var articleModel = require('../mongodb/mongo').articleModel;
//图片上传
var multer = require('multer');
//配置
var storage = multer.diskStorage({
    destination:function(req,file,cb) {
        cb(null,'../public/uploads');
    },
    filename:function(req,file,cb) {
        cb(null,file.originalname);
    }
});
var upload = multer({storage:storage});



router.get('/add', auth.checkLogin,function(req, res, next) {
    res.render('article/add',{title:'发表文章',content:'文章内容'});
});

router.post('/add', auth.checkLogin,upload.single('poster'),function(req, res, next) {
    var info = req.body;
    if(req.file){
        info.poster = 'uploads/' + req.file.filename;
    }
    info.user = req.session.user._id;
    info.createAt = Date.now();

    if(info.id){
        articleModel.findById(info.id,function(err,doc){
            if(!err){
                info.poster || (info.poster = doc.poster);
                articleModel.update({_id:info.id},
                    {title:info.title,poster:info.poster, content:info.content},
                    function(err,doc){
                        if(!err) {
                            req.flash('success', '修改成功');
                            res.redirect('/');
                        }else {
                            req.flash('error', '修改失败');
                            res.redirect('back');
                        }
                });
            }
        });
    }else {
        articleModel.create(info, function (err, con) {
            if (!err) {
                req.flash('success', '发表成功');
                res.redirect('/');
            } else {
                req.flash('error', '发表失败');
                res.redirect('back');
            }
        })
    }
});

router.get('/detail',function(req,res){
    var id = req.query.id;
    articleModel.findById(id).populate('user').exec(function(err,article){
        res.render('article/detail',{title:'详情页',article:article});
    })
});

router.get('/update',function(req,res){
    var id = req.query.id;
    articleModel.findById(id).populate('user').exec(function(err,article){
        res.render('article/update',{title:'编辑页',article:article});
    })
});

router.post('/update',function(req,res){
    var id = req.query.id;
    articleModel.findById(id).populate('user').exec(function(err,article){
        res.render('article/update',{title:'编辑页',article:article});
    })
});

router.get('/delete',function(req,res){
    var id = req.query.id;
    articleModel.remove({_id: id},function(err,article){
        if(!err) {
            req.flash('success','删除成功')
            res.redirect('/');
        }else {
            req.flash('success','删除失败')
            res.redirect('back');
        }

    })
});

module.exports = router;