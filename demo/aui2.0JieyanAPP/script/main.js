var key = 'user';
var user_name, user_pwd, user_token, flag_status, token;
var data = {};
var user = {};
var routesData;
var flagstatus = 0;
user = $api.getStorage(key);
if (user != null) {
    user_name = user.user_name;
    user_pwd = user.user_pwd;
    user_token = user.user_token;
    flag_status = user.flag_status;
} else {
    user = {};
}

// 登录页面
// 登录提交
function submitEve(eve) {
    user_name = $api.val($api.byId('userName'));
    user_pwd = $api.val($api.byId('userPwd'));
    data.username = user_name;
    data.password = user_pwd;
    data = JSON.stringify(data);
    if (user_name && user_pwd) {
        api.ajax({
            url: 'http://jieyan.xyitech.com/login',
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            data: {
                values: {
                    username: user_name,
                    password: user_pwd
                }
            },
            returnAll: false
        }, function (ret, err) {
            if (ret.err == 0) {
                showDefault('登录成功');
                if (eve == 'dialogLogin') {
                    cancel('login-aui-dialog');
                } else {
                    setTimeout(function () {
                        closeWin();
                    }, 500);
                }
                // 保存登录信息
                user.user_name = user_name;
                user.user_pwd = user_pwd;
                user.user_token = ret.token;
                token = user.user_token;
                user.flag_status = 1;
                flag_status = user.flag_status;
                $api.setStorage(key, user);
                loginStatus();
            } else {
                api.alert({
                    title: '温馨提示',
                    msg: '登录失败，请重试'
                });
                // if(username != ret.username){//判断是用户名还是密码错误，提示相应信息
            }
        });
    } else if (!user_name) {
        api.alert({
            title: '温馨提示',
            msg: '用户名不能为空'
        });
    } else {
        api.alert({
            title: '温馨提示',
            msg: '密码不能为空'
        });
    }
}

function init(eve) {
    //读取 localStorage本地存储，填充用户名密码,如果自动登录有值直接跳转；
    //相反，跳转到本页面,等待登陆处理
    user = $api.getStorage(key);
    if (user != null) {
        user_name = user.user_name;
        user_pwd = user.user_pwd;
        user_token = user.user_token;
    } else {
        user = {};
    }
    // alert(JSON.stringify(user));
    if ((null != user_name || '' != user_name) && (null != user_pwd || '' != user_pwd) && (null != user_token || '' != user_token)) {
        if (eve == 'slide') {
            getRouteInfor();
        }
        if (eve == 'fixed') {
            if (flag_status && user.flag_status == 1) {
                $api.css($api.byId("userOpration"), "display:none");
                $api.css($api.byId("tipsName"), "display:block");
                $api.css($api.byId("tipsAddress"), "display:block");
                $api.text($api.byId('tipsName'), user.user_name);
            } else {
                $api.css($api.byId("userOpration"), "display:block");
                $api.css($api.byId("tipsName"), "display:none");
                $api.css($api.byId("tipsAddress"), "display:none");
            }
        }

        // $api.val($api.byId('userName'), user_name);
        // $api.val($api.byId('userPwd'), user_pwd);
        // $api.css($api.byId('submitBtn'), 'background:#fb8815');
        // api.ajax({
        // 	// http://jieyan.xyitech.com/login?username=ajyz&password=ajyz
        // 	url : 'http://jieyan.xyitech.com/login',
        // 	type : 'post',
        // 	data : {
        // 		username : user_name,
        // 		password : user_pwd
        // 	}
        // }, function(ret, err) {
        // 	if (ret.err == 0) {
        // 		alert(123);
        // 		api.alert({
        // 			msg : JSON.stringify(ret)
        // 		});
        // 	} else {
        // 		api.alert({
        // 			msg : JSON.stringify(err)
        // 		});
        // 		// if(username != ret.tel){//判断是用户名还是密码错误，提示相应信息
        // 		//    alert(data.message);
        // 		//    $tel.val("");
        // 		//    $pwd.val("");
        // 		//    return false;
        // 		//   }
        // 		//   if(pwd != data.pwd){
        // 		//    alert(data.message);
        // 		//    $pwd.val("");
        // 		//    return false;
        // 		//   }
        // 	}
        // });
    } else {
        api.alert({
            msg: '没有信息，请重新登录！'
        });
    }
}

function showDefault(value, point) {
    if (value == "toastAddress") {
        $api.css($api.byId("toastAddress"), "display:block");
        if (point == "startpoint") {
            $api.text($api.byId('toastAddressInfor'), '暂时无法选择其他寄件地点');
        } else if (point == "endpoint") {
            $api.text($api.byId('toastAddressInfor'), '暂时无法选择其他投放点');
        }
    } else {
        $api.css($api.byId("toastDefault"), "display:block");
        $api.text($api.byId('toastInfor'), value);
    }
    setTimeout(function () {
        $api.css($api.byId("toastDefault"), "display:none");
        $api.css($api.byId("toastAddress"), "display:none");
    }, 500)
}

function loginStatus() {
    // 页面间传值
    api.sendEvent({
        name: 'myEvent',
        extra: {
            user: user
        }
    });
}

// 获取航路信息
function getRouteInfor() {
    if (user) {
        var user_token = user.user_token;
        api.ajax({
            url: 'http://jieyan.xyitech.com/config/allroute',
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            data: {
                values: {
                    token: user_token
                }
            },
            returnAll: false
        }, function (ret, err) {
            // if (ret.err == 0) {
            if (ret) {
                routesData = ret;
                $api.text($api.byId('sPoint'), routesData.airports[0].name + '  [自动匹配]');
                $api.text($api.byId('ePoint'), routesData.airports[1].name + '  [智能推荐]');
                user.u_routesdata = routesData;
            } else {
                api.alert({
                    msg: '获取航路失败,请先登录'
                });
                // api.alert({
                // 	msg : JSON.stringify(err)
                // });
            }
        });
    }
}

