<?php
    //include "sg_header.php";
    include "sg_db_connect.php";  
    include "sg_common.php";  
?>
<?php

    function done_equipment($db, $row, $field_name, $equipment_classes, $dict, &$record)
    {
        if($row[$field_name] == 0)
        {
            $new = get_need_equipment($db, $row['level'], $equipment_classes);
            if($new != '')
                $record[$field_name] = array('status'=>1, 'name'=>$new);
            else 
            {
                $list = array();
                foreach($equipment_classes as &$value)
                {
                    if(!is_null($value))
                    {
                        $list[] = $dict[$value];
                    }
                }
                $record[$field_name] = array('status'=>-1, 'type'=>$list);
            }
        }
        else
            $record[$field_name] = array('status'=>0, 'name'=>$row[$field_name]);        
    }
    function get_type_dict($db)
    {
        $result = $db->query('select * from sg_equipment_type_dict');
        $num = $result->num_rows;
        $list = array();
        for($i = 0; $i < $num; ++$i)        
        {
            $row = $result->fetch_assoc();
            $list[$row['equipment_type_id']] = $row['name'];
        }    
        $result->free();
        return $list;
    }
?>
<?php
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
        order by convert(hero_name using gbk)
    ');
    $list = array();
    $dict = get_type_dict($db);
    $num = $result->num_rows;
    for($i = 0; $i < $num; ++$i)        
    {
        $row = $result->fetch_assoc();
        $record = array();
        $record['id'] = $row['hero_id'];
        $record['name'] = $row['hero_name'];
        $record['level'] = $row['level'];
        done_equipment($db, $row, 'weapon', array($row['weapon1_type'] , $row['weapon2_type'], $row['weapon3_type'], $row['weapon4_type'] ), $dict, $record);
        done_equipment($db, $row, 'clothes', array($row['clothes1_type'] , $row['clothes2_type'] ), $dict, $record);
        done_equipment($db, $row, 'hat', array($row['hat_type']), $dict, $record);
        done_equipment($db, $row, 'bracer', array($row['bracer_type']), $dict, $record);
        done_equipment($db, $row, 'shoes', array($row['shoes_type']), $dict, $record);
        done_equipment($db, $row, 'other1', array($row['other11_type'], $row['other12_type']), $dict, $record);
        done_equipment($db, $row, 'other2', array($row['other21_type'], $row['other22_type']), $dict, $record);
        $list[] = $record;
    }
    echo json_encode($list);
    $result->free();
?>
<?php
    $db->close();
    //include "sg_footer.php";
?>
