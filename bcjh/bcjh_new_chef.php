<?php
    include_once 'header.php';
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
            'rarity'=>'稀有度'
        ), 
        NULL, 
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
            'rarity'=>get_browser_param("rarity", "")
        ), 
        'bcjh_chefs.html');
?>
<?php
    $db->close();
    include_once 'footer.php';
?>