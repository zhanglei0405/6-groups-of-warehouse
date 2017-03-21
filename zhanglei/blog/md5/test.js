/**
 * Created by Administrator on 2017/3/16.
 */
//加密
//var crypto = require('crypto')
////创建加密算法
//var md5 = crypto.createHash('md5')
////向算法中输入数据
//md5.update('1')
//
//var result = md5.digest('hex');//固定格式
//console.log(result)

//特点：不同的输入一定产生不同的输出值；相同的输入一定产生相同的输出；；通过输出值推算不出输入的值，即算法不可逆
module.exports=function(input){//加密的input必须是字符串
    var crypto = require('crypto')
    var md5 = crypto.createHash('md5')
    md5.update(input);
    var result = md5.digest('hex')
    console.log(result)
    return result;
}

