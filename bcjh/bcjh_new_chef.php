<?php
    include_once("common.php");
    $starttime = explode(' ',microtime());
?>
<html>
    <head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>
        </title>
        <style type="text/css">
            div.no {font-size: 120%;display:inline}
            div.yes {font-size: 80%;display:inline}
        </style>
        <script type="text/javascript" src="bcjh_data.js">
        </script>
        <script type="text/javascript" src="bcjh_common.js">
        </script>        
    </head>
    <body onload="load_combox()">
<?php
    //include_once 'header.php';
    include_once 'db_connect.php';
    include_once 'table_common.php';
    include_once 'common.php';

?>
<?php

    create_new_form($db, 'bcjh_chefs', 
        array(
            'id'=>'ID',
            'name'=>'名称', 
            'level' => '级别',
            'stirfry'=>'炒', 
            'steam'=>'蒸', 
            'knife'=>'切', 
            'fry'=>'炸', 
            'boil'=>'煮', 
            'bake'=>'烤', 
            'fish'=>'鱼',
            'creation'=>'面',
            'veg'=>'菜',
            'meat'=>'肉',
            'rarity'=>'稀有度',
            'skill_id'=>'技能',
            'equip_id'=>'装备',
            'ultimate_skill_id'=>'终极技能'
        ), 
        array('skill_id'=>array(), 'equip_id'=>array(), 'ultimate_skill_id'=>array()), 
        array(
            'id'=>get_browser_param("id", 0),
            'name'=>get_browser_param("name", ""),
            'level'=>get_browser_param("level", ""),
            'stirfry'=>get_browser_param("stirfry", ""),
            'steam'=>get_browser_param("steam", ""),
            'knife'=>get_browser_param("knife", ""),
            'fry'=>get_browser_param("fry", ""),
            'boil'=>get_browser_param("boil", ""),
            'bake'=>get_browser_param("bake", ""),
            'fish'=>get_browser_param("fish", ""),
            'creation'=>get_browser_param("creation", ""),
            'veg'=>get_browser_param("veg", ""),
            'meat'=>get_browser_param("meat", ""),
            'rarity'=>get_browser_param("rarity", ""),
            'skill_id'=>get_browser_param("skill_id", ""),
            'ultimate_skill_id'=>get_browser_param("ultimate_skill_id", "")
        ), 
        'bcjh_chefs.html');
?>
<?php
    $db->close();
    include_once 'footer.php';
?>