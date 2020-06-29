<?php
    include_once "db_connect.php";
?>
<?php
    $sql = "select * from bcjh_recipes";
    $result = $db->query($sql);
    $num = $result->num_rows;
    $arr = array();
    for($i = 0; $i < $num; ++$i)
    {
        $row = $result->fetch_assoc();
        $arr[$i] = $row;
    }
    echo json_encode($arr);
    $result->free();
?>
<?php
    $db->close();
?>