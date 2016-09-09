// 监视右侧相关功能
// 天气、海拔、监视、回放、变迁、航线、要素、测距、列表

// 天气
var geocoder,weather,infoWin,marker;
function initAMap() {

    AMap.plugin('AMap.Geocoder', function () {
        geocoder = new AMap.Geocoder({
            city: "010"
        });
    });
    AMap.service('AMap.Weather', function () {
        weather = new AMap.Weather();
    });
    infoWin = new google.maps.InfoWindow({
                    content: '',
                    position:{lng:GPS[0],lat:GPS[1]}
                });
}
// initAMap();
// 左键获取gps
google.maps.event.addListener(map, "click", function(event) {
    GPS[0] = event.latLng.lng();
    GPS[1] = event.latLng.lat();
    // 添加标记 
    // mapRightMenu.elevationWindow.close(map);
    getBottom();
});
var weatherOn = false;
function weatherTap(){
    weatherOn = !weatherOn
    // console.log(weatherOn)
    infoWin.close(map);
    google.maps.event.addListener(map, "click", function(event) {
        if (weatherOn==true) {
        	geocoder.getAddress(GPS, function (status, result) {
                if (status == 'complete') {
                    var adcode = result.regeocode.addressComponent.adcode;
                    var address = result.regeocode.formattedAddress;
                    var winfo = ['', ''];
                    weather.getLive(adcode, function (err, data) {
                        if (err) {
                            winfo[0] = '<div style="color: #3366FF;">获得实时天气失败' + '</div>';
                        }else {
                            var str = [];
                            str.push('<div style="color: #3366FF;">实时天气' + '</div>');
                            str.push('<div>省份/直辖市：' + data.province + '</div>');
                            str.push('<div>城市/区：' + data.city + '</div>');
                            str.push('<div>天气：' + data.weather + '</div>');
                            str.push('<div>温度：' + data.temperature + '℃</div>');
                            str.push('<div>风向：' + data.windDirection + '</div>');
                            str.push('<div>风力：' + data.windPower + ' 级</div>');
                            str.push('<div>空气湿度：' + data.humidity + '</div>');
                            str.push('<div>发布时间：' + data.reportTime + '</div>');
                            winfo[0] = str.join('');
                        }
                        if (winfo[0].length > 0 && winfo[1].length > 0) {
                            infoWin.setContent(winfo[0] + winfo[1]);
                            infoWin.setPosition({lng:GPS[0],lat:GPS[1]});
                            infoWin.open(map);
                        }   
                    });
                    weather.getForecast(adcode, function (err, data) {
                        if (err) {
                            winfo[1] = '<div style="color: #3366FF;">获得近4天天气失败' + '</div>';
                        }else {
                            var str = ['<div style="color: #3366FF;">近4天天气' + '</div>'];
                            for (var i = 0, dayWeather; i < data.forecasts.length; i++) {
                                dayWeather = data.forecasts[i];
                                str.push('<div class="weather">' + dayWeather.date + ' ' + dayWeather.dayWeather + ' ' + dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃' + '</div>');
                            }
                            winfo[1] = str.join('');
                        }
                        if (winfo[0].length > 0 && winfo[1].length > 0) {
                            infoWin.setContent(winfo[0] + winfo[1]);
                            infoWin.setPosition({lng:GPS[0],lat:GPS[1]});
                            infoWin.open(map);
                        }
                    });
                }else {
                    alert("出错了");
                }
            })
        }
    });
};
// 海拔、测距var
var mapRightMenu = {
    map:null,
    drawRightMenu:true,
    target:$('body'),
    GPS:{lng:GPS[0],lat:GPS[1]},
    elevationWindow:new google.maps.InfoWindow(),
    drawRule:false,
    ruleLocations:[],
    ruleLine:null,
    ruleMsgStyle:{},
    ruleMarkers:[]
};
// 海拔
var elevationOn = false
function elevationTap(){
    mapRightMenu.elevationWindow.close(map)
    elevationOn = !elevationOn
    google.maps.event.addListener(map, "click", function(event) {
        if(elevationOn==true){
            getElevationForLocations([{lng:GPS[0],lat:GPS[1]}],ElevationCallback);
        }
    });
};
function getElevationForLocations(locations,callback){
    var elevation = new google.maps.ElevationService();
    elevation.getElevationForLocations({
        locations:locations
    },callback);
}
function ElevationCallback(result,state){
    if(state == google.maps.ElevationStatus.OK){
        var targetResult = result[0];
        mapRightMenu.elevationWindow.setPosition(targetResult.location);
        mapRightMenu.elevationWindow.setContent('海拔:'+targetResult.elevation.toFixed(2) + '米');
        if(mapRightMenu.map){
            mapRightMenu.elevationWindow.open(mapRightMenu.map);
        }else{
            mapRightMenu.elevationWindow.open(map);
        }
    }
}
// 测距
function distanceTap(){
    mapRightMenu.drawRule = !mapRightMenu.drawRule;
    if(mapRightMenu.drawRule){
        if($('#rule_zoom').length > 0){
            $('#rule_zoom').show();
            $('#rule_zoom h5').text('距离:0米');
        }else{
            var div = $('<div id="rule_zoom" style="position: absolute;top: 60px;left: 0;right: 0;margin: 0 auto;width:250px;height: 50px;background: white;border: 1px solid #ddd;"></div>');
            var deleteSpan = $('<div onclick="ruleTurn()" style="float: right;margin-top:2px;margin-right:4px;cursor: pointer;"><span class="glyphicon glyphicon-remove-circle"></span></div>')
            div.append(deleteSpan).append($('<h5 style="line-height: 50px;text-align: center;margin: 0;"></h5>').text('距离:0.00米'))
            mapRightMenu.target.append(div);
            mapRightMenu.ruleLine = new google.maps.Polyline({
                map:map,
                strokeColor:'#000',
                strokeOpacity:0.8,
                strokeWeight:2
            });
            initRule();
        }
    }else{
        $('#rule_zoom').hide();
        initRule();
    }
};
function initRule() {
    $.each(mapRightMenu.ruleMarkers,function (i) {
       this.setMap(null);
    });
    mapRightMenu.ruleMarkers = [];
    mapRightMenu.ruleLine.setPath([]);
    mapRightMenu.ruleLocations = [];
    google.maps.event.addListener(map,'click',function (event) {
        if(mapRightMenu.drawRule){
            drawSphreicalMarker(event.latLng);
        }
    });
}
function sphericalLength(locations){
    return google.maps.geometry.spherical.computeLength(locations).toFixed(2);
}
function drawSphreicalMarker(e) {
    mapRightMenu.ruleLocations.push(e);
    var temp = new google.maps.Marker({
        map:map,
        position:e,
        draggable:true,
        crossOnDrag:false,
        icon: {
            size: new google.maps.Size(10,10),
            anchor: new google.maps.Point(5,5),
            origin: new google.maps.Point(0,0),
            scaledSize: new google.maps.Size(10,10),
            url:'images/location_16px.png'
        }
    });
    $('#rule_zoom h5').text('距离:'+google.maps.geometry.spherical.computeLength(mapRightMenu.ruleLocations).toFixed(2)+'米');
    if(mapRightMenu.ruleMarkers.length>0){
        temp.addListener('click',function () {
            //点重置排序
            mapRightMenu.ruleMarkers[this.id].setMap(null);
            mapRightMenu.ruleMarkers.splice(this.id,1);
            for(var i = this.id;i<mapRightMenu.ruleMarkers.length;i++){
                mapRightMenu.ruleMarkers[i].id = i;
            }
            //线重置排序
            mapRightMenu.ruleLocations.splice(this.id,1);
            mapRightMenu.ruleLine.setPath(mapRightMenu.ruleLocations);
            $('#rule_zoom h5').text('距离:'+google.maps.geometry.spherical.computeLength(mapRightMenu.ruleLocations).toFixed(2)+'米');
        });
    }
    temp.id = mapRightMenu.ruleMarkers.length;
    temp.addListener('drag',function (e) {
        mapRightMenu.ruleLocations[this.id] = e.latLng;
        mapRightMenu.ruleLine.setPath(mapRightMenu.ruleLocations);
        $('#rule_zoom h5').text('距离:'+google.maps.geometry.spherical.computeLength(mapRightMenu.ruleLocations).toFixed(2)+'米');
    });
    mapRightMenu.ruleMarkers.push(temp);
    mapRightMenu.ruleLine.setPath(mapRightMenu.ruleLocations);
}
// 航线
var track_visible = false;
function show_plane_track(eve) {
    if($(eve.childNodes[1]).hasClass('selected')){
        $(eve.childNodes[1]).removeClass('selected');
    }else{
        $(eve.childNodes[1]).addClass('selected');
    }
    track_visible = !track_visible;
    if (track_visible) {
        for (var did in flights) {
            showLineById(did);
        }
    } else {
        for (var did in flights) {
            if(flights[did].lineMarker){
                flights[did].lineMarker.setMap(null);
            }
        }
    }
}
function showLineById(did) {
    if (flights[did].lineMarker) {
        flights[did].lineMarker.setMap(map);
        flights[did].lineMarker.setPath(flights[did].line);
    }else{
        flights[did].lineMarker =  new google.maps.Polyline({
            map: map,
            path:flights[did].line,
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 1
        });
    }
}
// 标签
var tag_visible = false;1
function show_plane_tag(eve) {
    if($(eve.childNodes[1]).hasClass('selected')){
        $(eve.childNodes[1]).removeClass('selected');
    }else{
        $(eve.childNodes[1]).addClass('selected');
    }
    for (var did in flights) {
        if(flights[did].marker.clicked==tag_visible){
            $('#'+did).children('img').first().click();
        }
    }
    tag_visible = !tag_visible;
}

var window_height, top_bar_height, bottom_bar_height;
function set_map_position() {
    window_height = $(window).height();
    top_bar_height = $(".wrap .navbar-collapse").height();
    bottom_bar_height = $(".footer").height();
    $("#container").css("top", top_bar_height + "px");
    $("#container").css("width", $(window).width() + "px");
    $("#container").css("height", (window_height - top_bar_height - bottom_bar_height) + "px");
}
set_map_position();
$(window).resize(set_map_position);

// 列表
function show_flight_box(){
    $('#flightBox').toggle()
    $("#flightBox").children('.flight-con').html(get_aircraft_list_html());

}
function get_aircraft_list_html() {
    var rows = [];
    for (var id in flights) {
        var point = flights[id].points[0];
        rows.push('<tr onclick="view_plane(\'' + id + '\');"><td><a href="#">' + id + '</a></td><td>' + point.height + '</td><td>' + point.speed + '</td><td>' + point.course + '</td></tr>');
    }
    return '<table id="tbl-tip" class="display" cellspacing="0" width="100%"><thead><tr><th>飞机</th><th>高度</th><th>航速</th><th>航向</th></tr></thead><tbody>' + rows.join('') + "</tbody></table>";
}

function view_plane(did) {
    map.setCenter(flights[did].marker.getPosition());
    map.setZoom(10);
    $('#flightBox').hide();
}

 


