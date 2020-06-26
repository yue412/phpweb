<?php
$filter = trim($_POST['filter']);
$filter_list = explode(' ',$filter);
//var_dump($filter_list);
?>

<?php
// dark cook
//$materials = array('鸡蛋','大米','生菜','番茄','蘑菇','面粉','马铃薯','鸡肉','猪肉','南瓜','牛肉','洋葱','牛奶','西兰花','玉米','胡萝卜','仙人掌','三文鱼','冬瓜','生蚝');
$materials = array('鸡蛋','大米','生菜','番茄','蘑菇','面粉','马铃薯','鸡肉','猪肉','南瓜','牛肉','洋葱','牛奶','西兰花','玉米','胡萝卜','仙人掌','三文鱼','冬瓜','生蚝');

function filterMenu(&$selected_materials)
{
    global $filter_list;
    foreach($selected_materials as $item)
    {
        foreach($filter_list as $filter_item)
        {
            if($filter_item == $item['name'])
            {
                return true;
            }
        }
    }
    return false;
}

function menu(&$material_list, $index, $num, &$selected_materials)
{
    global $filter;
    if($num==0)
    {
        //echo
        $display = $filter == '' || filterMenu($selected_materials);
        if ($display)
        {
            echo '<tr>';
            foreach($selected_materials as $item)
            {
                echo '<td>'.$item['name'].','.$item['count'].'</td>';
            }
            echo '</tr>';
        }
//        echo '<br>';
    }
    else
    {
        $material = $material_list[$index];
        if($index < count($material_list)-1)
        {
            //echo current($material_list).'H';
            
            for($i=1;$i<$num+1;++$i)
            {
                $selected_materials[] = array('name'=>$material, 'count'=>$i);
                //var_dump($selected_materials);
                menu($material_list, $index + 1, $num-$i, $selected_materials);
                array_splice($selected_materials, -1, 1);
                //var_dump($selected_materials);
            }            
            
            menu($material_list, $index + 1, $num, $selected_materials); // 不含current
        }
        else
        {
            //echo 'hehe';
            $selected_materials[] = array('name'=>$material, 'count'=>$num);
            //var_dump($selected_materials);
            menu($material_list, $index, 0, $selected_materials);
            //array_slice($selected_materials, -1, 1);
            array_splice($selected_materials, -1, 1);
            //var_dump($selected_materials);
        }
        
    }
}

function combination($m, $n, $index, &$item, &$result_list)
{
    if($n==0)
    {
        $result_list[] = $item;
    }
    else
    {
        $item[$index] = $m;
        combination($m - 1, $n - 1, $index + 1, $item, $result_list);
        
        if($m > $n)
            combination($m - 1, $n, $index, $item, $result_list);
    }
}

?>

<?php
//main
/*
$selected_materials[] = array('name'=>'abc', 'count'=>1);
var_dump($selected_materials);
//array_slice($selected_materials, -1, 1);
array_splice($selected_materials, count($selected_materials)-1, 1);
echo '<br>';
var_dump($selected_materials);
*/
$starttime = explode(' ',microtime());
echo microtime();
/*········以下是代码区·········*/
//print_r($materials);
$selected = array();
$item = array();
combination(44, 5, 0, $item, $selected);
//var_dump($selected);
 /*········以上是代码区·········*/
 //程序运行时间
$endtime = explode(' ',microtime());
$thistime = $endtime[0]+$endtime[1]-($starttime[0]+$starttime[1]);
$thistime = round($thistime,3);
echo "本网页执行耗时：".$thistime." 秒。";
/*
echo '<table border="1">';
for($i=2; $i<6; ++$i)
{
    $selected = array();
    $alternative = $materials;
    menu($alternative, 0, $i, $selected);
}
echo '</table>';
*/
?>