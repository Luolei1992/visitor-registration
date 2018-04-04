let Ajax = axios.create({
    baseURL: 'http://139.224.68.145:8080/',      
    timeout: 6000,
    withCredentials: true,
    crossDomain: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
const ajaxURLList = {
    login:"fkapi/login",                            //登陆
    auto_login:"fkapi/auto_login",                  //快速登陆
    add_visitor:"fkapi/add_visitor",                //新增访客
    get_visitor_list:"fkapi/get_visitor_list",      //获取访客列表
    get_visitor_info:"fkapi/get_visitor_info",      //获取访客详细信息
    upload_image:"fkapi/upload_image",              //上传图片
}

//定义一个基于Promise的异步任务执行器
function run(taskDef) {
    //创建迭代器
    let task = taskDef();

    //开始执行任务
    let result = task.next();

    //递归函数遍历
    (function step() {
        //如果有更多任务要做
        if (!result.done) {
            //用一个Promise来解决会简化问题
            let promise = Promise.resolve(result.value);
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
window.runPromise = function (ajaxName, param, handle, mustLogin = false, method="post", handleParam) {
    let serializeParam = { "username": localStorage.getItem("username") };
    
    if (method == "post") {
        Object.assign(serializeParam, param);
    } else {
        serializeParam = param;
    }

    run(function* () {
        // let contents = yield ajaxName(param);
        let contents = yield sendAjax(ajaxURLList[ajaxName], serializeParam, method);
        handle(contents.data, handleParam);
    })
}
function params(data) {
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += '&' + k + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}
//发送ajax请求通用
function sendAjax(url, param, method) {
    return new Promise(function (resolve, reject) {
        if (method.toLowerCase() == "get") {
            let URL = url;
            if (param instanceof Object) {
                for (const key in param) {
                    if (param.hasOwnProperty(key)) {
                        const element = param[key];
                        URL += "/" + param[key];
                    }
                }
            }
            Ajax.get(URL).then(req => {
                resolve(req);
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                reject(error);
            });
        } else {
            Ajax.post(url, params(param)).then(req => {
                resolve(req);
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                alert("网络错误，请保持网络通畅！");
                setTimeout(() => {
                    Toast.hide();
                }, 1000);
                reject(error);
            });
        }
    });
}
