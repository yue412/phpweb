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
$query = 'select * from food_dict order by food_id';
$result = $db->query($query);
$num = $result->num_rows;
echo '<table border="1">';
for($i = 0; $i < $num; ++$i)
{
    $row = $result->fetch_assoc();
    echo '<tr>';
    echo '<td>';
    echo $row['food_id'];
    echo '</td>';
    echo '<td>';
    echo $row['name'];
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