// 是否登录
function iLogin(name) {
    if (user) {
        var user_token = user.user_token;
    }
    if (user && user.user_token && user.flag_status == 1 && routesData) {
        if (name == "travel") {
            openWinNew(name, routesData);
        } else {
            show('opt-aui-dialog');
        }
    } else {
        showDefault('您未登录');
        setTimeout(function () {
            show('login-aui-dialog');
        }, 1000)
    }
}

// 点透事件
// function clickThrough(){}
var downDiv = document.getElementById("optConfirmBtn");
function handle(e) {
    var tar = e.target,
        eve = e.type;
    if (eve == "touchsend") {
        e.preventDefault();
    }
    // var ele = document.createElement("p");
    // ele.innerHTML = "target:"+ tar.id + " event:" + eve ;
    // con.appendChild(ele);
    // if(tar.id === "div1"){
    // 	div1.style.display = "none";
    // }
}
// downDiv.addEventListener('click', handle);


function optConfirm(name) {
    cancel('opt-aui-dialog');
    openWinNew(name, routesData);
}
// 退出登录
function quitLogin() {
    if (user.flag_status == 1) {
        api.confirm({
            title: '温馨提示',
            msg: '您确定要退出吗？',
            buttons: ['确定', '取消']
        }, function (ret, err) {
            var btn_index = ret.buttonIndex;
            if (btn_index == 1) {
                user.flag_status = 0;
                user_token = '';
                $api.setStorage(key, user)
                loginStatus();
            } else {
                return;
            }
        });
    } else {
        api.alert({
            title: '温馨提示',
            msg: '您未登录！'
        })
    }
}
// 打开新窗口并传值
function openWinNew(name, v1) {
    var delay = 0;
    if (api.systemType != 'ios') {
        delay = 300;
    }
    if (v1 == 'reload') {
        api.openWin({
            name: '' + name + '',
            url: '' + name + '.html',
            pageParam: v1,
            bounces: false,
            delay: delay,
            reload: true,
            slidBackEnabled: true,
            vScrollBarEnabled: false
        });
    } else {
        api.openWin({
            name: '' + name + '',
            url: '' + name + '.html',
            pageParam: v1,
            bounces: false,
            delay: delay,
            reload: true,
            slidBackEnabled: true,
            vScrollBarEnabled: false
        });
    }
}

function sliding() {
    api.openSlidPane({
        type: 'left'
    });
}

// 无人机扫码页面
// 来，骚一骚
function setOrdertips(data) {
    // alert('rData is' + JSON.stringify(data));
    rData = data;
    $api.text($api.byId('sPoint'), rData.airports[0].name);
    $api.text($api.byId('transferTime'), rData.airports[1].name);

    $api.text($api.byId('transferDis'), rData.routes[0].distance / 1000);
    $api.text($api.byId('transferTime'), rData.routes[0].duration / 60);
}

// 打开二维码扫描
function FNSOpen(fns) {
    // api.confirm({
    // 	// 'title':'中转箱扫码',
    // 	'msg' : '是否打开二维码扫码',
    // 	'button' : ['取消', '打开']
    // }, function(e) {
    // 	if (e.buttonIndex!= 1) {
    // openFrame();
    FNScanner.openScanner({
        autorotation: true,
        save: {
            album: true,
            imgPath: '',
            imgName: ''
        },
        sound: '',
        fixedOn: 'page2',
        needBr: true
        //save参数一定要传
    }, function (ret, err) {
        if (ret.eventType == "success") {
            FNScanner.closeView();
            show('aui-dialog-flight');
            var content = ret.content;
            // $api.text($api.byId('transferNub'), content);
            $api.text($api.byId('transferNubFlight'), content);
            $api.css($api.byId('scanCodeCont'), "display:none");
            $api.css($api.byId('scanCodeContCfm'), "display:block");
        } else if (ret.eventType == "fail") {
            api.alert({
                title: '扫描结果',
                msg: '扫码失败，请重试',
                // msg : content+ret.eventType,
                buttons: ['确定']
            });
        }
    });
}

