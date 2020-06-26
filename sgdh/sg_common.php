<?php
    $g_quality_types = array('普通','良好','优异','无暇','史诗','传说','神话');
    $g_bool_str = array('否','是');

    function array_remove_by_key(&$arr, $key)
    {
        $keys = array_keys($arr);
        $index = array_search($key, $keys); 
        if($index !== FALSE){ 
            array_splice($arr, $index, 1); 
        }
    }

    function get_browser_param($name, $default)
    {
        global $_GET;
        $val = $default;
        if(is_array($_GET)&&count($_GET)>0)
        {
            if(isset($_GET[$name]))
                $val = $_GET[$name];
        }    
        return $val;      
    }
    function get_need_equipment($db, $hero_level, $equipment_classes)
    {
        $equipment_name = '';
        foreach ($equipment_classes as $value) 
        {
//            $list = array();
            if(is_null($value))
                continue;
            // foreach($equipment_classes as $value)
            // {
            //     if(!is_null($value))
            //     $list[] = 'equipment_type_id = '.$value;
            // }
            // $s_equipment_type = implode(' or ', $list);
            $s_equipment_type = 'equipment_type_id = '.$value;
            $min_level = $hero_level-2;
            $max_level = $hero_level+2;
            $sql = 'SELECT * FROM sg_equipment_class where can_make and ('.$s_equipment_type.') and (level >= '.$min_level.' and level <= '.$max_level.') order by level desc, quality desc, equipment_type_id';
    //        print_r($sql);
            $result = $db->query($sql);
    //
            if($result->num_rows>0)
            {
                $row = $result->fetch_assoc();
                $equipment_name = $row['name'];
                return $equipment_name;
            }
            $result->free();
        }
        return $equipment_name;
    }
    function create_type_menu($db, $equipment_type, $page, $need_all = TRUE)
    {
        echo '分类: ';
        if($need_all)
        {
            if($equipment_type != 0)
                echo ' <a href="'.$page.'?type=0">全部</a> ';
            else
                echo ' 全部 ';
        }
        $result = $db->query('SELECT * FROM sg_equipment_type_dict');
        $num = $result->num_rows;
        for($i = 0; $i < $num; ++$i)
        {
            $row = $result->fetch_assoc();
            $type = $row['equipment_type_id'];
            if($equipment_type != $type)
                echo '<a href="'.$page.'?type='.$type.'">'.$row['name'].'</a> ';
            else
                echo $row['name'].' ';
        }
         $result->free();
    }

?>