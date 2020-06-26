<?php
$comb_names = ($_GET['comb_names']);
//$comb_array = explode(",", $comb);

@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}

$query = 'select * from food_dict where food_id > 0 order by food_id';
$result = $db->query($query);
$num = $result->num_rows;
$food_dict = array();
for($i = 0; $i < $num; ++$i)
{
    $row = $result->fetch_assoc();
    $food_dict[] = $row['name'];
}
$result->free();
$db->close();
sort($food_dict);
?>
<html>
    <head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>
            黑暗料理王-添加合成结果
        </title>
		<?php
		echo '<script type="text/javascript">';
		echo 'var foods = new Array();';
		$num = count($food_dict);
		for($i = 0; $i < $num; ++$i)
		{
			echo 'foods['.$i.'] = "'.$food_dict[$i].'";';
		}			
		echo '</script>';
		?>
<script>
    function tpformsubmit(){
		//alert(document.getElementsByName("result")[0].value);
		var s = document.getElementById("result").value;
		//alert(s);
		if (s != "")
		{
			url = 'save_result.php?'+<?php 
			$s = http_build_query($_GET);
			echo '\''.$s.'\'';?>+'&result='+s;
			//alert(url);
			window.location.href = url;
		}
	}
	function filter_food(){
		var s = document.getElementById("result").value;
		var result = "";
		
		for(var i = 0; i< foods.length; ++i){
			if(foods[i].indexOf(s)>-1)
				result += foods[i] + "<br>";
		}
		document.getElementById('ref').innerHTML = result;
	}
</script>		

    </head>
    <body>
        <form action="" method="get">
			<?php
			$str = implode(",", $food_dict);
			echo '参考:'.$str.'<p>';
			echo $comb_names.'=';
			?>
		<!--input type="text" id="result" list="food_list" oninput="filter_food()"-->
		<input type="text" id="result" list="food_list">
		<?php
		echo '<datalist id="food_list">';
		$num = count($food_dict);
		for($i = 0; $i < $num; ++$i)
		{
			echo '<option label="'.$food_dict[$i].'" value="'.$food_dict[$i].'" />';
		}			
		echo '</datalist>';
		?>		
		<input type="button" value="提交" onClick="tpformsubmit()">
        </form>
		<div id="ref">
    </body>
</html>