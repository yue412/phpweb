<?php
$starttime = explode(' ',microtime());
$material_count = ($_GET['material_count']);
$m1 = $_GET['m1'];
$m2 = $_GET['m2'];
$m3 = $_GET['m3'];
$m4 = $_GET['m4'];
//$params = 'material_count='.$material_count.'&m1='.$m1.'&m2='.$m2.'&m3='.$m3.'&m4='.$m4;
$page = 0;
$item_cnt = 20;
if(isset($_GET["page"]))
{
	$page = $_GET["page"];
}
$selected_materials = array();
if($m1>=0) $selected_materials[] = $m1;
if($m2>=0) $selected_materials[] = $m2;
if($m3>=0) $selected_materials[] = $m3;
if($m4>=0) $selected_materials[] = $m4;
if(count($selected_materials)>$material_count)
	$material_count = count($selected_materials);
$material_group = 0;
if(isset($_GET["c1"]))
	$material_group |= 1;
if(isset($_GET["c2"]))
	$material_group |= 2;
if(isset($_GET["c3"]))
	$material_group |= 4;
if(isset($_GET["c4"]))
	$material_group |= 8;
if(isset($_GET["c5"]))
	$material_group |= 16;
if(isset($_GET["c6"]))
	$material_group |= 32;
if(isset($_GET["c7"]))
	$material_group |= 64;
$filter_by_group = $material_group>0;
if($material_group == 0)
	$material_group = 127;
?>
<?php
function init_dict(&$db, $query, $field, &$dict)
{
	$result = $db->query($query);
	$num = $result->num_rows;
	for($i = 0; $i < $num; ++$i)
	{
		$row = $result->fetch_assoc();
		$dict[] = $row[$field];
	}
	$result->free();
}
function init_food_menu(&$db, &$menu)
{
	global $material_count;
	if ($material_count==5)
		$query = 'SELECT * FROM food_menu where not isnull(m5)';
	else
		$query = 'SELECT * FROM food_menu where isnull(m'.($material_count+1).') and not isnull(m'.$material_count.')';
	$result = $db->query($query);
	$num = $result->num_rows;
	for($i = 0; $i < $num; ++$i)
	{
		$row = $result->fetch_assoc();
		//print_r($row);
		$item = array();
		$item[] = (int)$row['id'];
		$item[] = $row['m1'];
		$item[] = $row['m2'];
		if($material_count>2)
			$item[] = $row['m3'];
		if($material_count>3)
			$item[] = $row['m4'];
		if($material_count>4)
			$item[] = $row['m5'];
		$item[] = (int)$row['food'];
		$item[] = (int)$row['score'];
		$menu[] = $item;
	}
	$result->free();
}

function init_success_food_menu(&$db, $material_count, &$menu)
{
	//global $material_count;
	if ($material_count==5)
		$query = 'SELECT * FROM food_menu where not isnull(m5) and food > 0';//这种情况不应该出现
	else
		$query = 'SELECT * FROM food_menu where isnull(m'.($material_count+1).') and food > 0';
	$result = $db->query($query);
	$num = $result->num_rows;
	for($i = 0; $i < $num; ++$i)
	{
		$row = $result->fetch_assoc();
		$item = array();
		$item[] = (int)$row['id'];
		$item[] = (int)$row['m1'];
		$item[] = (int)$row['m2'];
		if(!is_null($row['m3']))
			$item[] = (int)$row['m3'];
		if(!is_null($row['m4']))
			$item[] = (int)$row['m4'];
		if(!is_null($row['m5']))
			$item[] = (int)$row['m5'];
		$item[] = (int)$row['food'];
		$item[] = (int)$row['score'];
		$menu[] = $item;
	}
	$result->free();
}

function match_food(&$comb, &$menu)
{
	$num = count($menu);
	for($i = 0; $i < $num; ++$i)
	{
		$find = true;
		for($j = 0; $j < count($comb); ++ $j)
		{
			if($comb[$j] != $menu[$i][$j+1])
			{
				$find = false;
				break;
			}
		}
		if($find)
		{
			return $i;
		}
	}
	return -1;
}
function find_perhaps(&$comb, &$menu, &$result_list)
{
	$num = count($menu);
	$comb_cnt = count($comb);
	//var_dump($comb);
	//echo '<br>';

	for($i = 0; $i < $num; ++$i)
	{
		$item_cnt = count($menu[$i])-1;
		if($menu[$i][$item_cnt-1]>0)
		{
			$find = true;
			$m = 0;
			$n = 1;
			//var_dump($menu[$i]);
			//echo '<br>'.$comb_cnt.','.$item_cnt.'<br>';
			while(($m < $comb_cnt) && ($n < ($item_cnt-1)))
			{
				//echo 'm:'.$m.',n:'.$n.'<br>';
				//echo $comb[$m].','.$menu[$i][$n].'<br>';
				if($comb[$m] == $menu[$i][$n])
				{
				//	echo '1=>';
					$find = true;
					++$m;
					++$n;
				}
				else if($comb[$m] > $menu[$i][$n])
				{
				//	echo '2=>';
					$find = false;
					break;
				}
				else
				{
					//echo '3=>';
					$find = false;
					++$m;
				}
			}
			//echo 'm:'.$m.',n:'.$n.'<br>';
//			var_dump( $find);
//			echo '<br>';
			if (/*$m>=$comb_cnt&&*/$n<$item_cnt-1)
				$find = false;
			if($find)
			{
				$result_list[] = $i;
				//return $i;
			}
		}

	}
	//return -1;
}
?>
<?php
@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}

