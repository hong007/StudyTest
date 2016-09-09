var server = "ws://g.fly-cloud.cn/wssend/";
function connect()
{
  
    var ws = new WebSocket(server + encodeURIComponent(getToken()));
    if (!ws)
    {
        alert("您的浏览器版本太低,不支持WebSocket,建议使用最新版本的Chrome Firefox或者IE");
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
    ws.binaryType = "arraybuffer";
    ws.onopen = function ()
    {
        console.log('websocket connected', server);
    };
    ws.onerror = function (error)
    {
        console.log("websocket", error);
    };
    ws.onmessage = function (a){
        var LE = true;
        var d = new DataView(a.data);
        var len = d.getUint8(0);
        var id = String.fromCharCode.apply(null, new Uint8Array(a.data, 1, len));
        if ((d.byteLength - 1 - len) % 24 == 0) {
            var pos = {};
            var should_update_aircraft = false;
            for (var i = 1 + len; i < d.byteLength;) {
                var t = d.getUint32(i, LE);
                i += 4;
                var lat = (d.getInt32(i, LE) / 1e7).toFixed(7);
                i += 4;
                var lng = (d.getInt32(i, LE) / 1e7).toFixed(7);
                i += 4;
                var height = (d.getInt32(i, LE) / 1e3).toFixed(1);
                i += 4;
                var speed = (d.getUint32(i, LE) / 1e2).toFixed(1);
                i += 4;
                var course = (d.getUint32(i, LE) / 1e2).toFixed(1);
                i += 4;
                var tmp = {"id": id, "t": t, "lat": lat, "lng": lng, "height": height, "speed": speed, "course": course};

                if (!pos[id])
                {
                    pos[id] = [];
                }
                pos[id].push(tmp);
                initFlight(id,tmp);

            }
            //console.log((new Date().getTime()/1000).toFixed(0),pos);
            if(flights[id]['runned']){
            }else{
                run(id);
            }
        }
        else
        {
            console.log("package length error ", d.byteLength, len);
        }
    };
    ws.onclose = function () {
        console.log('websocket disconnected, prepare reconnect');
        ws = null;
        setTimeout(connect, 100);
    };
}
connect();
