var Ajax = axios.create({
    baseURL: 'http://139.224.68.145:8080/',      
    timeout: 6000,
    withCredentials: true,
    crossDomain: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
var ajaxURLList = {
    login:"fkapi/login",                            //登陆
    auto_login:"fkapi/auto_login",                  //快速登陆
    add_visitor:"fkapi/add_visitor",                //新增访客
    get_visitor_list:"fkapi/get_visitor_list",      //获取访客列表
    get_visitor_info:"fkapi/get_visitor_info",      //获取访客详细信息
    upload_image:"fkapi/upload_image",              //上传图片
    send_notice:"fkapi/send_notice",              //上传图片到访客
}

//定义一个基于Promise的异步任务执行器
function run(taskDef) {
    //创建迭代器
    var task = taskDef();

    //开始执行任务
    var result = task.next();

    //递归函数遍历
    (function step() {
        //如果有更多任务要做
        if (!result.done) {
            //用一个Promise来解决会简化问题
            var promise = Promise.resolve(result.value);
            promise.then(function (value) {
                result = task.next(value);
                step();
            }).catch(function (error) {
                result = task.throw(error);
                step();
            });
        }
    }())
}

/**
 * 执行异步任务执行器的函数
 * 
 * @param {String} ajaxName 具体执行ajax的请求名称
 * @param {Object} param ajax请求的参数对象，必须是对象，属性名和ajax参数的属性名相同
 * @param {Function} handle ajax执行完成后的处理函数
 * @param {Boolean} mustLogin 是否必须登录后才能发送请求，判断登录是查询本地存储的token
 * @param {String} method ajax请求类型，默认是post
 * @param {String} handleParam ajax执行完成后的处理函数的参数
 */
window.runPromise = function (ajaxName, param, handle, mustLogin, method, handleParam) {
    var mustLogin = mustLogin || false;
    var method = method || "post";
    var serializeParam = { "username": getCookie("username") };
    
    if (method == "post") {
        Object.assign(serializeParam, param);
    } else {
        serializeParam = param;
    }
    var contents = sendAjax(ajaxURLList[ajaxName], serializeParam, method, handle, handleParam);
    
    // handle(contents.data, handleParam);
    
}
function params(data) {
    var url = ''
    for (var k in data) {
        var value = data[k] !== undefined ? data[k] : ''
        url += '&' + k + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}
//发送ajax请求通用
function sendAjax(url, param, method, handle, handleParam) {
    return new Promise(function (resolve, reject) {
        if (method.toLowerCase() == "get") {
            var URL = url;
            if (param instanceof Object) {
                for (var key in param) {
                    if (param.hasOwnProperty(key)) {
                        var element = param[key];
                        URL += "/" + param[key];
                    }
                }
            }
            Ajax.get(URL).then(function(req){
                // resolve(req);
                handle(req.data, handleParam);
            }).catch(function(error){
                //全局处理网络请求错误
                reject(error);
            });
        } else {
            Ajax.post(url, params(param)).then(function(req) {
                // resolve(req);
                handle(req.data, handleParam);
            }).catch(function(error) {
                //全局处理网络请求错误
                alert("网络错误，请保持网络通畅！");
                reject(error);
            });
        }
    });
}
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return decodeURIComponent(arr[2]);
    } else {
        return null;
    }
};