// 扫码弹框确定订单
function codeConfirm(dialog) {
    $api.remove($api.dom(".aui-mask"));
    // if (dialog == "aui-dialog-package") {
    //     $api.css($api.byId('transerBtn'), 'display:none');
    //     $api.css($api.byId('transerBtnFlight'), 'display:block');
    //     $api.text($api.dom('.title'), '飞机编号扫描');
    // } else
    if (dialog == "aui-dialog-flight") {
        api.confirm({
            title: '温馨提示',
            msg: '您确定要创建订单吗？',
            button: ['确定', '取消']
        }, function (ret, err) {
            var btn_index = ret.buttonIndex;
            if (btn_index == 1) {
                // show('order-create');
                return;
            } else {
                orderCreate("aui-dialog-flight");
            }
            $api.css($api.byId('scanCodeCont'), "display:block");
            $api.css($api.byId('scanCodeContCfm'), "display:none");
        });
    }

}
// 创建订单
var rData;
function orderCreate(dialog) {
    var rid, boxid, token, fid;
    var flag_realtime = 0;
    if (user) {
        token = user.user_token;
    }
    // api.alert({
    //     msg: 'orderCreate token is   ' + token + 'remark is ' + $api.text($api.byId('packageRemark')) + '   Fid is ' + rData.airports[0].id
    // });
    api.ajax({
        url: 'http://jieyan.xyitech.com/order/create',
        method: 'get',
        cache: false,
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                token: token,
                routeid: rData.routes[0].id,
                remark: $api.text($api.byId('packageRemark')),
                fid: rData.airports[0].id
            }
        },
        returnAll: false
    }, function (ret, err) {
        if (ret) {
            // api.alert({
            // 	msg : '成功'
            // });
            api.alert({
                title: '温馨提示',
                msg: '订单创建成功'
            });
            $api.addCls($api.dom("." + dialog), "aui-hidden");
            api.sendEvent({
                name: 'dialogEvent',
                extra: {
                    type: 'hidden'
                }
            });
            flag_realtime = 1;
            // alert("curID is " + ret.id);
            rData.orderid = ret.id;
            user.uflagrealtime = flag_realtime;
            openWinNew('flighting', rData);
        } else {
            // api.alert({
            //     msg: JSON.stringify(err)
            // });
            api.alert({
                title: '温馨提示',
                msg: '订单创建失败'
            });
        }
    });
}


// var fnsX=api.frameWidht / 2-100;
// var fnsY=api.frameHeight / 2-100;
function openFrame() {
    api.alert({
        msg: fnsX + fnsY
    })
    api.openFrame({
        name: 'page2',
        url: 'login.html',
        rect: {
            x: 0,             //左上角x坐标
            y: 0,             //左上角y坐标
            w: 'auto',           //宽度，若传'auto'，页面从x位置开始自动充满父页面宽度
            h: 'auto',            //高度，若传'auto'，页面从y位置开始自动充满父页面高度
            marginLeft: 0,    //相对父 window 左外边距的距离

            marginTop: 0,    //相对父 window 上外边距的距离

            marginBottom: 0,    //相对父 window 下外边距的距离

            marginRight: 0    //相对父 window 右外边距的距离
        },
        pageParam: {
            name: 'test'
        },
        bounces: true,
        bgColor: 'rgba(0,0,0,0)',
        vScrollBarEnabled: true,
        hScrollBarEnabled: true
    });
    FNSOpen2();
}
function FNSOpen2(fns) {
    // api.confirm({
    // 	// 'title':'中转箱扫码',
    // 	'msg' : '是否打开二维码扫码',
    // 	'button' : ['取消', '打开']
    // }, function(e) {
    // 	if (e.buttonIndex!= 1) {
    // openFrame();
    FNScanner.openView({
        autorotation: true,
        save: {
            album: true,
            imgPath: '',
            imgName: ''
        },
        sound: '',
        fixedOn: 'page2',
        rect: {
            x: fnsX,   //（可选项）数字类型；模块左上角的 x 坐标（相对于所属的 Window 或 Frame）；默认：0
            y: fnsY,   //（可选项）数字类型；模块左上角的 y 坐标（相对于所属的 Window 或 Frame）；默认：0
            w: 200, //（可选项）数字类型；模块的宽度；默认：所属的 Window 或 Frame 的宽度
            h: 200  //（可选项）数字类型；模块的高度；默认：所属的 Window 或 Frame 的高度
        },
        needBr: true
        //save参数一定要传
    }, function (ret, err) {
        if (ret.eventType == "success") {
            FNScanner.closeView();
            if (fns == "package") {
                show('aui-dialog-package');
                var content = ret.content;
                // api.alert({
                // 	title : '扫描结果',
                // 	msg : content,
                // 	// msg : content+ret.eventType,
                // 	buttons : ['确定']
                // });
                // scanneRresult = document.getElementById("scanneRresult");
                $api.text($api.byId('scanneRresult'), content);
                $api.text($api.byId('transferNub'), content);
                // orderCreate();
            } else if (fns == "flight") {
                show('aui-dialog-flight');
                var content = ret.content;
                $api.text($api.byId('scanneRresultFlight'), content);
                $api.text($api.byId('transferNubFlight'), content);
                // $api.css($api.byId('transferNubFlight'), "display:inline-block");
                // $api.css($api.byId('transferNub'), 'display:none;');
            }
        } else if (ret.eventType == "fail") {
            api.alert({
                title: '扫描结果',
                msg: '扫码失败，请重试',
                // msg : content+ret.eventType,
                buttons: ['确定']
            });
        }
    });
    // }
    // })
}
// 飞机起飞页初始化
var winName;
function setFlightData(data) {
    var curData = data;
    var id;


    // alert('before curData is ' + JSON.stringify(curData));
    // alert('user is ' + JSON.stringify(user));
    if (user) {
        token = user.user_token;
        if (curData.orderid) {
            user.u_detaildata = {};

            $api.text($api.byId('sPoint'), curData.airports[0].name);
            $api.text($api.byId('transferTime'), curData.airports[1].name);
            $api.attr($api.byId('pickerUpMan'), "href", "tel:" + curData.airports[1].phone);

            id = curData.orderid;
            $api.text($api.byId('transferNub'), id);

            winName = "slide";
            // alert('curData is ' + JSON.stringify(curData) + "  id is" + id  +"扫码传值");
        } else {
            if (user.u_detaildata) {
                curData = user.u_detaildata;
                id = curData.order.id;
                $api.text($api.byId('transferNub'), id);
                $api.text($api.byId('transferNubFlight'), curData.order.fid);

                curData = JSON.parse(curData.order.route);
                $api.text($api.byId('sPoint'), curData.airport[0].name);
                $api.text($api.byId('transferTime'), curData.airport[1].name);
                $api.attr($api.byId('pickerUpMan'), "href", "tel:" + curData.airport[1].phone);

                winName = "travel";
                // alert('curData is ' + JSON.stringify(curData) + "  id is" + id  +"飞机重新起飞传值");
            }
        }
        $api.addEvt($api.byId("flightingBackBtn"), 'click', function () {
            api.closeToWin({
                name: winName
            });
        });
        // alert('user is ' + JSON.stringify(user));
        // alert("  id is" + id );
        api.ajax({
            url: 'http://jieyan.xyitech.com/order/detail',
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            data: {
                values: {
                    token: token,
                    id: id
                }
            },
            returnAll: false
        }, function (ret, err) {
            if (ret) {
                // api.alert({
                //     msg: '起飞页初始化成功'
                // });
                // $api.text($api.byId('transferDis'), curData.routes[0].distance / 1000);
                // $api.text($api.byId('transferTime'), curData.routes[0].duration / 60);
                // oPage = ret.page_size;
                // boxid = ret.boxid;
                // loadInitdata(oPage);
            } else {
                api.alert({
                    msg: '起飞页初始化失败'
                });
                // api.alert({
                //     msg: JSON.stringify(err)
                // });
            }
        });
    } else {
        api.alert({
            title: "温馨提示",
            msg: "错误,请稍后重试"
        })
    }
}
// 起飞
function getFlight() {
    // alert("flightData is " +JSON.stringify(flightData));
    // openWinNew('realtimedetail', flightData);
    if (user) {
        token = user.user_token;
    }
    $api.text($api.byId("flightInfo"), "正在与无人机通讯...");
    api.ajax({
        // http://jieyan.xyitech.com/order/update?token=xxx&id=xxx&state=x
        url: 'http://jieyan.xyitech.com/order/update',
        method: 'get',
        cache: false,
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                token: token,
                id: $api.text($api.byId("transferNub")),
                state: 2
            }
        },
        returnAll: false
    }, function (ret, err) {
        // if (ret.err == 0) {
        if (ret) {
            // api.alert({
            //     msg: '成功'
            // });
            api.alert({
                msg: JSON.stringify(ret)
            });
            $api.text($api.byId("flightInfo"), "指令已确认,即将起飞");
            var orderId = $api.text($api.byId("transferNub"));
            // openWin(orderId);
            openDetailWin(orderId);
        } else {
            api.alert({
                title: "温馨提示",
                msg: '抱歉,起飞出现异常,请联系客服'
            });
            $api.text($api.byId("flightInfo"), "抱歉,起飞出现异常,请联系客服");
            api.alert({
                msg: JSON.stringify(err)
            });
        }
    });
}
// 长按倒计时
var time = 3;
var interval;
function waitEnabled() {
    if (time == 0) {
        window.clearInterval(interval);
        time = 3;
        $api.text($api.byId('longPress'), '起飞中');
    } else {
        $api.text($api.byId('longPress'), --time + '');
    }
}

