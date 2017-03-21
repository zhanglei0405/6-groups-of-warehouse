/**
 * Created by Administrator on 2017/3/15.
 */
console.log(1111)
var successDebug = require('debug')('blog:success')
var failDebug = require('debug')('blog:fail')
var warnDebug = require('debug')('blog:warn')
successDebug('success')
failDebug('fail')
warnDebug('warn')


