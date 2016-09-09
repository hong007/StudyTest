var TCP_PORT = 8888;
var UDP_PORT = 8888;
var WS_PORT  = 443;
var HTTP_PORT = 80;

function xsend(sock, data)
{
    if (sock.send)
    {
        sock.send(data);
    }
    else
    {
        var len = new Buffer(2);
        len.writeUInt16LE(data.byteLength);
        sock.write(len);
        sock.write(data);
    }
}

//向所有websocket客户端发送
function emit(fid, data)
{
    for (var uid in map_uid_ws)
    {
	if ((map_uid_ws[uid].mfid || fid) == fid)
	{
        	xsend(map_uid_ws[uid], data);
	}
    }
}

var WebSocket = require('faye-websocket');
var map_fid_sock = [];//无人机ID - 自己的socket
var map_fid_uid = []; //无人机ID - 控制它的用户
var map_uid_ws = [];  //用户 - 自己的websocket
var routes = [];

require('http').createServer().on('upgrade', function(request, socket, body) {
    var origin = request.headers.origin;
    if (WebSocket.isWebSocket(request)) {
        var ws = new WebSocket(request, socket, body);
        ws.uid = get_uid();
        console.log("uid =", ws.uid);
        ws.on('open', function(event) {
            map_uid_ws[ws.uid] = ws;
            //报告所有飞机的航路
            for (var fid in routes)
            {
                emit(fid, routes[fid]);
            }
            //报告用户自己的UID
            var buff = new Buffer(2 + ws.uid.length);
            buff.writeUInt16LE(ws.uid.length, 0);
            for (var i = 0; i < ws.uid.length; ++i)
            {
                buff[2 + i] = ws.uid.charCodeAt(i);
            }
            xsend(ws, buff);
        });
        ws.on('message', function(message) {
            var aid = message.data.readUInt8(0);
            var fid = message.data.readUInt8(1);
            if (aid == 253)
            {
                if (map_fid_uid[fid])
                {
                    if (map_fid_uid[fid] != ws.uid)
                    {
                        var body = new Buffer(5 + 2 + ws.uid.length);
                        body.writeUInt8(253, 0);
                        body.writeInt32LE(fid, 1);
                        body.writeUInt16LE(ws.uid.length, 5);
                        for (var i = 0; i < ws.uid.length; ++i)
                        {
                            body[7 + i] = ws.uid.charCodeAt(i);
                        }
                        xsend(map_uid_ws[map_fid_uid[fid]], body);
                        return;
                    }
                }
                var token = get_token(fid);
                var body = new Buffer(7 + token.length);
                body.writeUInt8(250, 0);
                body.writeInt32LE(fid, 1);
                body.writeUInt16LE(token.length, 5);
                for (var i = 0; i < token.length; ++i)
                {
                    body[7 + i] = token.charCodeAt(i);
                }
                xsend(ws, body);
                return;
            }
            else if (aid == 252)
            {
                var fid = message.data.readInt32LE(1);
                if (map_fid_uid[fid] != ws.uid)
                {
                    return;
                }
		delete ws.fid;
                delete map_fid_uid[fid];
                return;
            }
            else if (aid == 251)
            {
                var fid = message.data.readInt32LE(1);
                if (map_fid_uid[fid] != ws.uid)
                {
                    return;
                }
                var uid = message.data.slice(7);
                if (map_uid_ws[uid])
                {
                    map_fid_uid[fid] = uid;
                    var token = get_token(fid);
                    var body = new Buffer(5 + 2 + token.length);
                    body.writeUInt8(250, 0);
                    body.writeInt32LE(fid, 1);
                    body.writeUInt16LE(token.length, 5);
                    for (var i = 0; i < token.length; ++i)
                    {
                        body[7 + i] = token.charCodeAt(i);
                    }
                    xsend(map_uid_ws[uid], body);
		    delete ws.fid;
		    delete map_fid_uid[fid];
                }
                return;
            }
            else if (aid == 249)
            {
		if (message.data.byteLength > 7)
		{
			var token = message.data.slice(7).toString("ascii");
			var tfid = parse_token(token);
			if (parseInt(tfid) == fid && fid && !map_fid_uid[fid])
			{
				map_fid_uid[fid] = ws.uid;
				ws.fid = fid;
			}
			var body = new Buffer(6);
			body.writeUInt8(248, 0);
			body.writeInt32LE(fid, 1);
			body.writeUInt8(!ws.fid, 5);
			xsend(ws, body);
		}
		else
		{
			ws.mfid = fid;
		}
		return;
            }
            if (map_fid_uid[fid] != ws.uid)
            {
                var body = new Buffer(1);
                body.writeUInt8(247, 0);
                xsend(ws, body);
                return;
            }
            xsend(map_fid_sock[fid], message.data);
        });

        ws.on('error', function(event) {
            console.log("ws error", ws.uid, event);
        });

        ws.on('close', function(event) {
            if (ws.fid)
            {
                delete map_fid_uid[ws.fid];
            }
            console.log("ws close", ws.uid);
            delete map_uid_ws[ws.uid];
            ws = null;
        });
    }
}).listen(WS_PORT, '0.0.0.0');

