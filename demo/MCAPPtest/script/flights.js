/**
 * Created by Quanta on 2016/5/12.
 * Updated by Quanta on 2016/7/4
 * Updated by Quanta on 2016/7/13
 *
 */










//页面数据逻辑处理
var flights={};
/*飞机飞行相关参数*/
var intervalTime=100,//计时时间
    timestep=60,
    flightSteps=0,
    fastTimes=10,
    firstRun = true;//时间差
/* 初始化某个飞机 */

function initFlight(id,infos) {
    if(!flights){
        flights = {};
    }
    if(flights && flights[id] && flights[id]['points']){
        flights[id]['points'].push(infos);
    }else{
        flights[id] = {};
        flights[id]['points'] = [];
        flights[id]['points'].push(infos);
        flights[id]['marker'] = new CustomMarker(new google.maps.LatLng({lat: flights[id]['points'][0].lat*1, lng: flights[id]['points'][0].lng*1}),map,{
            id:id
        });
        /* 控件一些属性的定义 */
        flights[id]['line'] = [];
        flights[id]['marker']['flightid'] = id;//飞机编号
        flights[id]['marker']['clicked'] = false;//是否点击
        flights[id]['marker']['selIcon'] = "../../images/airplanesel.png";//是否点击
        flights[id]['marker']['norIcon'] = "../../images/airplanenor.png";//是否点击
        flights[id]['marker']['showLine'] = false;//是否显示飞行航线
        flights[id]['info'] = new google.maps.InfoWindow({
            content:get_popup_txt(flights[id]['points'][0]),
            map:map,
            zIndex: 101
        });
        flights[id]['info'].addListener('closeclick',function () {
            $('#'+this.id).children('img').first().click();
        });
        flights[id]['info']['id'] = id;//飞机编号
        flights[id]['info']['refeash'] = function () {
            $('.'+this.id).parent().parent().parent().parent().each(function(){$(this).css('top',$(this).position().top - 20)});
            return this;
        };
        flights[id]['info'].close();
    }
}
function run (id) {
    firstRun = false;
    var flight = flights[id];
    var points = flight['points'];
    flight['runned'] = true;
    if(points.length > 1){
        var currentTime = (new Date().getTime()/1000).toFixed(0);
        var pointTime = points[0].t;
        flights[id]['line'].push({lng:points[0].lng*1,lat:points[0].lat*1});
        //console.log(currentTime,pointTime,(currentTime - pointTime),timestep)
        flight['marker'].setPosition({lng:points[0].lng*1,lat:points[0].lat*1});
        flight['info'].setContent(get_popup_txt(points[0]));
        flight['info'].refeash();
        rotate(id,points[0],points[1]);
        if((currentTime - pointTime) > timestep*2){
            points.splice(0,1);
            run(id);
        }else if((currentTime - pointTime) > timestep){
            flight['count'] = 0;
            flightSteps = (points[1].t - points[0].t)*600/(currentTime - pointTime);
            flight['interval'] = window.setInterval('stepByStep("'+id+'")', intervalTime);
        }else{
            flight['count'] = 0;
            flightSteps = (points[1].t - points[0].t)*10;
            flight['interval'] = window.setInterval('stepByStep("'+id+'")', intervalTime);
        }
    }else{
        flight['runned'] = null;
        flight['marker'].setPosition({lng:points[0].lng*1,lat:points[0].lat*1});
    }
}

/*var interval = */
function stepByStep(id) {
    var flight = flights[id];
    var points = flight['points'];
    if(flight['count'] < flightSteps){
        var lnglat = {lng:points[1].lng*flight['count']/flightSteps + (1 - flight['count']/flightSteps)*points[0].lng,lat:points[1].lat*flight['count']/flightSteps + (1 - flight['count']/flightSteps)*points[0].lat};
        //console.log(flight['count'],flightSteps,lnglat);
        flights[id]['line'].push(lnglat);
        if(track_visible){
            showLineById(id);
        }
        flight['marker'].setPosition(lnglat);
        flight['info'].setPosition(lnglat);
        flight['info'].setContent(get_popup_txt_params(id,lnglat.lng,lnglat.lat,points[0].height,points[0].speed,points[0].course));
        flight['info'].refeash();
        flight['count'] += 1;
    }else{
        points.splice(0,1);
        window.clearInterval(flight['interval']);
        run(id);
    }
};
/* 计算角度 */
function rotate(id,before,after) {
    var e = after.lng - before.lng;
    var n = after.lat - before.lat;
    var deg = Math.atan2(e, n) * (180 / Math.PI);
    $('#'+id).css('transform','rotate('+deg+'deg)');
};
/* 根据某一个point来显示info */
function get_popup_txt(pos) {
    return "<b class='targetInfo "+pos.id+"'>" + pos.id + "</b><br>纬度: " + changeLatToDMS(pos.lat) + "<br>经度: " + changeLngToDMS(pos.lng) + "<br>高度: " + pos.height + "<br>航速: " + pos.speed + "<br>航向: " + pos.course;
}
/* 根据某一个point的params来显示info */
function get_popup_txt_params(id,lng,lat,height,speed,course) {
    return "<b class='targetInfo "+id+"'>" + id + "</b><br>纬度: " + changeLatToDMS(lat) + "<br>经度: " + changeLngToDMS(lng) + "<br>高度: " + height + "<br>航速: " + speed + "<br>航向: " + course;
}






