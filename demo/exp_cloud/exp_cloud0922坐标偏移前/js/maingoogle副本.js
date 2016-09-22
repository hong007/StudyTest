/**
 * Created by Administrator on 2016/6/28 0028.
 */
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('container'), {
        center: {lat: 30.227, lng: 120.024},
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        mapDataProviders:'123',
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM,
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        }
    });
    mainConnect();
}
/*页面事件以及相关参数*/
var flights = {}, nums = 0;
function finished() {
    var marker = new google.maps.Marker({
        position: {lat: 30.227, lng: 120.024},
        map: map,
        label:{
            color:'#ffffff',
            text:'1'
        },
        cursor:'pointer',
        icon:{
            url: '../images/uav/flight1.png',
            origin: new google.maps.Point(0,0),
            size:new google.maps.Size(100,100),
            scaledSize:new google.maps.Size(100,100)
        },
        title: '飞啊飞啊'
    });

    var div = '<div style="width: 100px;text-align: center;margin: 10px;margin-right: 0px;">' +
        '<p><span>Lon:123</span></p>' +
        '<p><span>Lat:123</span></p>' +
        '<p><span>编号:123</span></p>' +
        '<p><span>状态:123</span></p>' +
        '<button class="main-control-button controlKey" style="border-right: 1px solid white;" onclick="control(\'' + 1 + '\')">控制</button>' +
        '<button class="main-control-button" onclick="realtimedate(\'' + 1 + '\')">数据</button>' +
        '</div>';console.info(div.toString());
    var Info = new google.maps.InfoWindow({
        content:div
    });
    marker.addListener('click', function() {
        Info.open(map, marker);
    });
}
var drapExpFlightMarker = function (id, bettery, deg, weight) {
    if (flights[id].gps_raw && flights[id].gps_raw.lon_gps && flights[id].gps_raw.lat_gps) {
        var marker = new google.maps.Marker({
            position: {lat: flights[id].gps_raw.lat_gps, lng: flights[id].gps_raw.lon_gps},
            map: map,
            label:{
                color:'#ffffff',
                text:id.toString()
            },
            cursor:'pointer',
            icon:{
                url: '../images/uav/flight1.png',
                origin: new google.maps.Point(0,0),
                size:new google.maps.Size(100,100),
                scaledSize:new google.maps.Size(100,100)
            },
            title: '飞行器'+id
        });
        var div = '<div style="width: 100px;text-align: center;margin: 10px;margin-right: 0px;">' +
            '<p><span>Lon:'+flights[id].gps_raw.lon_gps+'</span></p>' +
            '<p><span>Lat:'+flights[id].gps_raw.lat_gps+'</span></p>' +
            '<p><span>编号:'+id+'</span></p>' +
            '<p><span>状态:'+system_status_flag[flights[id].heartbeat.base_mode]+'</span></p>' +
            '<button class="main-control-button controlKey" style="border-right: 1px solid white;" data-value="'+id+'" onmousedown="templete(event,'+ id +')" onclick="control(\'' + id + '\')">控制</button>' +
            '<button class="main-control-button" style="border-right: 1px solid white;" onclick="justseesee(\'' + id + '\')">查看</button>' +
            '<button class="main-control-button" onclick="realtimedate(\'' + id + '\')">数据</button>' +
            '</div>';
        var Info = new google.maps.InfoWindow({
            content:div
        });
        marker.addListener('click', function() {
            Info.open(map, marker);
        });
        flights[id]['plain_marker'] = marker;
    }
}
function mainConnect() {
    ws = new WebSocket(server);
    console.info('in connect!');
    if (!ws) {
        alert("您的浏览器版本太低,不支持WebSocket,建议使用最新版本的Chrome Firefox或者IE");
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
    ws.binaryType = "arraybuffer";
    ws.onopen = function () {
        console.log('websocket connected', server);
    };
    ws.onerror = function (error) {
        console.log("websocket", error);
    };
    ws.onmessage = function (res) {
        if(res.data == 'undefined'){
            return;
        }
        var dv = new DataView(res.data);
        var begin = 0;

        var msgid = dv.getUint8(begin);
        if (msgid == 1) {
            //heartbeat解析
            begin += 1;
            var id = dv.getUint8(begin);
            if (flights[id]) {
                flights[id]['heartbeat'] = {};
            } else {
                nums += 1;
                flights[id] = {};
            }
            var infos = {};
            infos['id_uav_xyi'] = id;
            begin += 1;
            infos['id_iso_xyi'] = dv.getUint8(begin);
            begin += 1;
            infos['base_mode'] = dv.getUint8(begin);
            begin += 1;
            infos['system_status'] = dv.getUint8(begin);
            begin += 1;
            infos['xylink_version'] = dv.getUint8(begin);
            begin += 1;
            flights[id]['heartbeat'] = infos;
            $('#flight-no').text(nums);
        } else if (msgid == 2) {
            //battery_status解析
            begin += 1;
            var id = dv.getUint8(begin);
            begin += 1;
            if (flights[id]) {
                var infos = {};
                infos['time_std_s'] = 0;
                infos['time_std_s'] = dv.getUint32(begin, LE);
                begin += 4;
                /* 20160529新协议，增加time_std_s*/
                infos['voltages'] = [];
                for (var i = 0; i < 10; i++) {
                    infos['voltages'][i] = dv.getUint16(begin, LE);
                    begin += 2;
                }
                infos['current_battery'] = dv.getInt16(begin, LE);
                begin += 2;
                infos['battery_remaining'] = dv.getInt8(begin);
                begin += 1;
                flights[id]['battery_status'] = infos;
            }
        } else if (msgid == 3) {
            //local_position_ned解析
            begin += 1;
            var id = dv.getUint8(begin);
            begin += 1;
            if (flights[id]) {
                var infos = {};
                infos['time_std_s'] = dv.getUint32(begin, LE);
                begin += 4;
                infos['x'] = dv.getFloat32(begin, LE).toFixed(2);
                begin += 4;
                infos['y'] = dv.getFloat32(begin, LE).toFixed(2);
                begin += 4;
                infos['z'] = dv.getFloat32(begin, LE).toFixed(2);
                begin += 4;
                infos['vx'] = dv.getFloat32(begin, LE).toFixed(2);
                begin += 4;
                infos['vy'] = dv.getFloat32(begin, LE).toFixed(2);
                begin += 4;
                infos['vz'] = dv.getFloat32(begin, LE).toFixed(2);
                begin += 4;
                infos['dis_m'] = dv.getFloat32(begin, LE).toFixed(1);
                begin += 4;
                flights[id]['local_position_ned'] = infos;
            }
        } else if (msgid == 4) {
            //global_position_int解析
            begin += 1;
            var id = dv.getUint8(begin);
            begin += 1;
            if (flights[id]) {
                var infos = {};
                infos['time_std_s'] = dv.getUint32(begin, LE);
                begin += 4;
                infos['relative_alt'] = dv.getInt32(begin, LE) / 1000;
                begin += 4;
                infos['hdg'] = dv.getUint16(begin, LE) / 100;
                begin += 2;
                flights[id]['global_position_int'] = infos;
                if(flights[id]['plain_marker']){

                }else{
                    drapExpFlightMarker(id, flights[id]['battery_remaining'],infos['hdg']);
                }
            }
        } else if (msgid == 5) {
            //gps_raw解析
            begin += 1;
            var id = dv.getUint8(begin);
            begin += 1;
            if (flights[id]) {
                var infos = {};
                infos['time_std_s'] = dv.getUint32(begin, LE);
                begin += 4;
                infos['fix_type'] = dv.getUint8(begin);
                begin += 1;
                var lat = parseFloat(dv.getInt32(begin, LE)) / 1E7
                infos['lat_gps'] = lat;
                begin += 4;
                var lon = parseFloat(dv.getInt32(begin, LE)) / 1E7
                infos['lon_gps'] = lon;
                begin += 4;
                var alt = parseFloat(dv.getInt32(begin, LE)) / 1E7
                infos['alt_gps'] = alt;
                begin += 4;
                infos['eph'] = dv.getUint16(begin, LE);
                begin += 2;
                infos['epv'] = dv.getUint16(begin, LE);
                begin += 2;
                infos['vel_gps'] = dv.getUint16(begin, LE) / 100;
                begin += 2;
                infos['cog'] = dv.getUint16(begin, LE) / 100;
                begin += 2;
                infos['satellites_visible'] = dv.getUint8(begin);
                begin += 1;
                flights[id]['gps_raw'] = infos;
                if(flights[id]['plain_marker']){
                    flights[id]['plain_marker'].setPosition({lng:infos['lon_gps'], lat:infos['lat_gps']});
                }
            }
        } else if (msgid == 250) {
            console.log('msgid',msgid);
            //gps_raw解析
            begin += 1;
            var id = dv.getInt32(begin,LE);
            begin += 4;
            if (flights[id]) {
                var len = dv.getUint16(begin,LE);
                var token = String.fromCharCode.apply(null, new Uint8Array(res.data, begin+2, len));
                $('#templateTarget').attr('href','singlegoogle.html?id=' + id+'&t='+ encodeURIComponent(token));
                document.getElementById('templateTarget').click()
            }
        }
    };
    ws.onclose = function () {
        console.log('websocket disconnected, prepare reconnect');
        ws = null;
        setTimeout(mainConnect, 100);
    };
}

function control(eve) {
    var length = 5;
    var ab = new ArrayBuffer(length);
    var buffer = new DataView(ab);
    var result = '';
    buffer.setUint8(0, 253);
    buffer.setInt32(1, eve, LE);
    ws.send(buffer);
    console.log(253);
}
/* 我就看看~~ */
function justseesee(eve) {
    $('#templateTarget').attr('href','singlegoogle.html?id=' + eve);
    document.getElementById('templateTarget').click()
}
function realtimedate(eve) {
    $('#templateTarget').attr('href','realtimedata.html?' + eve);
    document.getElementById('templateTarget').click()
}
function templete(p1,id) {
    if(p1.ctrlKey==true){
        console.log('强制控制'+id+'的飞行器');
        $('#pwd').val('');
        $('#confirm').modal('show').data('value',id);
        return;
    }
}
$('#confirm #ok').on('click',function () {
    var confirm = $('#confirm');
    if($('#pwd').val() && confirm.data('value')){
        $('#templateTarget').attr('href','singlegoogle.html?id=' + confirm.data('value') +'&t='+encodeURIComponent($('#pwd').val()));
        document.getElementById('templateTarget').click();
        confirm.modal('hide').data('value','');
    }else{
        alert('口令你不输入？(ノಠ益ಠ)ノ彡┻━┻');
    }
});