// 订单列表页

// function openWinTransfer(name, v1) {
//     // alert('routesData is  '+ v1);
//     var delay = 0;
//     if (api.systemType != 'ios') {
//         delay = 300;
//     }
//     api.openWin({
//         name: '' + name + '',
//         url: '' + name + '.html',
//         pageParam: v1,
//         bounces: false,
//         delay: delay,
//         slidBackEnabled: true,
//         vScrollBarEnabled: false
//     });
// }

// 初始化
// var swipe = new ListSwipe();
// function showMsg(el) {
//     if (!el.classList.contains("aui-swipe-selected")) {
//         api.alert({
//             title: '提示消息',
//             msg: '正常点击操作'
//         });
//     }
// }
// 下拉刷新
// var loadingCallback = function(status) {
// 	if (status == 'success') {
// 		setTimeout(function() {
// 			var wrap = document.getElementById("list")
// 			// var lis = wrap.querySelectorAll('li');
// 			// for (var i = lis.length, length = i + 10; i < length; i++) {
// 			for (var i = 0; i < 5; i++) {
// 				// var html = '<li class="aui-list-view-cell">新加载'+(i+1)+'</li>';
// 				var html = '<li class="aui-list-view-cell aui-img" id="' + i + '"><div class="aui-swipe-handle aui-arrow-right" tapmode onclick="openDetailWin(this)"><div class="aui-img-body order-item"><h2 class="item-title"><span>运单编号：</span><span id=\"' + i + '">S840320160627</span><span class="comment"><strong class="ban go">去</strong>起飞</span></h2><span class="path-start"><i class="aui-iconfont aui-icon-locationfill cr1"></i>杭垓镇邮政局</span><span class="path-end"><i class="aui-iconfont aui-icon-locationfill cr2"></i>七管村村委会</span><div class="deltips"><span></span></div></div></div><div class="aui-swipe-right-btn aui-bg-danger" tapmode onclick="deleteItem(this)"><i class="aui-iconfont aui-icon-delete"></i></div></li>';
// 				wrap.insertAdjacentHTML('afterbegin', html);
// 			}
// 			pullRefresh.cancelLoading();
// 			//刷新成功后调用此方法隐藏
// 		}, 1500)
// 	}
// };
// var pullRefresh = new auiPullToRefresh({
// 	container : document.querySelector('.aui-load-container'),
// 	"pullImage" : "../image/pull_refresh.png", //下拉时显示的图片，带旋转
// 	"loadingImage" : "../image/pull_refresh_2.png", //加载中的图片
// 	"triggerDistance" : '200', //下拉高度
// 	"callback" : loadingCallback //刷新回调
// });


