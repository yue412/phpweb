<?php
$starttime = explode(' ',microtime());
//echo microtime();
$material_cnt = 2;
if(is_array($_GET)&&count($_GET)>0)
{
	if(isset($_GET['mt']))
		$material_cnt = $_GET['mt'];
}

$sCondition = '';
if($material_cnt == 2)
	$sCondition = 'isnull(c.name)';
else if($material_cnt == 3)
	$sCondition = '!isnull(c.name) and isnull(d.name)';
else
	$sCondition = '!isnull(d.name) and isnull(e.name)';
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
$query = 'SELECT a.name as n1, b.name as n2, c.name as n3, d.name as n4, score FROM food_menu inner join food_dict on food_menu.food = food_dict.food_id inner join material_dict as a on m1 = a.material_id inner join material_dict as b on m2 = b.material_id left join material_dict as c on m3= c.material_id left join material_dict as d on m4= d.material_id left join material_dict as e on m5= e.material_id where food = 0 and '.$sCondition.' order by score desc, m1, m2, m3, m4, m5';
//echo $query;
$result = $db->query($query);
$num = $result->num_rows;
for($i = 2; $i < 5; ++$i)
{
	if($i == $material_cnt)
		echo ' '.$i.' ';
	else
		echo ' <a href="food_formula_score.php?mt='.$i.'">'.$i.'</a> ';
}
echo '<table border="1">';
for($i = 0; $i < $num; ++$i)
{
    $row = $result->fetch_assoc();
    echo '<tr>';
    echo '<td>';
    echo $i+1;
    echo '</td>';
    echo '<td>';
    echo $row['n1'];
    echo '</td>';
    echo '<td>';
    echo $row['n2'];
    echo '</td>';
	if($material_cnt>2)
	{
		echo '<td>';
		echo $row['n3'];
		echo '</td>';
	}
	if($material_cnt>3)
	{
		echo '<td>';
		echo $row['n4'];
		echo '</td>';
	}
	echo '<td>';
	echo $row['score'];
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