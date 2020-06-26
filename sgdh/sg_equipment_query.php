<?php
    include "sg_header.php";
    include "sg_db_connect.php";
    include "sg_table_common.php";
    include "sg_common.php";

    $type = get_browser_param('type', 1);
?>
<?php
    // main
    create_type_menu($db, $type, 'sg_equipment_query.php', FALSE);
?>
<br>
<a href="sg_main2.html">返回</a>
<br>
<?php
    $sql = '
    SELECT hero_id, name, level FROM sg_hero2 inner join sg_hero_class on sg_hero2.hero_class_id = sg_hero_class.hero_class_id
    where (
        (weapon = 0 and (weapon1_type = '.$type.' or weapon2_type = '.$type.' or weapon3_type = '.$type.' or weapon4_type = '.$type.')) or
        (clothes = 0 and (clothes1_type = '.$type.' or clothes2_type = '.$type.')) or 
        (hat = 0 and hat_type = '.$type.') or 
        (bracer = 0 and bracer_type = '.$type.') or 
        (shoes = 0 and shoes_type = '.$type.') or 
        (other1 = 0 and (other11_type = '.$type.' or other12_type = '.$type.')) or
        (other2 = 0 and (other21_type = '.$type.' or other22_type = '.$type.'))
        ) 
        order by level
    ';
    create_table($db, $sql, 
        'sg_hero2',
        array('ID', '名称', '级别')
        );
?>
<?php
    $db->close();
    include "sg_footer.php";
?>