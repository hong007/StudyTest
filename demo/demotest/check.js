function browserCheck(){
  var userAgent = navigator.userAgent,
  rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
  rFirefox = /(firefox)\/([\w.]+)/,
  rOpera = /(opera).+version\/([\w.]+)/,
  rChrome = /(chrome)\/([\w.]+)/,
  rSafari = /version\/([\w.]+).*(safari)/;
  var browser;
  var version;
  var ua = userAgent.toLowerCase();
  function uaMatch(ua) {
  var match = rMsie.exec(ua);
  if (match != null){
    return { browser : "IE", version : match[2] || "0" };
  }
  var match = rFirefox.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  var match = rOpera.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  var match = rChrome.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  var match = rSafari.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  if (match != null) {
    return { browser : "", version : "0" };
  }
        }
  var browserMatch = uaMatch(userAgent.toLowerCase());
  if (browserMatch.browser) {
    browser = browserMatch.browser;
    version = browserMatch.version;
  }
  var i=0;
  var s = $.ua().is360se;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用360安全浏览器Chrome内核,内核版本号："+version);
    i=1;
  }
  var s = $.ua().is360ee;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用360极速浏览器Chrome内核,内核版本号："+version);
    i=1;
  }
  var s = $.ua().isChrome;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用谷歌浏览器（原版）,内核版本号："+version);
    i=1;
  }
  var s = $.ua().isLiebao;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用猎豹浏览器chrome内核,内核版本号："+version);
    i=1;
  }
  var s = $.ua().isLiebao;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用猎豹浏览器chrome内核,内核版本号："+version);
    i=1;
  }
  var s = $.ua().isSougou;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用搜狗浏览器chrome内核,内核版本号："+version);
    i=1;
  }
  var s1 = $.ua().isIe;
  if(s1==true){
    var s2 = $.ua().ie;
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用IE浏览器，内核版本号："+version);
    if(s2<8){
    alert("用户浏览器版本检测――by Mona_侠快：您使用的浏览器在IE8.0以下，为了您获得良好的上网体验，强烈建议您升级您的IE，或者使用360安全浏览器！");
    }
    i=1;
  }
  var s = $.ua().isFirefox;;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用firefox浏览器，内核版本号："+version);
    i=1;
  }
  var s = $.ua().isMobile;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用手机版浏览器");
    i=1;
  }
  var s = $.ua().isTablet;
  if(s==true){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用平板浏览器");
    i=1;
  }   
  if(i==0){
    document.write("用户浏览器版本检测――by Mona_侠快：你正在使用的是"+browser+"浏览器"+"内核版本号："+version);
  }
}
// JavaScript Document