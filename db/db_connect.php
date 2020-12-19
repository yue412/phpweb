<?php
@ $db = new mysqli('rm-bp111u885e5up8o5t.mysql.rds.aliyuncs.com', 'rs2xq7qc15', 'Moon31415926', 'rs2xq7qc15');
if(mysqli_connect_errno())
{
    echo 'Error: Could not connect to database. Please try again later.';
    exit;
}
?>