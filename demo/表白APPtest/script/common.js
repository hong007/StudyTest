/**
 * Created by andy on 15-5-23.
 */
/*
    计算经纬度之间的距离
 */
/**
 * 融云消息类型
 */
var CONSTANT_RONG_MSG_TYPE = {
    TEXT: 'RC:TxtMsg',
    IMG: 'RC:ImgMsg',
    IMGTEXT: 'RC:ImgTextMsg',
    VOICE: 'RC:VcMsg',
    LOCATION: 'RC:LBSMsg'
};
/**
 * 融云会话类型
 */
var CONSTANT_RONG_CHAT_TYPE = {
    PRIVATE: 'PRIVATE',// 单聊
    GROUP: 'GROUP',// 群组
    DISCUSSION: 'DISCUSSION',// 讨论组
    CHATROOM: 'CHATROOM',// 聊天室
    SYSTEM: 'SYSTEM',// 系统
    CUSTOMER_SERVICE: 'CUSTOMER_SERVICE'// 客服
}


function checkbox(obj) {
    var $checkbox = $(obj);
    $checkbox.prev().prop('checked', !$checkbox.prev().prop('checked'));
    $checkbox.find('.ui-switch-before').toggleClass('before');
    $checkbox.find('.ui-switch-after').toggleClass('after');
}
/**
 * 融云转换code --> message
 */
