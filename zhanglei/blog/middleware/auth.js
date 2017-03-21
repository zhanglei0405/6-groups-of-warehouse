/**
 * Created by Administrator on 2017/3/16.
 */
//用户登录后才能执行的操作
module.exports.checkLogin=function(req,res,next){
    if(req.session.user){//用户已经登录
        next()
    }else{//用户未登录
        req.flash('error','当前用户未登录，不能执行此操作,请登录')
        res.redirect('/user/login')
    }
}
//用户没有登录之前执行的操作
module.exports.checkNotLogin=function(req,res,next){
    if(req.session.user){//用户已经登录
        req.flash('error','当前用户已登录，不能执行此操作，请先退出')
        res.redirect('/')

    }else{//用户未登录
        next()
    }
}