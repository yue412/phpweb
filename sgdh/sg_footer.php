<?php
//程序运行时间
$endtime = explode(' ',microtime());
$thistime = $endtime[0]+$endtime[1]-($starttime[0]+$starttime[1]);
$thistime = round($thistime,3);
?>
    <center> 本网页执行耗时：<?php echo $thistime;?> 秒。</center>
    </body>
</html>