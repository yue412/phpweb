<?php
    include_once("db_connect.php");
    $sql="select * from gfc_speciality";
    $result = $db->query($sql);
    $list = array();
    $num = $result->num_rows;
    for($i = 0; $i < $num; ++$i)        
    {
        $row = $result->fetch_assoc();
        $list[] = $row;
    }
    echo json_encode($list);
    $db->close();
?>