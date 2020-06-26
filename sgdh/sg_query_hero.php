<?php
    //include "sg_header.php";
    include "sg_db_connect.php";  
    include "sg_common.php";  
?>
<?php
    $level = $_GET['level'];
    $type = $_GET['type'];
    $condition = $level <= 0 ? '' : 'and (level>='.($level-2).' and level<='.($level+2).') ';
    $sql = '
    SELECT * FROM sg_hero2 inner join sg_hero_class on sg_hero2.hero_class_id = sg_hero_class.hero_class_id
    where (
        (weapon = 0 and (weapon1_type = '.$type.' or weapon2_type = '.$type.' or weapon3_type = '.$type.' or weapon4_type = '.$type.')) or
        (clothes = 0 and (clothes1_type = '.$type.' or clothes2_type = '.$type.')) or 
        (hat = 0 and hat_type = '.$type.') or 
        (bracer = 0 and bracer_type = '.$type.') or 
        (shoes = 0 and shoes_type = '.$type.') or 
        (other1 = 0 and (other11_type = '.$type.' or other12_type = '.$type.')) or
        (other2 = 0 and (other21_type = '.$type.' or other22_type = '.$type.'))
        ) '.$condition.'
        order by level
';
    $result = $db->query($sql);
    //echo $sql;
    $list = array();
    $num = $result->num_rows;
    for($i = 0; $i < $num; ++$i)        
    {
        $row = $result->fetch_assoc();
        $record = array();
        $record['id'] = $row['hero_id'];
        $record['name'] = $row['name'];
        $record['level'] = $row['level'];
        $list[] = $record;
    }
    echo json_encode($list);
    $result->free();
?>
<?php
    $db->close();
    //include "sg_footer.php";
?>
