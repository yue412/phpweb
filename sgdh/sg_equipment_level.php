<?php
    include "sg_header.php";
    include "sg_db_connect.php";
    include "sg_table_common.php";
    include "sg_common.php";
?>
<br>
<a href="sg_main2.html">返回</a>
<br>
<?php
    create_table($db, 'select * from (SELECT equipment_class_id, sg_equipment_class.name, level, quality, can_make, sg_equipment_type_dict.name as type_name FROM sg_equipment_class inner join sg_equipment_type_dict on sg_equipment_class.equipment_type_id = sg_equipment_type_dict.equipment_type_id order by level desc) as a group by type_name order by level, type_name', 
        'sg_equipment_class',
        array('id', '名称', '级别', '质量', '能否制造', '类型'), 
        array('quality'=>$g_quality_types, 'can_make'=>$g_bool_str)
        );

?>
<?php
    $db->close();
    include "sg_footer.php";
?>