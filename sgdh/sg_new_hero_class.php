<?php
    include 'sg_header.php';
    include 'sg_db_connect.php';
    include 'sg_table_common.php';
    include 'sg_common.php';

?>
<?php
    create_new_form($db, 'sg_hero_class', 
        array('name'=>'名称', 
            'weapon1_type'=>'武器1', 
            'weapon2_type'=>'武器2', 
            'weapon3_type'=>'武器3', 
            'weapon4_type'=>'武器4', 
            'clothes1_type'=>'衣服1', 
            'clothes2_type'=>'衣服2', 
            'hat_type'=>'帽子', 
            'bracer_type'=>'护手', 
            'shoes_type'=>'鞋', 
            'other11_type'=>'装饰11', 
            'other12_type'=>'装饰12', 
            'other21_type'=>'装饰21', 
            'other22_type'=>'装饰22'), 
        NULL, 
        NULL, 
        'sg_hero_class.php');
?>
<?php
    $db->close();
    include 'sg_footer.php';
?>