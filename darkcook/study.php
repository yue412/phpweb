<?php
echo " Hello World! XML风格<br>";
//echo $a; // 已经不推荐了
echo 'a='.$_POST['a'].'<br>'; // .连接
echo 'b=';
echo $_POST['b'];
echo '<br>';

$c = $_POST['c'];
echo "c=$c<br>"; // 双引号处理
//echo "c=$d<br>"; // $d不存在会报错

//echo $HTTP_POST_VARS['c']; // 已经不推荐了
echo '<br>';
?>

<?php
/**/
echo '<br>';
echo date('Y F j H:i');
echo '<br>';
?>

<?php
echo <<<last
line1<br>
line2<br>
line3<br>
last;
?>

<?php
// -----------------------------------数组-----------------------------------
$books[0] = '时间简史';
$books[1] = '解忧杂货店';
$books[5] = 'Spring微服务实战';
for($i=0;$i<6;++$i)
{
		echo "$books[$i]<br>";
}
foreach($books as $book)
{
	  echo "$book<br>";
}

$prices = array('时间简史'=>31.10,'解忧杂货店'=>39.5,'Spring微服务实战'=>66.20);
foreach($prices as $key=>$value)
{
		echo "$key - $value 元<br>";
}
while($element = each($prices))
{
		echo $element['key'].' - '.$element['value'].' 元2<br>';
		echo "$element[0] - $element[1] 元3<br>";
}
reset($prices);//必须有这个，each貌似把数据都给清了
while(list($product, $price) = each($prices))
{
		echo "$product - $price 元4<br>";
}
//-------------数组是引用的吗---------------------
$test = $books;
$test[0] = '白夜行';
foreach($books as $book)
{
	  echo "$book<br>";
}
foreach($test as $book)
{
	  echo "$book<br>";
}
?>


<?
echo '简短风格';
?>
<script language='php'>
echo 'Script风格';
</script>
<%
echo 'ASP风格';
%>