function do_ajax(url, cfunc) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            cfunc(xmlhttp.responseText);
        }
    }
    if (url.indexOf("?") == -1)
        url += '?';
    else
        url += '&';
    url += "t=" + Math.random();
    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    //xmlhttp.setRequestHeader( 'Content-Type', 'application/json' ); 
    xmlhttp.send();
}

function checkbox_check(id) {
    if (document.getElementById(id).checked)
        document.getElementById(id + "_val").value = 1;
    else
        document.getElementById(id + "_val").value = 0;
}

function goBack() {
    window.history.back()
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}

// [[key,val],[key,val]]
function build_url_params(arr) {
    var list = [];
    for (let i = 0; i < arr.length; i++) {
        const pair = arr[i];
        var str = pair[0] + "=" + encodeURIComponent(pair[1]);
        list.push(str);
    }
    return list.join("&");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var url = decodeURIComponent(window.location.search);
    var r = url.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if (r != null)
        return unescape(r[2]);
    return null;
}

function post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}