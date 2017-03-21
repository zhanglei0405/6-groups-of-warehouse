/**
 * Created by Administrator on 2017/3/19.
 */
var express = require('express');
var router = express.Router();
var articleModel =require('../mongoodb/db').articleModel;
var markdown = require('markdown').markdown;//引入markdown模块
/* GET home page. */
router.get('/detail', function(req, res, next) {
    //res.render('detail/detail')
    var query ={};
    var id = req.query._id;
    articleModel.findOne({_id:id})
        .populate('user')
        .exec(function(err,articles) {
            if (!err) {
                    res.render('detail/detail', {title: '详情页', article: articles})
            } else {
                console.log('未找到数据')
                res.redirect('back')
            }
        })
            //res.render('detail/detail',{title:'详情页'})//title必须写，因为header.html中引入title了
});
module.exports = router;
