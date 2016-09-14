/**
 * Created by Quanta on 2016/6/13 0013.
 *
 * Updated by Quanta on 2016/7/4 change AMap to GMap
 *
 */
var key = "MiMxNDcwODgyNDk3QGcuZmx5LWNsb3VkLmNuI0RIZkx0dERmZmhVSTZTWHRCU0pnNVRJNmFtST0=";

// 点击触发查询
$('#backTap').on('click', function () {
    $('.modal-box').show();
})

$('#confirm').on('click', function () {


    $('.marker').hide();
    var data = {};
    data['fid'] = $('#fid').val();
    data['start'] = Date.parse($('#flightday').val() + ' ' + $('#backbegin').val()) / 1000;
    data['end'] = Date.parse($('#flightday').val() + ' ' + $('#backend').val()) / 1000;
    $('.modal-box').hide();
    $('.rollback-footer').show();
    $('.start').text(formatHMSFromInt(data['start']));
    $('.end').text(formatHMSFromInt(data['end']));
    param2.startTime = data['start'];
    param2.endTime = data['end'];
    rbconnect('/' + data['fid'] + '/' + data['start'] + '/' + data['end']);
});
var add, long = [], added = [], addedLine = [], step = 1, count = 0, rollbackflight,
    marks = new google.maps.Polyline({
        map: map,
        path: added,
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 1,
        strokeStyle: "solid"
    });

/* 播放于真实时间比例 */
var twoPoints = [],
    oneTimeout,
    eachPopulateStep = 1,
    eachInterval;


var fast = function (eve) {
    if (step < param2.fastest) {
        /* 方案1 */
        /*window.clearTimeout(oneTimeout);
         step = step*2;
         play();*/
        /* 方案2 */
        step = step * 2;
        $('.info').text('x' + step);
        play2();
    }
};
$('.big').on('click', function () {
    $(this).toggleClass('on');
    if (long.length == 0) {
        alertx('错误！', '未找到相关数据');
        window.clearInterval(add);
        $('.button').css('left', 0);
        $('.read').width(0);
        return;
    } else if (long.length != 0 && count == long.length) {
        $('.button').css('left', 0);
        $('.read').width(0);
        return;
    }
    if (emptyPlayInterval) {
        window.clearInterval(emptyPlayInterval);
    }
    window.clearInterval(eachInterval);
    if ($(this).attr('data-play')) {
        $(this).empty().append('<i class="fa fa-play" aria-hidden="true"></i>');
        $(this).removeAttr('data-play');
    } else {
        $(this).empty().append('<i class="fa fa-pause" aria-hidden="true"></i>');
        play2();
        $(this).attr('data-play', true);
    }
});
var back = function () {
    if (step > param2.timestep) {
        /* 方案1 */
        /*window.clearTimeout(oneTimeout);
         step = step/2;
         play();*/
        /* 方案2 */
        step = step / 2;
        $('.info').text('x' + step);
        play2();
    }
};
//进度条拖动实现方式
var moveflag = false;
$('.jindu').on('mousedown', function (e) {
    if (long.length == 0) {
        alertx('错误！', '未找到相关数据');
        window.clearInterval(add);
        $('.button').css('left', 0);
        $('.read').width(0);
        return;
    } else if ($('.big').attr('data-play')) {
        moveflag = true;
        if (oneTimeout) {
            window.clearTimeout(oneTimeout);
        }
        if (eachInterval) {
            window.clearInterval(eachInterval);
        }
        if (emptyPlayInterval) {
            window.clearInterval(emptyPlayInterval);
        }
    }
}).on('mouseup', function (e) {
    if (long.length == 0) {
        alertx('错误！', '未找到相关数据');
        window.clearInterval(add);
        $('.button').css('left', 0);
        $('.read').width(0);
        return;
    } else if ($('.big').attr('data-play')) {
        if (eachInterval) {
            window.clearInterval(eachInterval);
        }
        param2.countTime = (e.offsetX / $(this).width()) * param2.fullTime;
        $('.button').css('left', e.offsetX);
        $('.read').width(e.offsetX);
        if (0 < param2.countTime && param2.countTime < (long[0].t - param2.startTime) * 1000 / param2.timestep) {
            param2.eachTime = (((long[0].t - param2.startTime) / param2.timestep - param2.countTime)) * 1000;
            param2.steps = param2.eachTime / (param2.eachStep * step);
            play2();//方案2
        } else if ((long[long.length - 1].t - param2.startTime) * 1000 / param2.timestep < param2.countTime && param2.countTime < param2.fullTime) {
            param2.eachTime = ((long[long.length - 1].t / param2.timestep - param2.countTime)) * 1000;
            param2.steps = param2.eachTime / (param2.eachStep * step);
            added = [];
            for (var c in long) {
                added.push({lng: long[c].lng * 1, lat: long[c].lat * 1});
            }
            addedLine = added;
            rollbackflight.setPosition({lng: long[long.length - 1].lng * 1, lat: long[long.length - 1].lat * 1});
            flights[long[0].id].info.setPosition({
                lng: long[long.length - 1].lng * 1,
                lat: long[long.length - 1].lat * 1
            });
            flights[long[0].id].info.refeash();
            marks.setPath(addedLine);
            play2();//方案2
        } else {
            added = [];
            count = binarySearch(long, param2.countTime);
            var tempList = long.slice(0, count);
            for (var i in tempList) {
                added.push({lng: tempList[i].lng * 1, lat: tempList[i].lat * 1});
            }
            addedLine = added;
            rollbackflight.setPosition({lng: long[count].lng * 1, lat: long[count].lat * 1});
            flights[long[0].id].info.setPosition({lng: long[count].lng * 1, lat: long[count].lat * 1});
            flights[long[0].id].info.refeash();
            marks.setPath(addedLine);
            param2.countTime = (long[count].t - param2.startTime) * 1000 / param2.timestep;
            play2();//方案2
        }
        // moveflag = false;
    }

}).on('mousemove', function (e) {
    if (moveflag == true) {
        $('.button').css('left', e.offsetX);
        $('.read').width(e.offsetX);
        $('.now').text(formatHMSFromInt((e.offsetX / $(this).width()) * (param2.endTime - param2.startTime) + param2.startTime)).css('left', e.offsetX - 20);
    }
});


