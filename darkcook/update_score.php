<?php
$menu_id = $_GET['menu_id'];
$score = $_GET['score'];

@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}
$sql = 'UPDATE `food_menu` SET `score` = \''.$score.'\' WHERE (`id` = \''.$menu_id.'\')';
echo $sql;
$db->query($sql);
$db->close();
array_pop($_GET);
?>
<script language="javascript"type="text/javascript"> 
window.location.href=<?php echo '"food_menu.php?'.http_build_query($_GET).'"'; ?>; 
</script>