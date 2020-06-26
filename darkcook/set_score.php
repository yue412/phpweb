<?php
$comb = ($_GET['comb']);
$comb_array = explode(",", $comb);
$score = $_GET['score'];

@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}
$fields = '';
$values = '';
for($i=0;$i<count($comb_array);++$i)
{
	$fields = $fields.'`m'.($i+1).'`,';
	$values = $values.'\''.$comb_array[$i].'\',';
}
$sql = 'INSERT INTO food_menu ('.$fields.'`food`,`score`) VALUES ('.$values.'\'0\',\''.$score.'\')';
echo $sql;
$db->query($sql);
$db->close();
array_pop($_GET);
?>
<script language="javascript"type="text/javascript"> 
window.location.href=<?php echo '"food_menu.php?'.http_build_query($_GET).'"'; ?>; 
</script>