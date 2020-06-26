<?php
    include("sg_db_connect.php");
    include("sg_common.php")
?>
<?php
    $hero_id = $_GET['id'];
    $type = $_GET['type'];
    $val = $_GET['checked'];
    //var_dump($source);
    $field_names = array('weapon', 'clothes', 'hat', 'bracer', 'shoes', 'other1', 'other2');

    $field = $field_names[$type];
    $value = $val == 'true' ? 1 : 0;
    $sql = 'UPDATE `sg_hero2` SET `'.$field.'` = \''.$value.'\' WHERE (`hero_id` = \''.$hero_id.'\')';
    //var_dump($sql);
    $db->query($sql);

    $equipment = '';
    if($value == 0)
    {
        $result = $db->query('
            SELECT a.hero_id, 
            b.name as hero_name,
            a.level, 
            a.weapon,
            a.clothes, 
            a.hat, 
            a.bracer,
            a.shoes, 
            a.other1,
            a.other2,
            b.*
            FROM sg_hero2 as a 
            inner join sg_hero_class as b on a.hero_class_id = b.hero_class_id
            where a.hero_id = '.$hero_id
        );
        $type_fields = array(
            array('weapon1_type','weapon2_type','weapon3_type','weapon4_type'), 
            array('clothes1_type', 'clothes2_type'), 
            array('hat_type'), 
            array('bracer_type'), 
            array('shoes_type'), 
            array('other11_type', 'other12_type'), 
            array('other21_type', 'other22_type')
        );
        $num = $result->num_rows;
        if($num > 0)
        {
            $row = $result->fetch_assoc();
            $arr = array();
            foreach ($type_fields[$type] as $field_name) {
                $arr[] = $row[$field_name];
            }
            $equipment = get_need_equipment($db, $row['level'], $arr);
        }
        $result->free();
    }
    echo $equipment;
?>
<?php
    $db->close();
?>