// 加载更多数据
function loadMdata() {
    var wrap = document.getElementById("list");
    // var lis = wrap.querySelectorAll('li');
    // for (var i = lis.length, length = i + 10; i < length; i++) {
    for (var i = 0; i < 5; i++) {
        var html = '<li class="aui-list-view-cell aui-img" id="' + i + '"><div class="aui-swipe-handle aui-arrow-right" tapmode onclick="openDetailWin(this)"><div class="aui-img-body order-item"><h2 class="item-title"><span>运单编号：</span><span id=\"">S840320160627</span><span class="comment"><strong class="ban go">去</strong>起飞</span></h2><span class="path-start"><i class="aui-iconfont aui-icon-locationfill cr1"></i>杭垓镇邮政局</span><span class="path-end"><i class="aui-iconfont aui-icon-locationfill cr2"></i>七管村村委会</span><div class="deltips"><span></span></div></div></div><div class="aui-swipe-right-btn aui-bg-danger" tapmode onclick="deleteItem(this)"><i class="aui-iconfont aui-icon-delete"></i></div></li>';
        wrap.insertAdjacentHTML('afterbegin', html);
    }
}


// 订单列表页页面初始化
var oPage;
var orderData;
function orderListInit() {
    if (user) {
        token = user.user_token;
        api.ajax({
            url: 'http://jieyan.xyitech.com/order/list',
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            data: {
                values: {
                    token: token,
                    page_no: '0',
                    page_size: '20'
                }
            },
            returnAll: false
        }, function (ret, err) {
            if (ret) {
                // api.alert({
                // 	msg : '成功'
                // });
                // api.alert({
                // 	msg : JSON.stringify(ret)
                // });
                orderData = ret.orders;
                if (orderData.length == 0) {
                    $api.css($api.byId('orderList'), 'display:none');
                    $api.css($api.byId('orderNone'), 'display:block');
                    $api.text($api.byId('orderNone'), '您还没有运单记录!');

                } else {
                    // api.alert({
                    // 	msg : orderData.length
                    // });
                    $api.css($api.byId('orderNone'), 'display:none');
                    $api.css($api.byId('orderList'), 'display:block');
                    loadInitdata(orderData);
                    // api.alert({
                    // 	msg : '初始化加载数据'
                    // })
                }
            } else {
                api.alert({
                    msg: '数据加载失败'
                });
                // api.alert({
                // 	msg : JSON.stringify(err)
                // });
            }
        });
    }
}
//加载订单列表页数据
function loadInitdata(data) {
    var orderHtml = $api.byId('orderList');
    var length = data.length;
    for (var i = 0; i < length; i++) {
        //var html = '<li class="aui-list-view-cell aui-img" id="' + data[i].id + '"  tapmode onclick="openDetailWin(this)"><div class="aui-swipe-handle aui-arrow-right"><div class="aui-img-body order-item"><h2 class="item-title"><span>运单编号：</span><span id=\"' + data[i].boxid + '">S840320160627</span><img class="commentimg" src="../image/gobg.png" alt=""><span class="comment">起飞</span></h2><span class="path-start"><i class="aui-iconfont aui-icon-locationfill cr1"></i><span id="sPoint">' + (JSON.parse(data[i].route)).airport[0].name + '</span></span><span class="path-end"><i class="aui-iconfont aui-icon-locationfill cr2"></i><span id="ePoint">' + (JSON.parse(data[i].route)).airport[1].name + '</span></span><div class="deltips"><span></span></div></div></div></li>';
        var html = '<li class="aui-list-view-cell aui-img" id="' + data[i].id + '"  tapmode onclick="openDetailWin(this)"><div class="aui-swipe-handle aui-arrow-right"><div class="aui-img-body order-item"><h2 class="item-title"><span>运单编号：</span><span>' + data[i].id + '</span><span class="comment" id="comment' + data[i].id + '"></span></h2><span class="path-start"><i class="aui-iconfont aui-icon-locationfill cr1"></i><span id="sPoint">' + (JSON.parse(data[i].route)).airport[0].name + '</span></span><span class="path-end"><i class="aui-iconfont aui-icon-locationfill cr2"></i><span id="ePoint">' + (JSON.parse(data[i].route)).airport[1].name + '</span></span><div class="deltips"><span></span></div></div></div></li>';
        $api.append(orderHtml, html);
        if (data[i].state == 0) {
            $api.text($api.byId("comment" + data[i].id), "未起飞");
            $api.addCls($api.byId("comment" + data[i].id), "order-status1");
        } else if (data[i].state == 1) {
            $api.text($api.byId("comment" + data[i].id), "已取消");
            $api.removeCls($api.byId("comment" + data[i].id), "order-status1");

        } else if (data[i].state == 2) {
            $api.text($api.byId("comment" + data[i].id), "已起飞");
        } else if (data[i].state == 3 || data[i].state == 6) {
            $api.text($api.byId("comment" + data[i].id), "异常");
        } else if (data[i].state == 4) {
            $api.text($api.byId("comment" + data[i].id), "已送达");
            $api.removeCls($api.byId("comment" + data[i].id), "order-status1");

        } else if (data[i].state == 5) {
            $api.text($api.byId("comment" + data[i].id), "返航中");
            $api.removeCls($api.byId("comment" + data[i].id), "order-status1");

        } else if (data[i].state == 7) {
            $api.text($api.byId("comment" + data[i].id), "已完成");
            $api.removeCls($api.byId("comment" + data[i].id), "order-status1");

        }
    }
}
// 订单列表页下拉刷新
function orderListRefresh(status) {
    if (status == 'success') {
        setTimeout(function () {
            orderListInit();
            pullRefresh.cancelLoading();
            //刷新成功后调用此方法隐藏
        }, 2000)
    }
}
// 打开订单详情或实时订单页
var realtimedata;
function openDetailWin(name) {
    // alert(name.parentNode);
    // var parentObj = name.parentNode;
    var detailId = name.id;
    if (!detailId) {
        detailId = name;
    }
    api.ajax({
        url: 'http://jieyan.xyitech.com/order/detail',
        method: 'get',
        cache: false,
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                token: token,
                id: detailId
            }
        },
        returnAll: false
    }, function (ret, err) {
        if (ret) {
            // api.alert({
            // 	msg : '成功'
            // });
            realtimedata = ret;
            // alert("state is " +realtimedata.order.state);
            // openWinNew('realtimedetail', realtimedata);
            // openWinNew('details', realtimedata);

            if (realtimedata.order.state == 2 || realtimedata.order.state == 4 || realtimedata.order.state == 5) {
                openWinNew('realtimedetail', realtimedata);
            } else {
                openWinNew('details', realtimedata);
            }
        } else {
            api.alert({
                msg: '失败'
            });
            // api.alert({
            // 	msg : JSON.stringify(err)
            // });
        }
    });
}


