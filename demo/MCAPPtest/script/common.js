/**
 * Created by Quanta Sun on 2016/5/17.
 *
 * Common的处理
 * 1.临时数据保存、获取、清除
 *      localStorage
 *
 * 2.共通的方法，比如时间戳转换
 *
 * 3.通过ajax获取通用信息
 *
 */

/* ---- 数据处理 ---- */
var getValues = function (key) {
    if(key){
        return localStorage.getItem(key);
    }else{
        return localStorage.getItem(window.location.href.split('pages/')[1]);
    }
}
var getToken = function () {
    return localStorage.getItem('token');
}
var RemoveValue = function (key) {
    localStorage.removeItem(key);
}
/*
* 只有一个参数values, key值从href中解析获取
*/
var setValues = function (value) {
    localStorage.setItem(window.location.href.split('pages/')[1],value);
}
setValues('url','http://g.fly-cloud.cn/');
setValues('token','MiMxNDcwODgyNDk3QGcuZmx5LWNsb3VkLmNuI0RIZkx0dERmZmhVSTZTWHRCU0pnNVRJNmFtST0=');
setValues('rights','1000,1001,2000,3000,3001,3002,4000,4001,4002,4003,4004,5000,5001,5002,5003,5004,5005,6000,6001,6002,7000,7001,7002,8000,8001,8002,9000,9001,9002,9003,9004,9100,9101,9102,9103,9104');
/*
 * 连个参数，key-value
 */
var setValues = function (key,value) {
    localStorage.setItem(key,value);
}
var ajax = function(params){

    var def = {
        type:'GET',
        url:getValues('url'),
        data:{
            token:getToken()
        },
        // complete:function (p1,p2) {
        //     if(p2 == 'success' && JSON.parse(p1.responseText).err+'' == '-2'){
        //         // alert(JSON.parse(p1.responseText).msg);
        //         localStorage.clear();
        //         window.location.href = '/pages/login.html';
        //     }
        // }

    };
    $.extend(true,def,params);
    if(params.url){
        def.url = getValues('url') + def.url;
    }
    return $.ajax(def);
}


var testFlag = function (flag) {
    if(flag && (flag==true || (typeof flag == 'string' && flag.toLowerCase()=='true'))){
        setValues('url','http://g.fly-cloud.cn/');
    }else{
        setValues('url','http://g.air-cloud.cn/');
    }

}
/* ---- 数据处理 ---- */

/* ---- 时间格式转换 ---- */
function formatDateFromInt(int){
    if(int){
        var now = new Date(parseInt(int) * 1000);
        var year=now.getFullYear(),
            month=(now.getMonth()<9)?'0'+(now.getMonth()+1):now.getMonth()+1,
            date=(now.getDate()<10)?'0'+(now.getDate()):now.getDate(),
            hour=(now.getHours()<10)?('0'+now.getHours()):now.getHours(),
            minute=(now.getMinutes()<10)?('0'+now.getMinutes()):now.getMinutes(),
            second=(now.getSeconds()<10)?('0'+now.getSeconds()):now.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    }else{
        return "";
    }
}
var formatDateWithoutSFromInt = function(int){
    if(int){
        var now = new Date(parseInt(int) * 1000);
        var year=now.getFullYear(),
            month=(now.getMonth()<9)?'0'+(now.getMonth()+1):now.getMonth()+1,
            date=(now.getDate()<10)?'0'+(now.getDate()):now.getDate(),
            hour=(now.getHours()<10)?('0'+now.getHours()):now.getHours(),
            minute=(now.getMinutes()<10)?('0'+now.getMinutes()):now.getMinutes();
        return year+"-"+month+"-"+date+" "+hour+":"+minute;
    }else{
        return "";
    }
}
/* ---- 时间格式转换 时分秒 ---- */
var formatHMSFromInt = function(int){
    if(int){
        var now = new Date(parseInt(int) * 1000);
        var hour=(now.getHours()<10)?('0'+now.getHours()):now.getHours(),
            minute=(now.getMinutes()<10)?('0'+now.getMinutes()):now.getMinutes(),
            second=(now.getSeconds()<10)?('0'+now.getSeconds()):now.getSeconds();
        return hour+":"+minute+":"+second;
    }else{
        return "";
    }
}
/* ---- 时间格式转换 年月日 ---- */
var formatYMDFromInt = function(int){
    if(int){
        var now = new Date(parseInt(int) * 1000);
        var year=now.getFullYear(),
            month=(now.getMonth()<9)?'0'+(now.getMonth()+1):now.getMonth()+1,
            date=(now.getDate()<10)?'0'+(now.getDate()):now.getDate();
        return year+"-"+month+"-"+date;
    }else{
        return "";
    }
}
var formatYMDWithoutLineFromInt = function(int){
    if(int){
        var now = new Date(parseInt(int) * 1000);
        var year=now.getFullYear(),
            month=(now.getMonth()<9)?'0'+(now.getMonth()+1):now.getMonth()+1,
            date=(now.getDate()<10)?'0'+(now.getDate()):now.getDate();
        return year+month+date;
    }else{
        return "";
    }
}
/* ---- 时间格式转换 ---- */

