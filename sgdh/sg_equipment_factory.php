<?php
    include "sg_header.php";
    include "sg_db_connect.php";
    include "sg_table_common.php";
    include "sg_common.php";

    $equipment_type = get_browser_param('type', 0);
?>
<?php

?>
<?php
    // main
    create_type_menu($db, $equipment_type, 'sg_equipment_factory.php');
?>
<br>
<a href=<?php echo '"sg_new_equipment_class.php?type='.$equipment_type.'"'?>>新建</a>
<a href="sg_main2.html">返回</a>
<br>
<?php
    $modify_url = 'sg_modify_equipment_class.php?type='.$equipment_type;
    $delete_url = 'sg_delete_record.php?'.http_build_query(array('table_name'=>'sg_equipment_class', 'source'=>'sg_equipment_factory.php?type='.$equipment_type));
    if($equipment_type == 0)
        create_table($db, 'SELECT equipment_class_id, sg_equipment_class.name, level, quality, can_make, sg_equipment_type_dict.name as type_name FROM sg_equipment_class inner join sg_equipment_type_dict on sg_equipment_class.equipment_type_id = sg_equipment_type_dict.equipment_type_id order by sg_equipment_class.equipment_type_id, level', 
            'sg_equipment_class',
            array('id', '名称', '级别', '质量', '能否制造', '类型'), 
            array('quality'=>$g_quality_types, 'can_make'=>$g_bool_str),
            $modify_url, 
            $delete_url);
    else
        create_table($db, 'SELECT equipment_class_id, sg_equipment_class.name, level, quality, can_make FROM sg_equipment_class where equipment_type_id = '.$equipment_type.' order by level', 
            'sg_equipment_class',
            array('id', '名称', '级别', '质量', '能否制造'), 
            array('quality'=>$g_quality_types, 'can_make'=>$g_bool_str),
            $modify_url, 
            $delete_url);
?>
<?php
    $db->close();
    include "sg_footer.php";
?>