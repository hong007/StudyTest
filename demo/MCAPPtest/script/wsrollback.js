/**
 * Created by Administrator on 2016/6/14 0014.
 */
var results = [];
function rbconnect(params) {
var server ="ws://g.fly-cloud.cn/wstrack/";

    if(getToken()){
        var noData = true;
        var id = '';
        console.info(server+encodeURIComponent(getToken())+params);
        var ws = new WebSocket(server+encodeURIComponent(getToken())+params);
        if (!ws){
            alert("您的浏览器版本太低,不支持WebSocket,建议使用最新版本的Chrome Firefox或者IE");
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
        ws.binaryType = "arraybuffer";
        ws.onopen = function (){
            console.log('open');
            long = [];
            id=params.split('/')[1];
            if(oneTimeout){
                window.clearTimeout(oneTimeout);
            }
            if(eachInterval){
                window.clearInterval(eachInterval);
            }
            //map.clearMap();
            console.log('websocket connected', server);
            for(var key in flights){
                flights[key].marker.remove();
            }
            flights = {};
            console.log(flights.length)
        };
        ws.onerror = function (error)
        {
            console.log("websocket", error);
        };
        ws.onmessage = function (a){

            noData = false;
            var LE = true;
            var d = new DataView(a.data);
            var len = 0;
            if (d.byteLength % 24 == 0) {
                var pos = {};
                //var should_update_aircraft = false;
                for (var i = 0; i < d.byteLength;) {
                    var t = d.getUint32(i, LE);
                    i += 4;
                    var lat = (d.getInt32(i, LE) / 1e7);
                    i += 4;
                    var lng = (d.getInt32(i, LE) / 1e7);
                    i += 4;
                    var height = (d.getInt32(i, LE) / 1e3).toFixed(1);
                    i += 4;
                    var speed = (d.getUint32(i, LE) / 1e2).toFixed(1);
                    i += 4;
                    var course = (d.getUint32(i, LE) / 1e2).toFixed(1);
                    i += 4;
                    var lnglat = coordtransform.wgs84togcj02(lng*1, lat*1);
                    var tmp = {"id": id, "t": t, "lat": lnglat[1].toFixed(7), "lng": lnglat[0].toFixed(7), "height": height, "speed": speed, "course": course};
                    // console.info(tmp);
                    /*if (!pos[id])
                    {
                        pos[id] = [];
                    }
                    pos[id].push(tmp);*/
                    initFlight(id,tmp);
                }
            }else{
                console.log("package length error ", d.byteLength, len);
            }
        };
        ws.onclose = function () {
            console.log('websocket closed');
            long = [];
            if(flights && flights[id] && flights[id].points){
                long = flights[id].points;
            }
            if(long.length==0){
                $('[data-shown-for="loading"]').hide();
                alertx('错误！','未找到相关数据');
                ws = null;
            }else{
                /*  初始化变量  */
                param2.searchBegin = params.split('/')[2];
                param2.searchEnd = params.split('/')[3];
                long = long.sort(sortByTimeASC);
                added = [];
                addedLine=[];
                twoPoints=[];
                eachPopulateStep=1;
                count = 0;
                rollbackflight = flights[id].marker;
                $('.button').css('left',0);
                $('.read').width(0);
                $('.big').empty().removeAttr('data-play').append('<i class="fa fa-play" aria-hidden="true"></i>');
                addedLine.push({lng:long[0].lng*1, lat:long[0].lat*1});
                map.setCenter({lng:long[0].lng*1, lat:long[0].lat*1});
                map.setZoom(14);
                $('[data-shown-for="loading"]').hide();
            }
        };
    }
}
function sortByTimeASC(a,b){
    return a.t - b.t;
}