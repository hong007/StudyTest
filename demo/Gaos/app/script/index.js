// window.addEventListener( "load", function() {
//     FastClick.attach( document.body );
// }, false );
// 初始化地图
var map,GPS= [104.09820556640625, 30.637912028341127],
    drawingManager,
    infoCounts = 0,
    rememberFlag=true,
    iconSize = ($(window).width()/1440)*36;
var initMap = function () {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: GPS[1], lng: GPS[0]},
        disableDefaultUI: false,
        scaleControl:true,
        streetViewControl: false,
        mapTypeControl: true,
        draggable: true,
        // zoomControlOptions:{
        //     position:google.maps.ControlPosition.LEFT_TOP
        // },
        mapTypeControlOptions:{
            position:google.maps.ControlPosition.LEFT_TOP
        },

        // zoomControl: true,
        zoom: 10           
    });
// 设定经纬度
    map.addListener('mousemove', function (e) {
        $('#hander-infos>.lng>span').text(changeLngToDMS(e.latLng.lng()));
        $('#hander-infos>.lat>span').text(changeLatToDMS(e.latLng.lat()));
    });

    map.addListener('center_changed',function () {
        var mapinfos = getJSONValues('mapinfos');
        if(rememberFlag==true){
            if(infoCounts>1){
                mapinfos['center'] = map.getCenter();
                setValues('mapinfos',JSON.stringify(mapinfos));
            }
        }
        infoCounts++;
    });
    map.addListener('zoom_changed',function (e,b) {
        var mapinfos = getJSONValues('mapinfos');
        if(rememberFlag==true){
            if(infoCounts>1){
                mapinfos['zoom'] = map.getZoom();
                setValues('mapinfos',JSON.stringify(mapinfos));
            }
        }
        infoCounts++;
    });
    map.addListener('maptypeid_changed',function (e,b) {
        var mapinfos = getJSONValues('mapinfos');
        if(rememberFlag==true){
            if(infoCounts>1){
                mapinfos['maptype'] = map.getMapTypeId();
                setValues('mapinfos',JSON.stringify(mapinfos));
            }
        }
        infoCounts++;
    });
}
initMap();
// 控制地图宽高
function set_map_position() {
    $("#map_canvas").css("width", $(window).width() + "px");
    var botHeight = $('.bottom-msg').height();
    $("#map_canvas").css("height", $(window).height()- botHeight + "px");
}
set_map_position();

/* 画空域 */
var infoWindow = new google.maps.InfoWindow();
var spaceLines={},spaceLinesInfos;
function drawSpaceLine(params) {
    /* 增加权限校验 */
    if(getValues('rights').split(',').includes(4000+'')){
        if(spaceLinesInfos){
            for(var k in spaceLines){
                var lines = spaceLines[k];
                for(var l in lines){
                    if(lines[l]){
                        lines[l].setMap(null);
                    }
                }
            }
            spaceLines = {};
            drawSpaceLineDetails(spaceLinesInfos,params);
        }else{
            ajax({
                url:'region',
                data:{
                    action:'index'
                },
                success:function (result) {
                    if(result.err==0){
                        spaceLinesInfos = result.items;
                        drawSpaceLineDetails(spaceLinesInfos,params);
                    }else{
                        alertx('错误！',result.msg);
                    }
                }
            });
        }
    }
}
function drawSpaceLineDetails(items,params) {
    for(var i=0;i<items.length;i++){
        var spaceControl,details=[],
            element = items[i],
            property = JSON.parse(element.property);
        if(!params.includes(element.type)){
            continue;
        }
        if(!spaceLines[element.type*1]){
            spaceLines[element.type*1] = [];
        }
        if(element.type*1==255 && params.includes(element.type*1)){
            $.each(property.path,function (k) {
                details.push({
                    lng:changeDMSToLng(property.path[k].lng),
                    lat:changeDMSToLat(property.path[k].lat)
                });
            });
            //画多边形
            spaceControl = new google.maps.Polygon({
                map:map,
                path:details,
                fillColor:'#289BEC',
                fillOpacity:0.4,
                strokeColor:'#40A4FB',
                content:element.name,
                strokeWeight:2
            });
        }else if(element.type*1==253 && params.includes(element.type*1)){
            //画圆
            if(property.radius){
                spaceControl = new google.maps.Circle({
                    map: map,
                    center:{
                        lng:changeDMSToLng(property.path[0].lng),
                        lat:changeDMSToLat(property.path[0].lat)
                    },
                    fillColor:'#289BEC',
                    fillOpacity:0.4,
                    strokeColor:'#40A4FB',
                    radius:property.radius*1,
                    content:element.name + '<br/>半径为: '+property.radius+'米',
                    strokeWeight:2
                });
            }
        }else if((element.type*1==254 || element.type*1==252) && params.includes(element.type*1)){
            //画航线
            $.each(property.path,function (k) {
                details.push({
                    lng:changeDMSToLng(property.path[k].lng),
                    lat:changeDMSToLat(property.path[k].lat)
                });
            });
            //画多边形
            spaceControl = new google.maps.Polyline({
                map: map,
                path: details,
                strokeColor: '#e63f00',
                strokeOpacity: 1,
                strokeWeight: 3,
                content:element.name,
                strokeStyle: "solid"
            });
        }else if(element.type*1==0 && params.includes(element.type*1)){
            //起降点
            spaceControl = new google.maps.Marker({
                map: map,
                draggable:true,
                icon: {
                    size: new google.maps.Size(16,16),
                    anchor: new google.maps.Point(8,8),
                    origin: new google.maps.Point(0,0),
                    scaledSize: new google.maps.Size(16,16),
                    url:'images/marker_smart_packing.png'
                },
                zIndex:9999,
                content:element.name,
                position: {
                    lng:changeDMSToLng(property.path[0].lng),
                    lat:changeDMSToLat(property.path[0].lat)
                }
            });
        }
        if(spaceControl){
            console.log(spaceControl.content);
            spaceControl.addListener('click',function (e) {
                infoWindow.setContent(this.content);
                infoWindow.open(map, this);
                infoWindow.setPosition(e.latLng);
            });
            spaceLines[element.type*1].push(spaceControl);
        }
    }
}

