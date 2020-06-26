<?php
$result_food = $_GET['result'];
$comb = ($_GET['comb']);
$comb_array = explode(",", $comb);
//$comb_array = explode(",", $comb);

@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}

$query = 'SELECT * FROM food_dict where name = \''.$result_food.'\'';
$result = $db->query($query);
$num = $result->num_rows;
$food_id = 0;
echo $num;
if($num>0)
{
	$row = $result->fetch_assoc();
	$food_id = $row['food_id'];
	$result->free();
}
else
{
	$query = 'SELECT max(food_id) as id FROM food_dict';
	$result = $db->query($query);
	$row = $result->fetch_assoc();
	$max_food_id = $row['id'];
	$result->free();
	$food_id = $max_food_id+1;
	
	$query = 'INSERT INTO `food_dict` (`food_id`, `name`) VALUES (\''.$food_id.'\', \''.$result_food.'\')';
	$db->query($query);

}

$fields = '';
$values = '';
$where = array();
for($i=0;$i<count($comb_array);++$i)
{
	$fields = $fields.'`m'.($i+1).'`,';
	$values = $values.'\''.$comb_array[$i].'\',';
	$where[] = 'm'.($i+1).'='.$comb_array[$i];
}
for ($i=count($comb_array); $i < 5 ; $i++) { 
	$where[] = 'isnull(m'.($i+1).')';
}
$where_str = implode(' and ', $where);
$query = 'SELECT * FROM food_menu where '.$where_str;
echo $query;
$result = $db->query($query);
$num = $result->num_rows;

if ($num == 0) {
	$sql = 'INSERT INTO food_menu ('.$fields.'`food`,`score`) VALUES ('.$values.'\''.$food_id.'\',\'10\')';
	//echo $sql;
	$db->query($sql);
}

$db->close();
array_pop($_GET);//result
array_pop($_GET);//comb_names
array_pop($_GET);//comb
?>

<script language="javascript"type="text/javascript"> 
window.location.href=<?php echo '"food_menu.php?'.http_build_query($_GET).'"'; ?>; 
</script>