function orderRefresh(eve, str) {
    if (user) {
        token = user.user_token;
        var curData = eve;
        var id = curData.order.id;
        var state = curData.order.state;
        if (str == "取消") {
            state = 1;
        }
        // alert("curData is " + JSON.stringify(curData));
        // alert("token is " + token + " state is " + state + " id is " + id);

        api.ajax({
            url: 'http://jieyan.xyitech.com/order/update',
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            data: {
                values: {
                    token: token,
                    id: id,
                    state: state
                }
            },
            returnAll: false
        }, function (ret, err) {
            if (ret) {
                // api.alert({
                // 	msg : '成功'
                // });
                // api.alert({
                //     msg: JSON.stringify(ret)
                // });
                if (state == 1) {
                    openWinNew("travel");
                }
                // oPage = ret.page_size;
                // boxid = ret.boxid;
                // loadInitdata(oPage);
            } else {
                api.alert({
                    msg: '失败'
                });
                // api.alert({
                //     msg: JSON.stringify(err)
                // });
            }
        });
    }
}

// 删除订单
function deleteItem(del) {
    var parentObj = del.parentNode;
    parentObj.style.padding = '0';
    del.parentNode.remove(parentObj);
}

// 订单详情页
var detailData;
function initDetailData(data) {
    var curData = data;
    // 设置订单状态时间
    setOrderStatusDate(curData);
    var state = curData.order.state;
    // alert('curdetailData is ' + JSON.stringify(curData));

    $api.text($api.byId('transferNubFlight'), curData.order.fid);
    $api.text($api.byId('transferNub'), curData.order.id);
    $api.text($api.byId('ePoint'), (JSON.parse(curData.order.route)).airport[1].name);
    $api.text($api.byId('sPoint'), (JSON.parse(curData.order.route)).airport[0].name);
    $api.text($api.byId('ePoint'), (JSON.parse(curData.order.route)).airport[1].name);
    $api.text($api.byId('transferDis'), (JSON.parse(curData.order.route)).route.distance / 1000);
    $api.text($api.byId('transferTime'), (JSON.parse(curData.order.route)).route.duration / 60);
    $api.text($api.byId('signerPhone'), (JSON.parse(curData.order.route)).airport[1].phone);

    $api.attr($api.byId('dialPhone'), "href", "tel:" + (JSON.parse(curData.order.route)).airport[1].phone);
    if (state == "0") {
        $api.css($api.byId('t2'), 'display:none');
        $api.css($api.byId('t4'), 'display:none');
        $api.css($api.byId('noFlighting'), 'display:block');

        $api.text($api.byId('orderStatus'), "待起飞");
    } else if (state == "1") {
        $api.css($api.byId('t1'), 'display:block');
        $api.css($api.byId('t2'), 'display:none');
        $api.css($api.byId('t4'), 'display:none');
    } else if (state == "2") {
        $api.css($api.byId('t2'), 'display:block');

        $api.text($api.byId('orderStatus'), "已起飞");
    } else if (state == "3" || state == "6") {
        $api.css($api.byId('anomalOrder'), 'display:block');
    } else if (state == "4") {
        $api.text($api.byId('orderStatus'), "已到达");
    } else if (state == "5") {
        $api.text($api.byId('orderStatus'), "返航中");
    } else if (state == "7") {
        $api.text($api.byId('orderStatus'), "已完成");
    } else {
        return;
    }
}
function setOrderStatusDate(data) {
    var curData = data;
    var curDate;
    var tId;
    // alert("curData is " + JSON.stringify(curData));
    for (var i = 0; i <= 8; i++) {
        curDate = curData['order']['t' + i];
        tId = 't' + i;
        if (curDate != 0) {
            setOrderStatusDateTime(curDate, tId);
        }
    }
    // if(curData.order.t0!=0){
    //     curDate=curData.order.t0;
    //     tId="t0";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t1!=0){
    //     curDate=curData.order.t1;
    //     tId="t1";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t2!=0){
    //     curDate=curData.order.t2;
    //     tId="t2";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t3!=0){
    //     curDate=curData.order.t3;
    //     tId="t3";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t4!=0){
    //     curDate=curData.order.t4;
    //     tId="t4";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t5!=0){
    //     curDate=curData.order.t5;
    //     tId="t5";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t6!=0){
    //     curDate=curData.order.t6;
    //     tId="t6";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t7!=0){
    //     curDate=curData.order.t7;
    //     tId="t7";
    //     setOrderStatusDateTime(curDate,tId);
    // }
    // if(curData.order.t8!=0){
    //     curDate=curData.order.t8;
    //     tId="t8";
    //     setOrderStatusDateTime(curDate,tId);
    // }
}
function setOrderStatusDateTime(value1, value2) {
    // 时间转换
    var unixtime = value1 * 1;
    var curtId = value2;
    var unixTimestamp = new Date(unixtime * 1000 + 28800000);//东8区时间偏移量为28800000毫秒
    // var commonTime = unixTimestamp.toLocaleString();
    var commonTime = unixTimestamp;
    var nYear = commonTime.getUTCFullYear();
    var nMonth = (commonTime.getUTCMonth() + 1);
    nMonth = nMonth < 10 ? ('0' + nMonth) : nMonth;
    var nDay = commonTime.getUTCDate();
    nDay = nDay < 10 ? ('0' + nDay) : nDay;

    var tDate = nYear + "." + nMonth + "." + nDay;

    var nHour = (commonTime.getUTCHours());
    nHour = nHour < 10 ? ('0' + nHour) : nHour;
    var nMinutes = commonTime.getUTCMinutes();
    nMinutes = nMinutes < 10 ? ('0' + nMinutes) : nMinutes;
    var nSeconds = commonTime.getUTCSeconds();
    nSeconds = nSeconds < 10 ? ('0' + nSeconds) : nSeconds;

    var tTime = nHour + ":" + nMinutes;

    if (curtId == "t0") {
        $api.text($api.byId("noFlighting_date"), tDate);
        $api.text($api.byId("noFlighting_time"), tTime);
    }
    $api.text($api.byId(curtId + "_date"), tDate);
    $api.text($api.byId(curtId + "_time"), tTime);

    var newStatusDate = nYear + "/" + nMonth + "/" + nDay + "/" + nHour + ":" + nMinutes + ":" + nSeconds;
    // alert("普通时间为：" + commonTime + newStatusDate);
}


