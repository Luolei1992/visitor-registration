// 验证手机号
const CheckPhone = (value) => {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        return {
            hasError: true,
            errorMessage: '请输入正确的11位手机号'
        }
    }
    return {
        hasError: false
    }
}
// 验证邮箱 
const CheckEmail = (value) => {
    if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value)) {
        return {
            hasError: true,
            errorMessage: '请输入正确的邮箱格式'
        }
    }
    return {
        hasError: false
    }
}
//验证密码长度
const CheckKeywords = (value) => {
    if(value.length < 6) {
        return {
            hasError: true,
            errorMessage: '密码长度不能低于6位'
        }
    }
    return {
        hasError: false
    }
}
//短信验证码

const getCookie = (name) => {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return decodeURIComponent(arr[2]); return null;
};

const setCookie = (name, value, time) => {
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString();
};
const getsec = (str) => {
    if (str == "" || str == null) {
        str = "3d";
    }
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
const getNowFormatDate=()=> {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
export default {
    CheckPhone, 
    CheckKeywords, 
    getCookie, 
    setCookie,
    CheckEmail,
    getNowFormatDate
}