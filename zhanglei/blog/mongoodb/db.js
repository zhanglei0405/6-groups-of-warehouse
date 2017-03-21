var mongoose = require('mongoose')//引入数据库模块
//链接数据库
mongoose.connect(require('../mongooseAddr').addr)
//创建集合并设置集合中的字段
var userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    //用户头像的地址
    avatar:String
})
//创建集合
var userModel = mongoose.model('user',userSchema)
var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    poster:String,
   createAt:{
        type:Date,
       default:Date.now()
   },
    user:{//作者
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})
var articleModel = mongoose.model('article',articleSchema)
module.exports.articleModel=articleModel;
//将与用户相关的集合导出
module.exports.userModel=userModel;