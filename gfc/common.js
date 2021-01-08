function do_ajax(url, cfunc) 
{
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

function checkbox_check(id)
{
    if (document.getElementById(id).checked)
        document.getElementById(id + "_val").value = 1;
    else
        document.getElementById(id + "_val").value = 0;
}

function goBack(){
    window.history.back()
}

function build_combox_param(doc, name)
{
    var e = doc.getElementById(name);
    var option = e.options[e.selectedIndex];
    var val = option.value == -1 ? "" : option.value;
    return name + "=" + val;
}

function build_checkbox_param(doc, name)
{
    var e = doc.getElementById(name);
    var val = e.checked ? 1 : 0;
    return name + "=" + val;
}

function build_param(doc, name)
{
    var e = doc.getElementById(name);
    var val = e.value;
    return name + "=" + val;
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var url = decodeURI(window.location.search);
     var r = url.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
     if(r!=null)
        return unescape(r[2]); 
    return null;
}

// [[key,val],[key,val]]
function build_url_params(arr)
{
    var list = [];
    for (let i = 0; i < arr.length; i++) {
        const pair = arr[i];
        var str = pair[0] + "=" + pair[1];
        list.push(str);
    }
    return encodeURIComponent(list.join("&"));
}

function clone(obj)
{
    return JSON.parse(JSON.stringify(obj));
}