<?php
    $url = "https://bcjh.gitee.io";
    $sText = file_get_contents($url);
    if(preg_match('/(index\.js\?v=[0-9]+)/', $sText, $matches))
    {
        $s = $matches[0];
        $url2 = $url."/js/".$s;
        //echo $url2;
        $sText2 = file_get_contents($url2);
        if(preg_match('/(foodgodRule\.min\.json\?v=[0-9]+)/', $sText2, $matches))
        {
            $url3 =$url."/data/".$matches[0];
            echo file_get_contents($url3);
        }
    }
?>