function errcode2msg(errCode) {
    switch (errCode) {
        case -9:
            errMsg = '断开连接';
            break;
        case -2:
            errMsg = '发送处理失败';
            break;
        case -1:
            errMsg = '未知错误';
            break;
        case 1:
            errMsg = '网络不可用';
            break;
        case 2:
            errMsg = '连接中';
            break;
        case 6:
            errMsg = '用户账户在其他设备登录，本机会被踢掉线';
            break;
        case 7:
            errMsg = '用户账户在 Web 端登录';
            break;
        case 405:
            errMsg = '在黑名单中';
            break;
        case 2002:
            errMsg = '数据包不完整，请求数据包有缺失';
            break;
        case 2003:
            errMsg = '服务器不可用';
            break;
        case 2004:
            errMsg = '错误的令牌（Token），Token 解析失败，请重新向身份认证服务器获取 Token';
            break;
        case 2005:
            errMsg = '可能是错误的 App Key，或者 App Key 被服务器积极拒绝';
            break;
        case 2006:
            errMsg = '服务端数据库错误';
            break;
        case 3001:
            errMsg = '服务器超时';
            break;
        case 5004:
            errMsg = '服务器超时';
            break;
        case -10000:
            errMsg = '未调用 init 方法进行初始化';
            break;
        case -10001:
            errMsg = '未调用 connect 方法进行连接';
            break;
        case -10002:
            errMsg = '输入参数错误';
            break;
        case 0:
            errMsg = '连接成功';
            break;
    }
    return errMsg;
};
var face = {
    '[微笑]': '<img src="../image/chatBox/emotion/Expression_1.png" />',
    '[撇嘴]': '<img src="../image/chatBox/emotion/Expression_2.png" />',
    '[色]': '<img src="../image/chatBox/emotion/Expression_3.png" />',
    '[发呆]': '<img src="../image/chatBox/emotion/Expression_4.png" />',
    '[得意]': '<img src="../image/chatBox/emotion/Expression_5.png" />',
    '[流泪]': '<img src="../image/chatBox/emotion/Expression_6.png" />',
    '[害羞]': '<img src="../image/chatBox/emotion/Expression_7.png" />',
    '[闭嘴]': '<img src="../image/chatBox/emotion/Expression_8.png" />',
    '[睡]': '<img src="../image/chatBox/emotion/Expression_9.png" />',
    '[大哭]': '<img src="../image/chatBox/emotion/Expression_10.png"/>',
    '[尴尬]': '<img src="../image/chatBox/emotion/Expression_11.png"/>',
    '[发怒]': '<img src="../image/chatBox/emotion/Expression_12.png"/>',
    '[调皮]': '<img src="../image/chatBox/emotion/Expression_13.png" />',
    '[呲牙]': '<img src="../image/chatBox/emotion/Expression_14.png" />',
    '[惊讶]': '<img src="../image/chatBox/emotion/Expression_15.png" />',
    '[难过]': '<img src="../image/chatBox/emotion/Expression_16.png" />',
    '[酷]': '<img src="../image/chatBox/emotion/Expression_17.png" />',
    '[冷汗]': '<img src="../image/chatBox/emotion/Expression_18.png" />',
    '[抓狂]': '<img src="../image/chatBox/emotion/Expression_19.png" />',
    '[吐]': '<img src="../image/chatBox/emotion/Expression_20.png" />',
    '[偷笑]': '<img src="../image/chatBox/emotion/Expression_21.png" />',
    '[愉快]': '<img src="../image/chatBox/emotion/Expression_22.png" />',
    '[白眼]': '<img src="../image/chatBox/emotion/Expression_23.png" />',
    '[傲慢]': '<img src="../image/chatBox/emotion/Expression_24.png" />',
    '[饥饿]': '<img src="../image/chatBox/emotion/Expression_25.png" />',
    '[困]': '<img src="../image/chatBox/emotion/Expression_26.png" />',
    '[恐惧]': '<img src="../image/chatBox/emotion/Expression_27.png" />',
    '[流汗]': '<img src="../image/chatBox/emotion/Expression_28.png" />',
    '[憨笑]': '<img src="../image/chatBox/emotion/Expression_29.png" />',
    /*从这*/
    '[悠闲]': '<img src="../image/chatBox/emotion/Expression_30.png" />',
    '[奋斗]': '<img src="../image/chatBox/emotion/Expression_31.png" />',
    '[咒骂]': '<img src="../image/chatBox/emotion/Expression_32.png" />',
    '[疑问]': '<img src="../image/chatBox/emotion/Expression_33.png" />',
    '[嘘]': '<img src="../image/chatBox/emotion/Expression_34.png" />',
    '[晕]': '<img src="../image/chatBox/emotion/Expression_35.png" />',
    '[疯了]': '<img src="../image/chatBox/emotion/Expression_36.png" />',
    '[衰]': '<img src="../image/chatBox/emotion/Expression_37.png" />',
    '[骷髅]': '<img src="../image/chatBox/emotion/Expression_38.png" />',
    '[敲打]': '<img src="../image/chatBox/emotion/Expression_39.png"/>',
    '[再见]': '<img src="../image/chatBox/emotion/Expression_40.png"/>',
    '[擦汗]': '<img src="../image/chatBox/emotion/Expression_41.png"/>',
    '[抠鼻]': '<img src="../image/chatBox/emotion/Expression_42.png" />',
    '[鼓掌]': '<img src="../image/chatBox/emotion/Expression_43.png" />',
    '[糗大了]': '<img src="../image/chatBox/emotion/Expression_44.png" />',
    '[坏笑]': '<img src="../image/chatBox/emotion/Expression_45.png" />',
    '[左哼哼]': '<img src="../image/chatBox/emotion/Expression_46.png" />',
    '[右哼哼]': '<img src="../image/chatBox/emotion/Expression_47.png" />',
    '[哈欠]': '<img src="../image/chatBox/emotion/Expression_48.png" />',
    '[鄙视]': '<img src="../image/chatBox/emotion/Expression_49.png" />',
    '[委屈]': '<img src="../image/chatBox/emotion/Expression_50.png" />',
    '[快哭了]': '<img src="../image/chatBox/emotion/Expression_51.png" />',
    '[阴险]': '<img src="../image/chatBox/emotion/Expression_52.png" />',
    '[亲亲]': '<img src="../image/chatBox/emotion/Expression_53.png" />',
    '[吓]': '<img src="../image/chatBox/emotion/Expression_54.png" />',
    '[可怜]': '<img src="../image/chatBox/emotion/Expression_55.png" />',
    '[菜刀]': '<img src="../image/chatBox/emotion/Expression_56.png" />',
    '[西瓜]': '<img src="../image/chatBox/emotion/Expression_57.png" />',
    '[啤酒]': '<img src="../image/chatBox/emotion/Expression_58.png" />',
    '[篮球]': '<img src="../image/chatBox/emotion/Expression_59.png" />',
    '[乒乓]': '<img src="../image/chatBox/emotion/Expression_60.png" />',
    '[咖啡]': '<img src="../image/chatBox/emotion/Expression_61.png" />',
    '[饭]': '<img src="../image/chatBox/emotion/Expression_62.png" />',
    '[猪头]': '<img src="../image/chatBox/emotion/Expression_63.png" />',
    '[玫瑰]': '<img src="../image/chatBox/emotion/Expression_64.png" />',
    '[凋谢]': '<img src="../image/chatBox/emotion/Expression_65.png" />',
    '[嘴唇]': '<img src="../image/chatBox/emotion/Expression_66.png" />',
    '[爱心]': '<img src="../image/chatBox/emotion/Expression_67.png" />',
    '[心碎]': '<img src="../image/chatBox/emotion/Expression_68.png"/>',
    '[蛋糕]': '<img src="../image/chatBox/emotion/Expression_69.png"/>',
    '[闪电]': '<img src="../image/chatBox/emotion/Expression_70.png"/>',
    '[炸弹]': '<img src="../image/chatBox/emotion/Expression_71.png" />',
    '[刀]': '<img src="../image/chatBox/emotion/Expression_72.png" />',
    '[足球]': '<img src="../image/chatBox/emotion/Expression_73.png" />',
    '[瓢虫]': '<img src="../image/chatBox/emotion/Expression_74.png" />',
    '[便便]': '<img src="../image/chatBox/emotion/Expression_75.png" />',
    '[月亮]': '<img src="../image/chatBox/emotion/Expression_76.png" />',
    '[太阳]': '<img src="../image/chatBox/emotion/Expression_77.png" />',
    '[礼物]': '<img src="../image/chatBox/emotion/Expression_78.png" />',
    '[拥抱]': '<img src="../image/chatBox/emotion/Expression_79.png" />',
    '[强]': '<img src="../image/chatBox/emotion/Expression_80.png" />',
    '[弱]': '<img src="../image/chatBox/emotion/Expression_81.png" />',
    '[握手]': '<img src="../image/chatBox/emotion/Expression_82.png" />',
    '[胜利]': '<img src="../image/chatBox/emotion/Expression_83.png" />',
    '[抱拳]': '<img src="../image/chatBox/emotion/Expression_84.png" />',
    '[勾引]': '<img src="../image/chatBox/emotion/Expression_85.png" />',
    '[拳头]': '<img src="../image/chatBox/emotion/Expression_86.png" />',
    '[差劲]': '<img src="../image/chatBox/emotion/Expression_87.png" />',
    '[爱你]': '<img src="../image/chatBox/emotion/Expression_88.png" />',
    '[NO]': '<img src="../image/chatBox/emotion/Expression_89.png" />',
    '[OK]': '<img src="../image/chatBox/emotion/Expression_90.png" />',
    '[爱情]': '<img src="../image/chatBox/emotion/Expression_91.png" />',
    '[飞吻]': '<img src="../image/chatBox/emotion/Expression_92.png" />',
    '[跳跳]': '<img src="../image/chatBox/emotion/Expression_93.png" />',
    '[发抖]': '<img src="../image/chatBox/emotion/Expression_94.png" />',
    '[怄火]': '<img src="../image/chatBox/emotion/Expression_95.png" />',
    '[转圈]': '<img src="../image/chatBox/emotion/Expression_96.png" />',
    '[磕头]': '<img src="../image/chatBox/emotion/Expression_97.png"/>',
    '[回头]': '<img src="../image/chatBox/emotion/Expression_98.png"/>',
    '[跳绳]': '<img src="../image/chatBox/emotion/Expression_99.png"/>',
    '[投降]': '<img src="../image/chatBox/emotion/Expression_100.png" />',
    '[激动]': '<img src="../image/chatBox/emotion/Expression_101.png" />',
    '[街舞]': '<img src="../image/chatBox/emotion/Expression_102.png" />',
    '[献吻]': '<img src="../image/chatBox/emotion/Expression_103.png" />',
    '[左太极]': '<img src="../image/chatBox/emotion/Expression_104.png" />',
    '[右太极]': '<img src="../image/chatBox/emotion/Expression_105.png" />'
};

