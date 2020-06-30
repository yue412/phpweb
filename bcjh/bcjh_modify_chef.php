<?php
    include_once 'header.php';
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
            'rarity'=>'稀有度'
        ), 
        NULL, 
        'bcjh_chefs.html');
?>
<?php
    $db->close();
    include_once 'footer.php';
?>