/*
 * 方案2：通过计算第一个点和最后一个点的时间间隔来计算进度条
 * 优点：进度条一直都会走，不会因为点之间的间隔过长而受影响
 * 播放速度为正常速度的八分之一
 */
var param2 = {
    searchBegin: 0,//时间播放比
    searchEnd: 0,//时间播放比
    fastest: 32,//时间播放比
    timestep: 1,//时间播放比
    eachStep: 25,//默认每一个小步伐的毫秒数
    steps: 0,//每个点之间的步伐数
    startTime: 0,//开始时间
    timeCrossStep: 60000,//设置两点间最长时间间隔，超过就考虑成停止了，毫秒单位
    endTime: 0,//结束时间
    fullTime: 0,//整个回放的时间差
    eachTime: 0,//每个两点间的时间差
    lastPoint: {},//上一个点信息
    lastPointIsWrong: false,//上一个点信息
    flightInfoMark: null,//上一个点信息
    countTime: 0//用来记录已播放的时间,
};
var emptyPlayInterval;
var play2 = function () {
    if (long[0].t > (param2.startTime * 1000 + param2.countTime * param2.timestep) / 1000) {
        param2.lastPoint = long[0];
        param2.eachTime = ((long[0].t - param2.startTime) * 1000 / param2.timestep - param2.countTime);
        param2.fullTime = (param2.endTime - param2.startTime) * 1000 / param2.timestep;
        param2.steps = param2.eachTime / (param2.eachStep * step);
        added = [];
        addedLine = added;
        if (emptyPlayInterval) {
            window.clearInterval(emptyPlayInterval);
        }
        emptyPlayInterval = window.setInterval("emptyPlay2()", param2.eachStep);
    } else if (param2.fullTime > 0 && count < long.length - 1) {
        rotate(rollbackflight.div.id, long[count], long[count + 1]);
        $('.now').text(formatHMSFromInt(long[count].t * 1)).css('left', 'calc(' + (param2.countTime / param2.fullTime) * 100 + '% - 20px)');
        if (param2.lastPointIsWrong) {
            param2.eachTime = ((long[count + 1].t - param2.lastPoint.t) / param2.timestep) * 1000;
            //added.push([param2.lastPoint.lng,param2.lastPoint.lat]);
        } else {
            param2.eachTime = ((long[count + 1].t - long[count].t) / param2.timestep) * 1000;
            added.push({lng: long[count].lng * 1, lat: long[count].lat * 1});
        }
        param2.steps = param2.eachTime / (param2.eachStep * step);
        if (eachInterval) {
            window.clearInterval(eachInterval);
        }
        //get_popup_txt_params(this._currentcontent[0].id,this.getPosition().lng,this.getPosition().lat,this._currentcontent[0].height,this._currentcontent[0].speed,this._currentcontent[0].course)
        //console.log('现在到几点了？',count,new Date(long[count].t*1000));
        $('.button').css('left', (param2.countTime / param2.fullTime) * 100 + '%');
        $('.read').width((param2.countTime / param2.fullTime) * 100 + '%');
        if (param2.eachTime > 0 && param2.eachTime < param2.timeCrossStep / param2.timestep) {
            param2.lastPointIsWrong = false;
            //oneTimeout = window.setTimeout("play2()",param2.eachTime);
            if (param2.steps < 1) {
                rollbackflight.setPosition({lng: long[count].lng, lat: long[count].lat});
                flights[long[0].id].info.setPosition({lng: long[count].lng, lat: long[count].lat});
                flights[long[0].id].info.refeash();
                addedLine.push({lng: long[count].lng * 1, lat: long[count].lat * 1});
                rotate(rollbackflight.div.id, long[count], long[count + 1]);
                marks.setPath(addedLine);
            } else {
                twoPoints = [long[count], long[count + 1]];
                eachInterval = window.setInterval("subPlay2()", param2.eachStep);
            }
            count++;
        } else if (param2.eachTime >= param2.timeCrossStep / param2.timestep) {
            emptyPlayInterval = window.setInterval("emptyPlay2()", param2.eachStep);
        } else {
            if (!param2.lastPointIsWrong) {
                param2.lastPointIsWrong = true;
                param2.lastPoint = long[count];
            }
            count++;
            play2();
        }
    } else if (count >= long.length - 1) {
        added = [];
        addedLine = [];
        twoPoints = [];
        eachPopulateStep = 1;
        count = 0;
        $('.big').removeAttr('data-play').empty().append('<i class="fa fa-play" aria-hidden="true"></i>');
        window.clearInterval(add);
    } else {
        if (long[0].t > param2.startTime) {
            param2.lastPoint = long[0];
            param2.fullTime = (param2.endTime - param2.startTime) * 1000 / param2.timestep;
            param2.eachTime = ((long[0].t - param2.startTime) / param2.timestep) * 1000;
            param2.steps = param2.eachTime / (param2.eachStep * step);
            emptyPlayInterval = window.setInterval("emptyPlay2()", param2.eachStep);
        } else {
            param2.lastPoint = long[0];
            param2.fullTime = (param2.endTime - param2.startTime) * 1000 / param2.timestep;
            play2();
        }
    }

};
function subPlay2() {
    var p1 = twoPoints[0];
    var p2 = twoPoints[1];
    if (eachPopulateStep <= param2.steps) {
        rollbackflight.setPosition({
            lng: p1.lng * 1 + (p2.lng - p1.lng) * eachPopulateStep / param2.steps,
            lat: p1.lat * 1 + (p2.lat - p1.lat) * eachPopulateStep / param2.steps
        });
        flights[p1.id].info.setPosition({
            lng: p1.lng * 1 + (p2.lng - p1.lng) * eachPopulateStep / param2.steps,
            lat: p1.lat * 1 + (p2.lat - p1.lat) * eachPopulateStep / param2.steps
        });
        flights[p1.id].info.setContent(get_popup_txt_params(p1.id, p1.lng * 1 + (p2.lng - p1.lng) * eachPopulateStep / param2.steps, p1.lat * 1 + (p2.lat - p1.lat) * eachPopulateStep / param2.steps, p1.height, p1.speed, p1.course));
        flights[p1.id].info.refeash();
        addedLine.push({lng: rollbackflight.getPosition().lng() * 1, lat: rollbackflight.getPosition().lat() * 1});
        marks.setPath(addedLine);
        if (Math.floor(param2.steps) == eachPopulateStep && param2.steps > eachPopulateStep) {
            param2.countTime = (long[count].t - param2.startTime) * 1000 / param2.timestep;
        }
        $('.button').css('left', (param2.countTime / param2.fullTime) * 100 + '%');
        $('.read').width((param2.countTime / param2.fullTime) * 100 + '%');
        rotate(rollbackflight.div.id, {
            lng: p1.lng * 1 + (p2.lng - p1.lng) * (eachPopulateStep - 1) / param2.steps,
            lat: p1.lat * 1 + (p2.lat - p1.lat) * (eachPopulateStep - 1) / param2.steps
        }, {
            lng: p1.lng * 1 + (p2.lng - p1.lng) * eachPopulateStep / param2.steps,
            lat: p1.lat * 1 + (p2.lat - p1.lat) * eachPopulateStep / param2.steps
        });
        eachPopulateStep++;
        param2.countTime += param2.eachStep * step;
    } else if (param2.steps < eachPopulateStep && eachPopulateStep == Math.floor(param2.steps) + 1) {
        rollbackflight.setPosition({lng: p2.lng * 1, lat: p2.lat * 1});
        addedLine.push({lng: rollbackflight.getPosition().lng() * 1, lat: rollbackflight.getPosition().lat() * 1});
        marks.setPath(addedLine);
        param2.countTime = (long[count].t * 1000 - param2.startTime * 1000) / param2.timestep;
        $('.button').css('left', (param2.countTime / param2.fullTime) * 100 + '%');
        $('.read').width((param2.countTime / param2.fullTime) * 100 + '%');
        eachPopulateStep++;
    } else {
        window.clearInterval(eachInterval);
        eachPopulateStep = 1;
        play2();
    }
};
function emptyPlay2() {
    var p1 = twoPoints[0];
    var p2 = twoPoints[1];
    marks.setPath(addedLine);
    $('.now').text(formatHMSFromInt((param2.startTime * 1000 + param2.countTime * param2.timestep) / 1000)).css('left', 'calc(' + (param2.countTime / param2.fullTime) * 100 + '% - 20px)');
    if (eachPopulateStep <= param2.steps) {
        $('.button').css('left', (param2.countTime / param2.fullTime) * 100 + '%');
        $('.read').width((param2.countTime / param2.fullTime) * 100 + '%');
        eachPopulateStep++;
        param2.countTime += param2.eachStep * step;
    } else if (param2.steps < eachPopulateStep && eachPopulateStep == Math.floor(param2.steps) + 1) {
        $('.button').css('left', (param2.countTime / param2.fullTime) * 100 + '%');
        $('.read').width((param2.countTime / param2.fullTime) * 100 + '%');
        eachPopulateStep++;
    } else {
        param2.countTime = (long[0].t - param2.startTime) * 1000 / param2.timestep;
        window.clearInterval(eachInterval);
        window.clearInterval(emptyPlayInterval);
        eachPopulateStep = 1;
        play2();
    }
}
/* 二分法计算 */
function binarySearch(data, clickTime) {
    var e = data.length, s = 0, ok = false;
    while (s <= e) {
        var m = s + Math.floor((e - s) / 2);
        if ((data[m].t - param2.startTime) * 1000 / param2.timestep <= clickTime && clickTime <= (data[m + 1].t - param2.startTime) * 1000 / param2.timestep) {
            return m;
        } else if ((data[m].t - param2.startTime) * 1000 / param2.timestep > clickTime) {
            e = m;
        } else if (clickTime > (data[m + 1].t - param2.startTime) * 1000 / param2.timestep) {
            s = m;
        }
    }
}
$('#cid').change();