var queue_fids = [];
setInterval(function () {
    var now = (new Date()).getTime();
    var body = new Buffer(6);
    body.writeUInt8(254, 0);
    body.writeUInt8(2, 5);
    for (var fid in queue_fids)
    {
        if (now - queue_fids[fid] > 3000)
        {
            body.writeInt32LE(fid, 1);
            emit(fid, body);
        }
    }
}, 2000);

var Redis = require('ioredis');
var redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    password: 'QZb8PxnFR5i1v1jd',
    db: 0,
    retryStrategy: function (times) {
        return 2000;
    }
})
var udpserver = require('dgram').createSocket('udp4');

udpserver.on('listening', function () {
    var address = udpserver.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
udpserver.on('message', function (data, remote) {
    var fid = data.readUInt8(0);
    queue_fids[fid] = (new Date()).getTime();
    emit(fid, data);
    data.writeUInt8(data.byteLength - 1);
    redis.append(fid, data);
});

udpserver.bind(UDP_PORT, '0.0.0.0');

require('net').createServer(function(sock) {
    var fd = sock.fd;
    var fid = null;
    var buff = null;
    sock.on('data', function(data) {
        if (buff) {
            buff = Buffer.concat([buff, data], buff.length + data.length);
        }
        else {
            buff = data;
        }
        while (buff.length > 2 && buff.length >= buff.readUInt16LE(0) + 2)
        {
            var len = buff.readUInt16LE(0);
            var body = buff.slice(2, 2 + len);
            if (!fid)
            {
                fid = body.readUInt8(1);
                map_fid_sock[fid] = sock;
            }
            if (body.readUInt8(0) == 108)
            {
                routes[fid] = message.data;
            }
            emit(fid, body);
            buff = buff.slice(2 + len);
        }
    });
    sock.on('error', function (err) {
        console.log('ERROR: ', err);
    });
    sock.on('close', function(err) {
        console.log('CLOSED: ', sock.remoteAddress, sock.remotePort, err);
        sock = null;
        if (fid)
        {
            delete queue_fids[fid];
            delete map_fid_sock[fid];
            var body = new Buffer(6);
            body.writeUInt8(254, 0);
            body.writeInt32LE(fid, 1);
            body.writeUInt8(0, 5);
            emit(fid, body);
        }
    });
}).listen(TCP_PORT, '0.0.0.0');

function sha1(content)
{
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(content + "6BQ6zuaG0cjjO1tO");
    return shasum.digest('hex');
}

function get_uid()
{
    return new Buffer((new Date()).getTime() + Math.random().toString(36).substr(2)).toString('base64');
}

function get_token(fid)
{
    var now = (new Date()).getTime();
    var key = fid + "#" + now;
    return new Buffer(key + "#" + sha1(key)).toString('base64');
}

function parse_token(token)
{
    var s = (new Buffer(token, 'base64')).toString();
    if (!s)
    {
        return null;
    }
    var items = s.split("#");
    if (items.length < 3)
    {
        return null;
    }
    var key = items[0] + "#" + items[1];
    if (sha1(key) != items[2]) return null;
    var now = (new Date()).getTime();
    if (now - (parseInt(items[1]) || 0) > 60000)
    {
        return null;
    }
    return parseInt(items[0]);
}


var http = require('http');
var url  = require('url');
var path = require('path');
var querystring = require("querystring");
var mysql = require('mysql');
var post_path = {
    "/submitbatch": 1
};
var pool = mysql.createPool({
    host     : '121.199.53.63',
    user     : 'xunyi',
    password : 'xunyi',
    database : 'xy_exp'
});
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var params = url.parse(request.url, true).query;//GET
    if (post_path[pathname])
    {
        request.setEncoding('utf-8');
        var postData = "";
        request.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });
        request.addListener("end", function () {
            var params = querystring.parse(postData);
            if (pathname == "/submitbatch")
            {
                var keys = [];
                var vals = [];
                for (var key in params)
                {
                    if (/[a-z|_]+/.test(key))
                    {
                        keys.push("`" + key + "`");
                        vals.push(pool.escape(params[key]));
                    }
                }
                var sql = "INSERT INTO `batch`(" + keys.join(",") + ") VALUES(" + vals.join(",") + ")";
                pool.query(sql, function(err, result, fields) {
                    if (err)
                    {
                        console.log(err);
                        response.end(JSON.stringify({"err": 2, "msg": err}));
                    }
                    if (result.affectedRows == 1)
                    {
                        response.end(JSON.stringify({"err": 0}));
                    }
                    else
                    {
                        response.end(JSON.stringify({"err": 1}));
                    }
                });
            }
        });
    }
    else
    {
        if (pathname == "/csv")
        {
            if (params['batchid'])
            {
                ;
            }
            else
            {
                response.end("没有批次号");
            }
        }
        else if (pathname == "/batch")
        {
            var vals = [];
            for (var key in params)
            {
                if (/[a-z|_]+/.test(key))
                {
                    vals.push("`" + key + "` LIKE '%" + pool.escape(params[key]).slice(1, -1) + "%'");
                }
            }
            var sql = "SELECT * FROM `batch` WHERE " + vals.join(" AND ");
            pool.query(sql, function(err, rows, fields) {
                if (err)
                {
                    console.log(err);
                    response.end(JSON.stringify({"err": 1, "msg": err}));
                }
                else
                {
                    response.end(JSON.stringify({"err": 0, "items": rows}));
                }
            });
        }
        else
        {
            response.end("不支持的请求");
        }
    }
});
server.listen(8999);