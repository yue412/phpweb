<?php
    include 'sg_header.php';
    include 'sg_db_connect.php';
    include 'sg_table_common.php';
    include 'sg_common.php';

    $id_val = get_browser_param('hero_id', -1);
?>
<?php
    create_update_form($db, 'sg_hero2', 'hero_id', $id_val,
        array('hero_class_id'=>'名称', 
            'level' => '级别',
            'weapon'=>'武器', 
            'clothes'=>'衣服', 
            'hat'=>'帽子', 
            'bracer'=>'护手', 
            'shoes'=>'鞋', 
            'other1'=>'装饰1', 
            'other2'=>'装饰2'
        ), 
        NULL, 
        'sg_hero.php');
?>
<?php
    $db->close();
    include 'sg_footer.php';
?>