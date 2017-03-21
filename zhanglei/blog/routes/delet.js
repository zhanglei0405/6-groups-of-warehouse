var express = require('express');
console.log(11111)
var articleModel =require('../mongoodb/db').articleModel;
var router = express.Router();
router.get('/delet', function(req, res, next) {
    //res.render('detail/detail')
    var id = req.query._id;
    articleModel.remove({_id:id},function(err,doc){
        if(!err){
            res.redirect('/')
        }else{
            res.flash('error','删除信息失败')
            res.redirect('back')
        }
    })
    //res.render('detail/detail',{title:'详情页'})//title必须写，因为header.html中引入title了
});

module.exports = router;