var reg = /\[.+?\]/g;
var addButtonAry = [
    {
        normal: "widget://image/chatBox/pic.png",
        title: "相册"
    }, {
        normal: "widget://image/chatBox/camera.png",
        title: "拍摄"
    }
];
//滑动到底部
function pageDown(time) {
    setTimeout(function () {
        api.pageDown({bottom: true, animate: true}, function (ret) {
        });
    }, time || 0)

}
function sendTextMessage(data, callback) {
    var extra = {
        targetTitle:localStorage.getItem('accountName'),
        portrait :localStorage.getItem('gender')
    };
    rong.sendTextMessage({
        conversationType: data.conversationType,
        targetId: data.targetId,
        text: data.text,
        extra:JSON.stringify(extra)
    }, function (ret, err) {
        try {
            if ("prepare" == ret.status) {
                callback(ret);
            } else if ('success' == ret.status) {
                $(".ui-loading").last().remove();
            } else if ('error' == ret.status) {
                api.alert({msg: errcode2msg(err.code)});
            }
        } catch (e) {
            alert(e)
        }
    });
}
function sendImageMessage(data, callback) {
    var extra = {
        targetTitle:localStorage.getItem('accountName'),
        portrait :localStorage.getItem('gender')
    };
    rong.sendImageMessage({
            conversationType: data.conversationType,
            targetId: data.targetId,
            imagePath: data.imagePath,
            extra: JSON.stringify(extra)
        }, function (ret, err) {
            if (ret.status == 'prepare') {
                callback(ret);
            } else if (ret.status == 'success') {
                $(".ui-loading").last().remove();
            } else if (ret.status == 'error') {
                api.toast({msg: errcode2msg(err.code)});
            }
        }
    );
}
function getImgText(){
    api.openWin({
        name:'win_richContent',
        url: 'win_richContent.html',
        animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
        }
    });
}
//地图消息
function getLocation(){
    api.openWin({
        name: "win_map",
        url: "win_map.html",
        animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
        }
    });
}
function getPicture(type) {
    api.getPicture({
        sourceType: type,
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'url',
        quality: 100,
        saveToPhotoAlbum: false
    }, function (ret, err) {
        if (ret) {
            var data = {
                targetId: targetId,
                imagePath: ret.data,
                conversationType: conversationType
            };
            sendImageMessage(data, function (ret) {
                var message = ret.result.message;
                var resultHtml = '';
                var imageUrl = message.content.imageUrl;
                var thumbPath = message.content.thumbPath;
                var portrait = localStorage.getItem('gender');
                resultHtml += '<li  class="item self"><div class="message "><div class="detail imageMsgWrap">' +
                '<div class="imageMsg"><i class="ui-loading"></i><img tapmode="" onclick="openImage(\'' + imageUrl + '\')" src="' + thumbPath + '"/></div></div></div><div class="arrow invisible"></div><div class="icon '+portrait+'" ></div></li>';
                $("#history").append(resultHtml);
                pageDown(300);
            });
        }
    });
}

function log(param) {
    var debug = true;
    if(debug){
        api.ajax({
            url: 'http://192.168.1.100:8080/upload/cs/log.action',
            method: 'post',
            dataType: 'json',
            returnAll: false,
            data: {
                values: {param: param}
            }
        }, function (ret, err) {

        });
    }
}


function transExtra(arg) {
    var result = '';
    try {
        result = eval('(' + arg + ')');
    } catch (e) {
        result = arg.slice(1, -1);
    } finally {

    }
    return result;
}