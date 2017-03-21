/**
 * Created by Administrator on 2017/3/15.
 */
var express = require('express');
var router = express.Router();
//权限判断
var auth =require('../middleware/auth')
/* GET users listing. */
var articleModel =require('../mongoodb/db').articleModel;
//引入multer模块实现图片的上传
var multer = require('multer');
var storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,'../public/uploads')//上传图片后保存的路径地址
},
    filename:function(req,file,cb){
        cb(null,file.originalname);//上传图片后图片的名字等于原来图片的名字
    }
})
var upload = multer({storage:storage});//配置(upload是一个中间件处理函数)
//内容
router.get('/add',auth.checkLogin,function(req,res){
    res.render('article/add',{title:'文章',content:'文章'})
})
router.post('/add',auth.checkLogin,upload.single('poster'),function(req,res){
    var articleInfo = req.body;
    if(req.file){//如果有图片上传
        articleInfo.poster = '/uploads/'+req.file.filename;
    }
    //设置发表文章时间
    articleInfo.createAt = Date.now()
    articleInfo.user = req.session.user._id;

    articleModel.create(articleInfo,function(err,doc){
        if(!err){
            req.flash('success','文章发表成功')
            res.redirect('/')
        }else{
            req.flash('error','文章发表失败')
            res.redirect('back')
        }
    })
})
var id='';
router.get('/edit', function(req, res, next) {
    id = req.query._id;
    articleModel.findOne({_id:id},function(err,doc){
        console.log(doc)
        if(!err){
            res.render('article/edit',{title:'修改页',article:doc})
        }else{
            res.flash('error','修改信息失败')
            res.redirect('back')
        }
    })
    //res.render('detail/detail',{title:'详情页'})//title必须写，因为header.html中引入title了
});
router.post('/edit',function(req, res, next) {
    var newquery = req.body;
    articleModel.findOne({_id:id},function(err,doc){
        if(!err){
            if(newquery.poster) {
                newquery.poster = 'uploads/' + newquery.poster;
            }else {
                newquery.poster = doc.poster;
            }
            articleModel.update(doc,newquery,{multi: true}, function (err, doc) {
                if (!err){
                    req.flash('success','文章修改成功')
                    res.redirect('/')
                } else {
                    req.flash('success','文章修改失败')
                    res.redirect('back')
                }
            });
        }else{
            res.flash('error','查找信息失败')
            res.redirect('back')
        }
    })
    //res.render('detail/detail',{title:'详情页'})//title必须写，因为header.html中引入title了
});
module.exports = router;