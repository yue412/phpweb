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

    $id_val = get_browser_param('id', -1);
?>

<?php
    create_update_form($db, 'bcjh_chefs', 'id', $id_val,
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
            'equip_id'=>'装备'
        ), 
        array('skill_id'=>array(), 'equip_id'=>array()), 
        'bcjh_chefs.html');
?>
<?php
    $db->close();
    include_once 'footer.php';
?>