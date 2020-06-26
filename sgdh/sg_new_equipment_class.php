<?php
    include 'sg_header.php';
    include 'sg_db_connect.php';
    include 'sg_table_common.php';
    include 'sg_common.php';

    $equipment_type = get_browser_param('type', 0);
?>
<?php
    create_new_form($db, 'sg_equipment_class', 
        array('name'=>'名称', 'level'=>'级别', 'quality'=>'质量', 'can_make'=>'能否制造', 'equipment_type_id'=>'类型'), 
        array('quality'=>$g_quality_types), 
        array('equipment_type_id'=>$equipment_type), 
        'sg_equipment_factory.php?'.http_build_query($_GET));
?>
<?php
    $db->close();
    include 'sg_footer.php';
?>