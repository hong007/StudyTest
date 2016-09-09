/**
 * Created by Quanta on 16/7/26.
 */
var getBrowser = function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
};
function msg() {
    this.url = 'http://log.air-cloud.cn/';
    this.camefrom = null;
    this.init = function () {
        var params = document.getElementById('msgPullScript').src.split('?')[1].split('&');
        this.camefrom = {}
        for(var i in params){
            var each = params[i].split('=');
            this.camefrom[each[0]] = each[1];
        }
        console.log(this.camefrom);
        window.onerror = function (errorMsg,scriptURI,lineNumber) {
            var options = {
                type:'SYSTEM',
                msg:errorMsg,
                uri:scriptURI,
                time:(new Date().getTime()/1000).toFixed(0),
                browser:getBrowser(),
                lineNo:lineNumber
            }
            msgReoprt.extends(options,msgReoprt.camefrom);
            msgReoprt.send(options);
        };
        var infos = {
            type:'INFOS',
            browser:getBrowser(),
            time:(new Date().getTime()/1000).toFixed(0),
            uri:window.location.href
        }
        this.send(infos);
    };
    this.send = function (values) {
        /* 转化成string */
        var sentStr = '';
        if(typeof(values) == 'object'){
            var temp = []
            for(var key in values){
                temp.push(key + '=' + values[key]);
            }
            sentStr = temp.toString().replace(/,/g,'&')
        }else if(typeof(values) == 'string'){
            sentStr = values;
        }else{
            console.warn('发送格式有误');
            return;
        }
        sentStr = encodeURI(sentStr);
        /* 定义 */
        function XHR() {
            var xhr;
            try {xhr = new XMLHttpRequest();}
            catch(e) {
                var IEXHRVers =["Msxml3.XMLHTTP","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
                for (var i=0,len=IEXHRVers.length;i< len;i++) {
                    try {xhr = new ActiveXObject(IEXHRVers[i]);}
                    catch(e) {continue;}
                }
            }
            return xhr;
        }
        var xhr = XHR();
        xhr.open("post",this.url,true);
        xhr.send(sentStr);
    };
    this.extends = function (target,source) {
        for(var key in source){
            if(target.hasOwnProperty(key)){
                target[key] = source[key]
            }else{
                target[key] = source[key]
            }
        }
    }
}
var msgReoprt = new msg();
msgReoprt.init();