/* ---- 获取通用信息 ---- */
var getCommonInfos = function (param) {
    if(getValues(param)){
        return JSON.parse(getValues(param));
    }else{
        return {err:'1',msg:'未找到相关信息'}
    }
}
var commonInfosRefresh = function (async) {

    //获取aircraft信息
    if(getToken()){
        commonInfosRefreshAircraft(async);
        //获取pilot信息
        commonInfosRefreshPilot(async);
        //获取company信息
        commonInfosRefreshCompany(async);
    }
}
commonInfosRefresh();
function commonInfosRefreshAircraft(async) {
    //获取Aircraft信息

    var asyncValue = true;
    if(async || async==false){
        asyncValue = false;
    }
    ajax({
        async:asyncValue,
        url:'suggest',
        data:{
            action:'aircraft',
            token:getToken()
        },
        success:function(results){
            setValues('aircraft',JSON.stringify(results));
        }
    });
}
function commonInfosRefreshPilot(async) {
    //获取pilot信息
    var asyncValue = true;
    if(async || async==false){
        asyncValue = false;
    }
    ajax({
        async:asyncValue,
        url:'suggest',
        data:{
            action:'pilot',
            token:getToken()
        },
        success:function(results){
            setValues('pilot',JSON.stringify(results));
        }
    });

}
function commonInfosRefreshCompany(async) {
    //获取company信息
    var asyncValue = true;
    if(async || async==false){
        asyncValue = false;
    }
    ajax({
        async:asyncValue,
        url:'company',
        data:{
            action:'index',
            token:getToken()
        },
        success:function(results){
            setValues('company',JSON.stringify(results));
        }
    });
}
var commonInfosRefreshOne = function (param,asyncValue) {
    //刷新action为param的通用数据
    var asyncValue = true;
    if(async || async==false){
        asyncValue = false;
    }
    ajax({
        async:asyncValue,
        url:'suggest',
        data:{
            action:'param'
        },
        success:function(results){
            setValues('param',JSON.stringify(results));
        }
    });
}
/* ---- 获取通用信息 ---- */

var alertx = function(title,msg,type){
    var div = $('<div class="alert alert-danger alert-position-bottom systeminfo" role="alert" style="z-index: 1051;"></div>'),
        btn = $('<button type="button" class="close" onclick="$(this).parent().remove();"><span aria-hidden="true">&times;</span></button>')
        strong = $('<strong></strong>');
    if(type && type.toUpperCase()=='SUCCESS'){
        div = $('<div class="alert alert-success alert-position-bottom systeminfo" role="alert" style="z-index: 1051;"></div>');
    }else if(type && type.toUpperCase()=='WARNING'){
        div = $('<div class="alert alert-warning alert-position-bottom systeminfo" role="alert" style="z-index: 1051;"></div>');
    }else if(type && type.toUpperCase()=='INFO'){
        div = $('<div class="alert alert-info alert-position-bottom systeminfo" role="alert" style="z-index: 1051;"></div>');
    }
    $('.systeminfo').remove();
    div.text(msg).prepend(strong.text(title)).prepend(btn);
    $('body').append(div);
    setTimeout(function(){
       div.remove();
    },10000);
};
// if(getToken()===undefined || getToken()===null || getToken().length == 0 ){
//     if(window.location.href.split('pages/')[1] != 'login.html' && window.location.href.split('pages/')[1] != 'index.html'){
//         window.location.href = window.location.origin + '/pages/login.html';
//     }
// }
var getJSONValues = function (key) {
    var json = getValues(key);
    if(json){
        json = JSON.parse(json);
    }else{
        json = {}
    }
    return json;
};
/* 把经度从浮点转换成度分秒 */
var changeLngToDMS = function(val) {
    var EW = 'E';
    if(val<0){
        EW = 'W';
        val = 0 - val;
    }
    var d = parseInt(val);
    var m = parseInt((val-d)*60);
    var s = (((val-d)*60 - m)*60).toFixed(2);
    return EW + d+'°'+m+"'"+s+'"';
};
/* 把经度从度分秒转换成浮点 */
var changeDMSToLng = function(val) {
    var EW = val.match(/^\w/)[0];
    var lng = val.match(/\d+/g);
    if(lng && lng.length > 0){
        var lngFloat = 0;
        if(lng[0]){
            lngFloat = parseInt(lng[0]);
        }
        if(lng[1]){
            lngFloat += parseFloat(lng[1])/60;
        }
        if(lng[2] && lng[3]){
            lngFloat += parseFloat(lng[2] + '.' + lng[3])/3600;
        }else if(lng[2]){
            lngFloat += parseFloat(lng[2])/3600;
        }
        if(EW.toUpperCase() == 'E'){
            return lngFloat;
        }else{
            return 0 - lngFloat;
        }
    }
};
/* 把纬度从浮点转换成度分秒 */
var changeLatToDMS = function(val) {
    var NS = 'N';
    if(val<0){
        NS = 'S';
        val = 0 - val;
    }
    var d = parseInt(val);
    var m = parseInt((val-d)*60);
    var s = (((val-d)*60 - m)*60).toFixed(2);
    return NS + d+'°'+m+"'"+s+'"';
};
/* 把纬度从度分秒转换成浮点 */
var changeDMSToLat = function(val) {
    var NS = val.match(/^\w/)[0];
    var lng = val.match(/\d+/g);
    if(lng && lng.length > 0){
        var lngFloat = 0;
        if(lng[0]){
            lngFloat = parseInt(lng[0]);
        }
        if(lng[1]){
            lngFloat += parseFloat(lng[1])/60;
        }
        if(lng[2] && lng[3]){
            lngFloat += parseFloat(lng[2] + '.' + lng[3])/3600;
        }else if(lng[2]){
            lngFloat += parseFloat(lng[2])/3600;
        }
        if(NS.toUpperCase() == 'N'){
            return lngFloat;
        }else{
            return 0 - lngFloat;
        }
    }
};