// 订单重新起飞
function orderReflight() {
    // alert("detailData is " + JSON.stringify(detailData));
    user.u_detaildata = detailData;
    $api.setStorage(key, user);
    openWinNew('flighting', '');
    // closeWin();
}

//订单取消
function orderCancel() {
    api.confirm({
        'title': '温馨提示',
        'msg': '您确定要取消订单吗?',
        'button': ['取消', '确定']
    }, function (e) {
        if (e.buttonIndex != 1) {
            orderRefresh(detailData, "取消");
        }
    })
}
//显示运单所处状态
//    function orderStateShow(state){
//        var curState=state;
//        $api.css($api.byId('t'+curState), 'display:block');
//    }


// 实时订单页
// 实时订单页下拉刷新
function loadingCallback(status) {
    if (status == 'success') {
        // alert("下拉刷新触发了");
        if (user) {
            token = user.user_token;
        }
        // alert("realData is " + realData)
        // alert("token is " + token + " id is " + realData.order.id + " state is " + realData.order.state );
        setTimeout(function () {
            api.ajax({
                url: 'jieyan.xyitech.com/order/update',
                method: 'get',
                cache: false,
                timeout: 30,
                dataType: 'json',
                data: {
                    values: {
                        token: token,
                        id: realData.order.id,
                        state: realData.order.state
                    }
                },
                returnAll: false
            }, function (ret, err) {
                if (ret) {
                    api.alert({
                        msg: '刷新成功'
                    });
                    // api.alert({
                    //     msg: JSON.stringify(ret)
                    // });
                    // initRealDetail(ret);
                } else {
                    api.alert({
                        msg: '数据加载失败'
                    });
                }
            });
            pullRefresh.cancelLoading();
            //刷新成功后调用此方法隐藏
        }, 2000)
    }
}
// function initRealDetail(data) {
//     alert('realData is' + JSON.stringify(data));
//     var curData = data.order;
//     // $api.text($api.byId('transferNub'), curData.routes.aid);
//     $api.text($api.byId('sPoint'), (JSON.parse(curData.route)).airport[0].name);
//     $api.text($api.byId('ePoint'), (JSON.parse(curData.route)).airport[1].name);
//     $api.attr($api.byId('signerPhone'), "href","tel:"+(JSON.parse(curData.route)).airport[1].phone);
//     $api.text($api.byId('transferTime'), ((JSON.parse(curData.route)).route.duration)*1 / 60);
//     $api.text($api.byId('transferDis'), ((JSON.parse(curData.route)).route.distance)*1 / 1000);
//
//     // $api.text($api.byId('orderStatus'), ((JSON.parse(curData.route)).route.distance) / 1000);
//     // $api.text($api.byId('signerPhone'), curData.route.airport.phone);
//     // $api.text($api.byId('dialPhone'), curData.route.airport.phone);
//
//     if (curData.t0) {
//         $api.text($api.byId('orderStatus'), '起飞');
//     }
//     if (curData.t1) {
//         $api.text($api.byId('orderStatus'), '运送中');
//         $api.css($api.byId('imgArea'), 'background-image:url(../image/progress02.png)');
//     }
//     if (curData.t2) {
//         $api.text($api.byId('orderStatus'), '故障');
//     }
//     if (curData.t3) {
//         $api.text($api.byId('orderStatus'), '到达');
//         $api.css($api.byId('imgArea'), 'background-image:url(../image/progress03.png)');
//         $api.addCls($api.byId('orderPackageBtn'), 'pk-btn1');
//     }
//     if (curData.t4) {
//         $api.text($api.byId('orderStatus'), '到达');
//         $api.css($api.byId('imgArea'), 'background-image:url(../image/progress03.png)');
//         $api.text($api.byId('orderPackageBtn'), '完成收货');
//         $api.addCls($api.byId('orderPackageBtn'), 'pk-btn2');
//     }
//     if (curData.t5) {
//         $api.text($api.byId('orderStatus'), '到达');
//         $api.css($api.byId('imgArea'), 'background-image:url(../image/progress03.png)');
//         $api.addCls($api.byId('orderFlightBtn'), 'flight-btn1');
//         $api.text($api.byId('orderFlightBtn'), '完成返航');
//         $api.addCls($api.byId('orderFlightBtn'), 'flight-btn2');
//     }
// }

