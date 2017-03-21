var express = require('express');
var router = express.Router();
var articleModel =require('../mongoodb/db').articleModel;
var auth =require('../middleware/auth')
var markdown = require('markdown').markdown;//引入markdown模块
/* GET home page. */
router.get('/', function(req, res, next) {
  var query ={};
  var keyword = req.query.keyword;//得到搜索提交的内容
  if(keyword){
    req.session.keyword = keyword;//将搜索提交内容保存到session中
    var reg = new RegExp(keyword,'i')//创建正则查询关键字keyword
    query = {$or:[{title:reg},{content:reg}]}
  }
  //
  var pageNum =parseInt(req.query.pageNum)||1;
  var pageSize = parseInt(req.query.pageSize)||8;

  //读取数据库中所有文章列表的信息
  articleModel.find(query)
      .skip((pageNum-1)*pageSize)
      .limit(pageSize)
      .populate('user')
      .exec(function(err,articles){
        if(!err){
          //articles.forEach(function (article, index) {
          //  article.content = markdown.toHTML(article.content);//让所有文章的内容支持markdown
          //});
          req.flash('success','获取文章成功')
          articleModel.count(query,function(err,count){
            if(!err){
              res.render('index',{
                title:'首页标题',
                articles:articles,
                keyword:keyword,
                pageNum:pageNum,
                pageSize:pageSize,
                totalPage:Math.ceil(parseInt(count)/pageSize)//总页数
              })
            }else{
              req.flash('error','获取总条数失败')
              res.redirect('back')
            }

          })
        }else{
          res.flash('error','获取文章列表信息失败')
          res.redirect('back')
        }
      })
  //res.render('index', { title: '首页',content:'标题'});上面已经渲染过就不要在进行一次渲染了
});

module.exports = router
