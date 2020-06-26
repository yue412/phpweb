<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    		<title>cat</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        
	</head>

	<body>
        <script type="text/javascript">
            function tpformsubmit(){
        		var s = document.getElementById("cat_price").value;
        		if (s != "")
		        {
			        url = 'update_cat_price_1.php?id='+<?php echo $_GET['id'];?>+'&price='+s;
        			window.location.href = url;
                }
	        }
        </script>	
        价格: <input type="text" id="cat_price" value="<?php echo $_GET['price'];?>"/>
        <input type="button" value="提交" onClick="tpformsubmit()">
    </body>
</html>