// 送达时间倒计时
var timeDown, minTime, totalDistance, rate;
function countDown() {
    if (timeDown == 0) {
        window.clearInterval(interval);
        // time = 900;
        // $api.text($api.byId('transferTime'), '15');
        $api.text($api.byId('orderStatus'), '已送达');
        $api.css($api.byId('imgArea'), 'background-image:url(../image/progress03.png)');
        $api.addCls($api.byId('orderPackageBtn'), 'pk-btn1');

        $api.text($api.byId('orderStatus'), '返航中');
        $api.text($api.byId('transferDis'), (JSON.parse(curData.order.route)).route.distance / 1000);
        $api.text($api.byId('transferTime'), (JSON.parse(curData.order.route)).route.duration / 60);
        realData()
    } else {
        timeDown--;
        if (timeDown % 60 == 0) {
            $api.text($api.byId('transferTime'), --minTime);
            $api.text($api.byId('transferDis'), ($api.text($api.byId('transferTime')) * rate).toFixed(0));
        }
    }
}
function realData() {
    timeDown = $api.text($api.byId('transferTime')) * 60;
    minTime = $api.text($api.byId('transferTime')) * 1;
    totalDistance = $api.text($api.byId('transferDis')) * 1;
    rate = totalDistance / minTime;
    var interval;
    // alert($api.text($api.byId('transferTime')));
    interval = setInterval('countDown()', 1000);
}
// realData();

// 确认收货或返航
function confirmPackage() {
    var state = curData.order.state;
    if (user) {
        token = user.user_token;
    }
    if ($api.text($api.byId('orderStatus')) == "已送达") {
        state = 4;
    }
    if ($api.text($api.byId('orderStatus')) == "已返航") {
        state = 7;
        $api.css($api.byId('imgArea'), 'background-image:url(../image/progress03.png)');
        // $api.addCls($api.byId('orderFlightBtn'), 'flight-btn1');
        $api.text($api.byId('orderFlightBtn'), '完成返航');
        $api.addCls($api.byId('orderFlightBtn'), 'flight-btn2');
    }
    if (state <= 3 || state == 5 || state == 6) {
        return;
    } else {
        api.ajax({
            url: 'http://jieyan.xyitech.com/order/update',
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            data: {
                values: {
                    token: token,
                    id: curData.order.id,
                    state: state
                }
            },
            returnAll: false
        }, function (ret, err) {
            if (ret) {
                // api.alert({
                // 	msg : '成功'
                // });
                api.alert({
                    msg: JSON.stringify(ret)
                });
            } else {
                api.alert({
                    msg: '失败'
                });
                api.alert({
                    msg: JSON.stringify(err)
                });
            }
        });
    }
}
// 模态框
// 打开模态框
function show(dialog) {
    // alert(dialog)
    $api.append($api.dom("body"), '<div class="aui-mask"></div>');
    if (dialog) {
        $api.removeCls($api.dom("." + dialog + ".aui-hidden"), "aui-hidden");
    } else {
        $api.removeCls($api.dom(".aui-dialog.aui-hidden"), "aui-hidden");
    }
    api.sendEvent({
        name: 'dialogEvent',
        extra: {
            type: 'show'
        }
    });
}
// 关闭模态框
function cancel(dialog) {
    $api.remove($api.dom(".aui-mask"));
    if (dialog) {
        $api.addCls($api.dom("." + dialog), "aui-hidden");
    } else {
        $api.addCls($api.dom(".aui-dialog"), "aui-hidden");
    }
    api.sendEvent({
        name: 'dialogEvent',
        extra: {
            type: 'hidden'
        }
    });
}
// 确认并关闭模态框
function confirm(dialog) {
    $api.remove($api.dom(".aui-mask"));
    if (dialog) {
        $api.addCls($api.dom("." + dialog), "aui-hidden");
    } else {
        $api.addCls($api.dom(".aui-dialog"), "aui-hidden");
    }
    // $api.addCls($api.dom(".aui-dialog"), "aui-hidden");
    api.sendEvent({
        name: 'dialogEvent',
        extra: {
            type: 'hidden'
        }
    });
}


// 打开新窗口
function openWin(name) {
    var delay = 0;
    if (api.systemType != 'ios') {
        delay = 300;
    }
    api.openWin({
        name: '' + name + '',
        url: '' + name + '.html',
        bounces: false,
        delay: delay,
        slidBackEnabled: true,
        vScrollBarEnabled: false
    });
}
//关闭窗口
function closeWin() {
    api.closeWin();
    api.setStatusBarStyle({
        style: 'light',
        color: '#fff'
    });
}
function closeToWin(name) {
    api.closeToWin({
        name: name
    });
    // api.setStatusBarStyle({
    //     style: 'light',
    //     color: '#fff'
    // });
}