$query = 'select * from material_dict order by material_id';
$material_dict = array();
init_dict($db, $query, 'name', $material_dict);
$material_group_dict = array();
init_dict($db, $query, 'group_id', $material_group_dict);

$query = 'SELECT * FROM material_dict where (group_id & '.$material_group.') <> 0 order by material_id';
$material_dict_by_group = array();
init_dict($db, $query, 'material_id', $material_dict_by_group);

$query = 'select * from food_dict order by food_id';
$food_dict = array();
init_dict($db, $query, 'name', $food_dict);

$food_menu = array();
init_food_menu($db, $food_menu);

$success_food_menu = array();
init_success_food_menu($db, $material_count-1, $success_food_menu);
//var_dump($success_food_menu);

$db->close();
?>
<?php
function combination($m, $n, $index, &$item, &$result_list)
{
    if($n<=0)
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
<html>
    <head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>
            黑暗料理王-材料组合
        </title>
    </head>
    <body>
<?php
//main
$comb_list = array();
$item = array();
$material_dict_cnt = count($material_dict);
$material_dict_by_group_cnt = count($material_dict_by_group);
$selected_material_cnt = count($selected_materials);
combination($material_dict_by_group_cnt + $material_count - $selected_material_cnt - 1, $material_count-$selected_material_cnt, 0, $item, $comb_list);
$num = count($comb_list);

$group_list=array();
for($i=0; $i<$num; ++$i)
{
	$comb = $comb_list[$i];
	$new_comb = array();
	$cnt = count($comb);
	for($j=0;$j<$cnt;++$j)
	{
		$new_index = $material_dict_by_group_cnt - $comb[$j] + ($cnt - 1 - $j);
		$new_comb[] = $material_dict_by_group[$new_index];
	}
	
	$grp = 0;
	for($j=0;$j<count($new_comb);++$j)
	{
		$grp |= $material_group_dict[$new_comb[$j]];
	}		
	$k = $j;
	for($j=0;$j<$selected_material_cnt;++$j)
	{
		$new_comb[] = $selected_materials[$j];
	}
	$grp2 = $grp;
	for($j=$k;$j<count($new_comb);++$j)
	{
		$grp2 |= $material_group_dict[$new_comb[$j]];
	}		
	sort($new_comb);
	if(!$filter_by_group || $grp2 == $material_group)
	{
		if(!array_key_exists($grp, $group_list))
		{
			$group_list[$grp] = array();
		}
		$group_list[$grp][] = $new_comb;
		//if($grp == $material_group)
		//$_list[] = $new_comb;
	}
	//else
	//{
	//	$new_comb_list[] = $new_comb;
	//}
}
ksort($group_list);
$new_comb_list = array();
$keys = array_keys($group_list);
for($i=0;$i<count($keys);++$i)
{
	$_key = $keys[$i];
	if(!$filter_by_group || $_key == $material_group)
	{
		for($j=0;$j<count($group_list[$_key]);++$j)
		{
			$new_comb_list[] = $group_list[$_key][$j];
		}
	}
}

$num = count($new_comb_list);
echo '<a href="dark.php"> 返回 </a>';
echo ' 共'.$num.'条记录 ';
echo '<table border="1">';
//标题
echo '<tr>';
for($j=0;$j<$material_count;++$j)
{
	echo '<td>材料'.($j+1).'</td>';
}
echo '<td>菜名</td>';
echo '<td>可能性</td>';
echo '<td>得分</td>';
echo '<td>加食材</td>';
echo '<td>分组</td>';
echo '</tr>';

$start = $page*$item_cnt;
$end = $start + $item_cnt;
for($i=$start; $i<$num && $i<$end; ++$i)
{
	$new_comb = $new_comb_list[$i];
	/*
	$new_comb = array();
	$cnt = count($comb);
	for($j=0;$j<$cnt;++$j)
	{
		$new_index = $material_dict_by_group_cnt - $comb[$j] + ($cnt - 1 - $j);
		$new_comb[] = $material_dict_by_group[$new_index];
	}
	for($j=0;$j<$selected_material_cnt;++$j)
	{
		$new_comb[] = $selected_materials[$j];
	}
	sort($new_comb);
	*/
	echo '<tr>';
	$new_comb_names = array();
	for($j=0;$j<count($new_comb);++$j)
	{
		echo '<td>';
		$s = $material_dict[$new_comb[$j]];
		echo $s;
		$new_comb_names[] = $s;
		echo '</td>';
	}
	echo '<td>';
	$index = match_food($new_comb, $food_menu);
	if($index >= 0)
	{
		$len = count($food_menu[$index]);
		echo $food_dict[$food_menu[$index][$len-2]];
	}
	else
	{
		$str = implode(",", $new_comb);
		$param_array = $_GET;
		$param_array['page'] = $page;
		$param_array['comb'] = $str;
		$s = http_build_query($param_array);
		echo '<a href="set_noresult.php?'.$s.'"> 标记noresult </a>';
		$str = implode("+", $new_comb_names);
		$param_array['comb_names'] = $str;
		$s = http_build_query($param_array);
		echo '<a href="add_result.php?'.$s.'"> 编辑 </a>';
		//echo '<a href="set_noresult.php?'.$params.'&page='.$page.'&comb='.$str.'"> 标记noresult </a>';
		//echo '<a href="add_result.php?'.$params.'&page='.$page.'&comb='.$str.'"> 标记noresult </a>';
	}
	echo '</td>';
	echo '<td>';
	//if($index == -1)
	{
		//$index = find_perhaps($new_comb, $success_food_menu);
		$perhaps_list = array();
		find_perhaps($new_comb, $success_food_menu, $perhaps_list);
		for($k=0;$k<count($perhaps_list);++$k)
		{
			$i1 = $perhaps_list[$k];
			$len = count($success_food_menu[$i1]);
			echo $food_dict[$success_food_menu[$i1][$len-2]].':';
			for($j = 1; $j < $len-2; ++$j)
			{
				echo $material_dict[$success_food_menu[$i1][$j]].',';
			}
			echo '<br>';
		}
	}

	echo '</td>';
	echo '<td>';
	//echo $index.'<br>';
	$no_score = true;
	if($index >=0)
	{
		$len = count($food_menu[$index]);
		if ($food_menu[$index][$len-1] != -1)
			$no_score = false;
	}
//	echo $no_score;
	if($no_score)
	{
		$str = implode(",", $new_comb);
		$param_array = $_GET;
		$param_array['page'] = $page;
		for($k=0;$k<10;++$k)
		{
			$param_array['score'] = $k;
			if($index >=0)
			{
				$param_array['menu_id'] = $food_menu[$index][0];
				$s = http_build_query($param_array);
				echo '<a href="update_score.php?'.$s.'">'.$k.'</a> ';
			}
			else 
			{
				$param_array['comb'] = $str;
				$s = http_build_query($param_array);
				echo '<a href="set_score.php?'.$s.'">'.$k.'</a> ';
			}
		}
	}
	else
	{
		echo $food_menu[$index][$len-1];
	}

	echo '</td>';
	echo '<td>';
	if($material_count<5)
	{
		$param_array = $_GET;
		$param_array['material_count'] = $material_count+1;
		for($j=0;$j<4;++$j)
		{
			$param_array['m'.($j+1)] = -1;
		}	
		for($j=0;$j<count($new_comb);++$j)
		{
			$param_array['m'.($j+1)] = $new_comb[$j];
		}
		$param_array['page'] = 0;
		$s = http_build_query($param_array);
		echo '<a href="food_menu.php?'.$s.'">加食材</a> ';		
	}
	echo '</td>';
	echo '<td>';
	$grp = 0;
	for($j=0;$j<count($new_comb);++$j)
	{
		$grp |= $material_group_dict[$new_comb[$j]];
	}
	echo decbin($grp);
	echo '</td>';
	echo '</tr>';	
}
echo '</table>';

if($page <= 0)
	echo ' 上一页 ';
else {
	$params = $_GET;
	$params['page'] = $page-1;
	$s = http_build_query($params);
	echo '<a href="food_menu.php?'.$s.'"> 上一页 </a>';
}
echo ' 共计'.ceil($num/$item_cnt).'页，当前第'.($page+1).'页 ';
if(($page+1)*$item_cnt >= $num)
	echo ' 下一页 ';
else {
	$params = $_GET;
	$params['page'] = $page+1;
	$s = http_build_query($params);
	echo '<a href="food_menu.php?'.$s.'"> 下一页 </a>';
}
echo '<p>';

//程序运行时间
$endtime = explode(' ',microtime());
$thistime = $endtime[0]+$endtime[1]-($starttime[0]+$starttime[1]);
$thistime = round($thistime,3);
echo "本网页执行耗时：".$thistime." 秒。";
?>
    </body>
</html>