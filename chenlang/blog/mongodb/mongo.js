var mongoose = require('mongoose');

mongoose.connect(require('../dbUrl').dbUrl);

var userSchema = new mongoose.Schema({
    username: String,  //属性名：类型
    email: String,
    password: String,
    avatar:String
});

var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    poster: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

var userModel = mongoose.model('user', userSchema);
var articleModel = mongoose.model('article', articleSchema);

module.exports.userModel = userModel;
module.exports.articleModel = articleModel;