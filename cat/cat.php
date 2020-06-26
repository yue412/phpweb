
<!-- saved from url=(0038)http://www.yue412.top/cat/cat.html -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<title>cat</title>
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
	</head>

	<body>
		<?php
		@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
		if(mysqli_connect_errno())
		{
			echo 'Error: Could not connect to database. Please try again later.';
			exit;
		}
		$query = 'SELECT * FROM cat_price order by id';
		$result = $db->query($query);
		$num = $result->num_rows;
		$price_array = array();
		for($j=0;$j<$num;++$j)
		{
			$row = $result->fetch_assoc();
			$price_array[] = $row['price'];
		}	
		$result->free();
		$db->close();
		echo '<script type="text/javascript">';
		echo 'var g_price_str = ["'.implode('","',$price_array).'"];';
		echo '</script>';
		?>
		猫型号：<input type="number" id="catClass" value="9" size="5">
		<button onclick="calccat()">计算</button>
		<a href="append_cat.html">添加小猫</a>

		<table border="1">
			<tr>
				<td>序号</td>
				<td>价格</td>
				<td>个数</td>
				<td>新价格</td>
			</tr>
		<?php
			// main
			for($i = 0; $i < count($price_array); ++$i)
			{
				$param_array = array();
				$param_array['id'] = $i;
				$param_array['price'] = $price_array[$i];
    			$s = http_build_query($param_array);
				echo "<tr>";
				echo "<td>".($i+1)."</td>";				
				echo "<td>".$price_array[$i].' <a href="edit_cat_price.php?'.$s.'">编辑</a> </td>';
				echo "<td><p id=\"cat_cnt".$i."\"></td>";
				echo "<td><p id=\"cat_new_price".$i."\"></td>";
				echo "</tr>";
			}
		?>
		</table>
		<div id="demo"></div>
        <script type="text/javascript">
			var number_suffix = ['', 'k', 'm', 'b', 't'];
			function priceToStr(price)
			{
				var p = Math.abs(price);
				for(var i = 0; i< number_suffix.length; ++i)
				{
					t = Math.pow(10, i*3);
					if(p < t*1000)
					{
						pp = price / t;
						return pp.toPrecision(3)+number_suffix[i];
					}
				}
				return price;
			}
			function strToPrice(str)
			{
				if(str == "")
					return 0;
				var c = str.charAt(str.length-1);
				for(var i = 1; i< number_suffix.length; ++i)
				{
					if(c == number_suffix[i])
					{
						v = parseFloat(str.substr(0, str.length-1));
						return v * Math.pow(10, i*3);
					}
				}
				return parseFloat(str);
			}
			
			function calccat()
			{
				//var prices_list = document.getElementById("catPrice").value;
				//setCookie("cat_prices", prices_list, null);
				var cat_price_str = new Array();
                for(var i = 0; i < g_price_str.length; ++i)
                {
                    cat_price_str.push(g_price_str[i]);
                }

				var cat_class_cnt = cat_price_str.length; // 飞机种类
				//var cat_price = [4730, 10388, 24078, 46012, 103317, 272576, 844985];
				//var cat_price_inc = [0.07, 0.175, 0.175, 0.175, 0.175, 0.175, 0.175];
				//var total_price = 130000000;
				var cat_price_inc = new Array(cat_class_cnt); // 飞机价格增量
				var cat_cnt = new Array(cat_class_cnt); // 每种飞机个数
				var cat_factor = new Array(cat_class_cnt); // 每种飞机系数 1,2,4,8...
				var cat_price = new Array(cat_class_cnt); // 飞机价格
				var factor = 1;
				// 初始化
				for (var i = 0; i < cat_class_cnt; i++) {
					cat_cnt[i] = 0;
					cat_factor[i] = factor;
					factor *= 2;
					cat_price_inc[i] = i<2?0.07:0.175;
					cat_price[i] = strToPrice(cat_price_str[i]);
				}
				var new_cat_class = document.getElementById("catClass").value;
				var new_cat_factor = Math.pow(2,new_cat_class-1);
				var total = 0;
				var cat_list = new Array();
				var cat_p_list = new Array();
				while (new_cat_factor > 0){
					// who is cheap
					var min_index = 0;
					for (var i = 1; i < cat_class_cnt; i++) {
						if (cat_factor[i]>new_cat_factor)
							break;
						if (cat_price[i] / cat_factor[i] < cat_price[min_index] / cat_factor[min_index])
							min_index = i;
					}
					new_cat_factor -= cat_factor[min_index];
					cat_list.push(min_index);
					total += cat_price[min_index];
					cat_cnt[min_index] += 1;
					cat_price[min_index] = Math.round(cat_price[min_index] * (1 + cat_price_inc[min_index]));
					cat_p_list.push(cat_price.toString());
				}
				// output
				for (var i = 0; i < cat_class_cnt; i++) {
					document.getElementById("cat_cnt"+i).innerHTML = cat_cnt[i];
				}
				var s = "";
				for (var i = 0; i < cat_class_cnt; i++) {
					var ps = priceToStr(cat_price[i])
					document.getElementById("cat_new_price"+i).innerHTML = ps;
					s += ps + ",";
				}
				document.getElementById("demo").innerHTML = "total: " + priceToStr(total) + " <a href=\"update_cat_price.php?price="+s+"\">更新价格</a>";
			}

		</script>
		<!-- 猫价格：<input type="text" id="catPrice" size="100"><br>
		<script type="text/javascript">
			var old = getCookie("cat_prices");
			if(old=="")
				old = "7740, 10200, 85800, 73300, 142000, 269000, 388000, 1190000";
			document.getElementById("catPrice").value = old;
		</script> -->

		
	


</body></html>