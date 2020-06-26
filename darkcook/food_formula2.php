<?php
$starttime = explode(' ',microtime());
//echo microtime();
?>
<html>
    <head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>
            黑暗料理王-料理公式
        </title>
    </head>
    <body>
<?php
@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}
$query = 'select * from (SELECT food_dict.name, food, CONCAT_WS(\'=\', food_dict.name, CONCAT_WS(\'+\', a.name, b.name, c.name, d.name, e.name)) as result, isnull(m1)+isnull(m2)+isnull(m3)+isnull(m4)+isnull(m5) as flag, m1, m2, m3, m4, m5 FROM food_menu inner join food_dict on food_menu.food = food_dict.food_id inner join material_dict as a on m1 = a.material_id inner join material_dict as b on m2 = b.material_id left join material_dict as c on m3= c.material_id left join material_dict as d on m4= d.material_id left join material_dict as e on m5= e.material_id where food <> 0 and isnull(m5) order by food, flag DESC, m1, m2, m3, m4, m5) as a group by a.name order by a.food';
$result = $db->query($query);
$num = $result->num_rows;
echo '<table border="1">';
for($i = 0; $i < $num; ++$i)
{
    $row = $result->fetch_assoc();
    echo '<tr>';
    echo '<td>';
    echo $i+1;
    echo '</td>';
    echo '<td>';
    echo $row['result'];
    echo '</td>';
    echo '<td>';
    $material_count = 5 - $row['flag'];
    $param_array = array();
    $param_array['material_count'] = $material_count+1;
    for($j=0;$j<4;++$j)
    {
        $param_array['m'.($j+1)] = -1;
    }	
    for($j=0;$j<$material_count;++$j)
    {
        $field_name = 'm'.($j+1); 
        $param_array[$field_name] = $row[$field_name];
    }
    $param_array['page'] = 0;
    $s = http_build_query($param_array);
    echo '<a href="food_menu.php?'.$s.'">加食材</a> ';
    echo '</td>';
    echo '</tr>';
}
echo '</table>';
$result->free();
$db->close();
?>
<?php
 //程序运行时间
$endtime = explode(' ',microtime());
$thistime = $endtime[0]+$endtime[1]-($starttime[0]+$starttime[1]);
$thistime = round($thistime,3);
echo "本网页执行耗时：".$thistime." 秒。";
?>
	</body>
</html>