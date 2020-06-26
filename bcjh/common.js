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
    xmlhttp.send();
}

function checkbox_check(id)
{
    if (document.getElementById(id).checked)
        document.getElementById(id + "_val").value = 1;
    else
        document.getElementById(id + "_val").value = 0;
}

