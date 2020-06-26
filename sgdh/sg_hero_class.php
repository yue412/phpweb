<?php
    include "sg_header.php";
    include "sg_db_connect.php";
    include "sg_table_common.php";
    include "sg_common.php";
?>
<a href=<?php echo '"sg_new_hero_class.php"'?>>新建</a>
<a href="sg_main2.html">返回</a>
<br>
<?php
    $sql = 'SELECT a.hero_class_id, 
        a.name, 
        b.name as weapon1, 
        c.name as weapon2, 
        d.name as weapon3, 
        e.name as weapon4, 
        f.name as clothes1, 
        g.name as clothes2, 
        h.name as hat, 
        i.name as bracer, 
        j.name as shoes, 
        k.name as other11, 
        l.name as other12, 
        m.name as other21,
        n.name as other22
        FROM rs2xq7qc15.sg_hero_class as a 
        left join sg_equipment_type_dict as b on a.weapon1_type = b.equipment_type_id 
        left join sg_equipment_type_dict as c on a.weapon2_type = c.equipment_type_id
        left join sg_equipment_type_dict as d on a.weapon3_type = d.equipment_type_id 
        left join sg_equipment_type_dict as e on a.weapon4_type = e.equipment_type_id
        left join sg_equipment_type_dict as f on a.clothes1_type = f.equipment_type_id 
        left join sg_equipment_type_dict as g on a.clothes2_type = g.equipment_type_id
        left join sg_equipment_type_dict as h on a.hat_type = h.equipment_type_id 
        left join sg_equipment_type_dict as i on a.bracer_type = i.equipment_type_id
        left join sg_equipment_type_dict as j on a.shoes_type = j.equipment_type_id 
        left join sg_equipment_type_dict as k on a.other11_type = k.equipment_type_id
        left join sg_equipment_type_dict as l on a.other12_type = l.equipment_type_id 
        left join sg_equipment_type_dict as m on a.other21_type = m.equipment_type_id
        left join sg_equipment_type_dict as n on a.other22_type = n.equipment_type_id
    ';
    $modify_url = 'sg_modify_hero_class.php';
    $delete_url = 'sg_delete_record.php?'.http_build_query(array('table_name'=>'sg_hero_class', 'source'=>'sg_hero_class.php'));
    create_table($db, $sql, 
        'sg_hero_class',
        array('id', '名称', '武器1', '武器2', '武器3', '武器4', '衣服1', '衣服2', '帽子', '护手', '鞋', '装饰11', '装饰12', '装饰21', '装饰22'), 
        NULL,
        $modify_url, 
        $delete_url);
?>
<?php
    $db->close();
    include "sg_footer.php";
?>