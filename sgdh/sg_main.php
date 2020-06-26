<?php
    include "sg_header.php";
    include "sg_db_connect.php";    
?>
    <a href="sg_equipment_factory.php">装备库</a>
    <a href="sg_hero_class.php">英雄模板</a>
    <a href="sg_hero.php">英雄</a>
<?php
    function get_need_equipment($db, $hero_level, $equipment_classes)
    {
        $list = array();
        foreach($equipment_classes as $value)
        {
            if(!is_null($value))
            $list[] = 'equipment_type_id = '.$value;
        }
        $s_equipment_type = implode(' or ', $list);
        $min_level = $hero_level-2;
        $max_level = $hero_level+2;
        $sql = 'SELECT * FROM sg_equipment_class where can_make and ('.$s_equipment_type.') and (level >= '.$min_level.' and level <= '.$max_level.') order by level desc, quality desc, equipment_type_id';
        //print_r($sql);
        $result = $db->query($sql);
        $equipment_name = '';
        if($result->num_rows>0)
        {
            $row = $result->fetch_assoc();
            $equipment_name = $row['name'];
        }
        $result->free();
        return $equipment_name;
    }

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
        order by level desc, convert(hero_name using gbk)
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
        done_equipment($db, $row, 'weapon', array($row['weapon1_type']/* , $row['weapon2_type'], $row['weapon3_type'], $row['weapon4_type'] */), $dict, $record);
        done_equipment($db, $row, 'clothes', array($row['clothes1_type']/* , $row['clothes2_type'] */), $dict, $record);
        done_equipment($db, $row, 'hat', array($row['hat_type']), $dict, $record);
        done_equipment($db, $row, 'bracer', array($row['bracer_type']), $dict, $record);
        done_equipment($db, $row, 'shoes', array($row['shoes_type']), $dict, $record);
        done_equipment($db, $row, 'other1', array($row['other11_type']/*, $row['other12_type']*/), $dict, $record);
        done_equipment($db, $row, 'other2', array($row['other21_type']/* , $row['other22_type'] */), $dict, $record);
        $list[] = $record;
    }
    echo '<script type="text/javascript">';
    echo 'var g_hero_eqiupment = '.json_encode($list).';';
    echo '</script>';
    $result->free();
?>
<script type="text/javascript">
    function output_equipment_name(obj)
    {
        var s = "";
        switch(obj.status)
        {
            case 0: s = obj.name == 1?"是":"";
                break;
            case 1: s = "<font color=\"red\">"+obj.name+"</font>" ;
                break;
        }
        return s;
    }
    function output_collect_table()
    {
        var s_content = "<table border = 1>";
        for (var i = 0; i <g_hero_eqiupment.length; i++)
        {
            s_content += "<tr>";
            s_content += "<td>";
            s_content += g_hero_eqiupment[i].id;
            s_content += "</td>";
            s_content += "<td>";
            s_content += g_hero_eqiupment[i].name;
            s_content += "</td>";
            s_content += "<td>";
            s_content += g_hero_eqiupment[i].level;
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].weapon);
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].clothes);
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].hat);
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].bracer);
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].shoes);
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].other1);
            s_content += "</td>";
            s_content += "<td>";
            s_content += output_equipment_name(g_hero_eqiupment[i].other2);
            s_content += "</td>";
            s_content += "</tr>";
        }
        s_content += "</table>"
        var e = document.getElementById("content");
        e.innerHTML = s_content;
    }
    function done_need(obj, map)
    {
        if(obj.status == 1)
        {
            var cnt = 0;
            if(map.has(obj.name))
                cnt = map.get(obj.name);
            map.set(obj.name, ++cnt);
        }
    }
    function output_need_table()
    {
        var m = new Map();
        for (var i = 0; i <g_hero_eqiupment.length; i++)
        {
            done_need(g_hero_eqiupment[i].weapon, m);
            done_need(g_hero_eqiupment[i].clothes, m);
            done_need(g_hero_eqiupment[i].hat, m);
            done_need(g_hero_eqiupment[i].bracer, m);
            done_need(g_hero_eqiupment[i].shoes, m);
            done_need(g_hero_eqiupment[i].other1, m);
            done_need(g_hero_eqiupment[i].other2, m);
        }
        var arr = Array.from(m);
        arr.sort(function(a,b){
            return b[1]-a[1]});
        var s = "<table border = 1>";
        for (var i = 0; i <arr.length; i++)
        {
            s += "<tr>"; 
            s += "<td>"; 
            s += arr[i][0];
            s += "</td>"; 
            s += "<td>"; 
            s += arr[i][1];
            s += "</td>"; 
            s += "</tr>"; 
        };
        s += "</table>"; 
        var e = document.getElementById("content");
        e.innerHTML = s;
    }
    function done_missed(obj, map)
    {
        if(obj.status == -1)
        {
            var arr = obj.type;
            for (var i = 0; i <1/*arr.length*/; i++)
            {
                var cnt = 0;
                if(map.has(arr[i]))
                    cnt = map.get(arr[i]);
                map.set(arr[i], ++cnt);
            }
        }
    }    
    function output_missed_table()
    {
        var m = new Map();
        for (var i = 0; i <g_hero_eqiupment.length; i++)
        {
            done_missed(g_hero_eqiupment[i].weapon, m);
            done_missed(g_hero_eqiupment[i].clothes, m);
            done_missed(g_hero_eqiupment[i].hat, m);
            done_missed(g_hero_eqiupment[i].bracer, m);
            done_missed(g_hero_eqiupment[i].shoes, m);
            done_missed(g_hero_eqiupment[i].other1, m);
            done_missed(g_hero_eqiupment[i].other2, m);
        }
        var arr = Array.from(m);
        arr.sort(function(a,b){
            return b[1]-a[1]});
        var s = "<table border = 1>";
        for (var i = 0; i <arr.length; i++)
        {
            s += "<tr>"; 
            s += "<td>"; 
            s += arr[i][0];
            s += "</td>"; 
            s += "<td>"; 
            s += arr[i][1];
            s += "</td>"; 
            s += "</tr>"; 
        };
        s += "</table>"; 
        var e = document.getElementById("content");
        e.innerHTML = s;
    }
</script>
<br>
<input type="button" onclick="output_collect_table()" value="汇总表"/>
<input type="button" onclick="output_need_table()" value="需求表"/>
<input type="button" onclick="output_missed_table()" value="缺口表"/>
<br>
<div id="content"></div>
<script type="text/javascript">
output_collect_table();
</script>



<?php
    $db->close();
    include "sg_footer.php";
?>
