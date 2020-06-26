<?php
    include 'sg_header.php';
    include 'sg_db_connect.php';
    include 'sg_table_common.php';
    include 'sg_common.php';

    $equipment_type = get_browser_param('type', 0);
    $id_val = get_browser_param('equipment_class_id', -1);
?>
<?php
    create_update_form($db, 'sg_equipment_class', 'equipment_class_id', $id_val,
        array('name'=>'名称', 'level'=>'级别', 'quality'=>'质量', 'can_make'=>'能否制造', 'equipment_type_id'=>'类型'), 
        array('quality'=>$g_quality_types), 
        'sg_equipment_factory.php?type='.$equipment_type);
?>
<?php
    $db->close();
    include 'sg_footer.php';
?>