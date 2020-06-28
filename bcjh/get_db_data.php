<?php
    include "db_connect.php";
    include "common.php";
    $table_name = get_browser_param('name', '');
    $order_field = get_browser_param('order_field', '');
?>
<?php
    $sql = "select * from $table_name order by $order_field";
    $result = $db->query($sql);
    $num = $result->num_rows;
    $arr = array();
    for($i = 0; $i < $num; ++$i)
    {
        $row = $result->fetch_assoc();
        $arr[] = $row;
    }
    echo json_encode($arr);
    $result->free();
?>
<?php
    $db->close();
?>