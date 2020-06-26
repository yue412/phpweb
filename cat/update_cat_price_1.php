<?php
$starttime = explode(' ',microtime());
//echo microtime();
?>
<html>
    <head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>
            cat
        </title>
    </head>
    <body>
<?php
$id = $_GET['id'];
$price = $_GET['price'];

@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}

$query = 'UPDATE `cat_price` SET `price` = \''.$price.'\' WHERE (`id` = \''.$id.'\');';
$db->query($query);
$db->close();
?>
<?php
 //程序运行时间
$endtime = explode(' ',microtime());
$thistime = $endtime[0]+$endtime[1]-($starttime[0]+$starttime[1]);
$thistime = round($thistime,3);
echo "本网页执行耗时：".$thistime." 秒。";
?>
<script language="javascript"type="text/javascript"> 
window.location.href="cat.php"; 
</script>
	</body>
</html>