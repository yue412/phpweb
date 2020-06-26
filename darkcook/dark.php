<html>
    <head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>
            黑暗料理王
        </title>
    </head>
    <body>
        <form action="food_menu.php" method="get">
        材料数量:
		<select name="material_count">
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
		</select>
<?php
@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}
$query = 'select * from material_dict order by material_id';
$result = $db->query($query);
$num = $result->num_rows;
$str = '<option value="-1">无</option>';
for($i = 0; $i < $num; ++$i)
{
    $row = $result->fetch_assoc();
    $str = $str.'<option value="'.$row['material_id'].'">'.$row['name'].'</option>';
}
$result->free();

for($i = 0; $i < 4; ++$i)
{
	echo '材料'.($i+1).':';
	echo '<select name="m'.($i+1).'">'.$str.'</select>';
}
echo '<br>';
echo '分组：';
$query = 'select * from material_group order by group_id';
$result = $db->query($query);
$num = $result->num_rows;
for($i = 0; $i < $num; ++$i)
{
    $row = $result->fetch_assoc();
    echo '<input type="checkbox" name = "c'.($i+1).'">'.$row['name'];
}
$result->free();
echo '<br>';
$db->close();
?>		
		
		<input type="submit" value="提交">
        </form>
        <a href="material_dict.php">材料字典</a>
        <a href="food_dict.php">料理字典</a>
        <a href="food_formula.php">料理公式</a>
        <a href="food_formula2.php">料理公式2</a>
		<a href="food_formula_score.php">料理分数</a>
    </body>
</html>