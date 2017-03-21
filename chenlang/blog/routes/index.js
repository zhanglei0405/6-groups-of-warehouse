var express = require('express');
var router = express.Router();
var articleModel = require('../mongodb/mongo').articleModel;
//支持markdown语法
var markdown = require('markdown').markdown;

/* GET home page. */
router.get('/', function(req, res, next) {
  var keyword = req.query.keyword;
  var query = {};
  if(keyword) {//提交搜索表单
    req.session.keyword = keyword;
    var reg = new RegExp(keyword,'i');
    query = {$or: [{title: reg},{content: reg}]};
  }

  //分页
  var pageNum = parseInt(req.query.pageNum) || 1;
  var pageSize = parseInt(req.query.pageSize) || 3;


  articleModel.find(query)
      .skip((pageNum-1)*pageSize)
      .limit(pageSize)
      .populate('user')
      .exec(function(err,doc){
        if (!err) {
          req.flash('success', '获取文章列表信息成功');
          doc.forEach(function (article,index) {
            article.content = markdown.toHTML(article.content);
          });

          articleModel.count(query,function(err,count){
            if (!err) {
              res.render('index', {title: '首页标题', articles: doc, keyword: keyword,pageNum:pageNum,pageSize:pageSize,totalPage: Math.ceil(count/pageSize)});
            }else {
              req.flash('error', '搜索失败');
            }
          })

        } else {
          req.flash('error', '获取文章列表信息失败');
          res.redirect('back');
        }
  })
});

module.exports = router;