/* 回调显示数据 */
function callbackUserInfos() {
    var mapinfos = getJSONValues('mapinfos');
    if(mapinfos.toString() != '{}'){
        if(mapinfos['zoom']){
            map.setZoom(mapinfos['zoom']);
        }
        if(mapinfos['center']){
            map.setCenter(mapinfos['center']);
        }
        if(mapinfos['maptype']){
            map.setMapTypeId(mapinfos['maptype']);
        }
        if(mapinfos['elements']){
            drawSpaceLine(mapinfos['elements']);
            $('#elementspanel input[type=checkbox]').each(function () {
                if(mapinfos['elements'].includes(this.value*1)){
                    this.checked = true;
                }else{
                    this.checked = false;
                }
            });
        }else{
            $('#elementspanel input[type=checkbox]').each(function () {
                this.checked = false;
            });
            drawSpaceLine([]);
        }

    }
}
callbackUserInfos();

// 获取底部信息
function getBottom() {
    geocoder.getAddress(GPS, function (status, result) {
        if (status == 'complete') {
            var adcode = result.regeocode.addressComponent.adcode;
            var address = result.regeocode.formattedAddress;
            var winfo = ['', ''];
            weather.getLive(adcode, function (err, data) {
                if (err) {
                    winfo[0] = '<div style="color: #3366FF;">获取城市信息失败' + '</div>';
                }else {
                    var strB = [];
                    strB.push('<div style="font-size:24px;">' + data.province + data.city +'</div>');
                    strB.push('<div style="color:#999;">经度：' + changeLngToDMS(GPS[0]) + '</div>');
                    strB.push('<div style="color:#999;">纬度：' + changeLngToDMS(GPS[1]) + '</div>');
                    winfo[0] = strB.join('');
                    $('#bottom-con').html(strB).addClass('bottom-con-pad');
                    set_map_position();
                }
            });;
        }else {
            alert("出错了");
        }
    })
}
// 要素
function factorTap(){
     $('#elementspanel').toggle();
}
function refreshElements(e){
    var mapinfos = getJSONValues('mapinfos');
    var target = e;
    var val = target.value*1;
    if(mapinfos['elements'] && mapinfos['elements'].includes(val)){
        var key = mapinfos['elements'].forEach(function (v,k) {
            if(v==val){
                if(target.class){
                    mapinfos['elements'].push(val);
                console.log(mapinfos['elements'])

                }else{
                    mapinfos['elements'].splice(k,1);
                }
            }
        });
    }else if(mapinfos['elements']){
        mapinfos['elements'].push(val);
    }else{
        mapinfos['elements'] = [];
        mapinfos['elements'].push(val);
    }
    drawSpaceLine(mapinfos['elements']);
    setValues('mapinfos',JSON.stringify(mapinfos));
}
// 点击状态
// $('.flight-sky').on('click',function(){
//     $(this).toggleClass('on');
// });
// 关闭
$('.closeBox').on('click',function(){
    $(this).parents('.closeBoxDiv').hide();
    $('.flight-sky').removeClass('on');
});
$('.right-float-menu-li').on('click',function(){
    var pdon = $(this).siblings().children();
    if(pdon.hasClass('on')){
        $(this).siblings().children('.on').click();
        $('.closeBoxDiv').hide();
    }
    pdon.removeClass('on');
    $(this).children().toggleClass('on');
});
$('.float-dialog>div').on('click',function(){
    $(this).toggleClass('on');
})

// css相关
// function mapCss(){
//     // var aaa = $('.gm-style-mtc').parents('.gmnoprint').css('bottom','none');
//     // $('.gm-style-mtc').hide()
//     alert('1')

// }











