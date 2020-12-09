<?php
    include_once("db_connect.php");
    include_once("common.php");

    $element_type_id = get_browser_param("element_type_id", -1);

    $sql="SELECT * FROM gfc_property where element_type_id = $element_type_id";
    //echo $sql;
    $result = $db->query($sql);
    $list = array();
    $num = $result->num_rows;
    for($i = 0; $i < $num; ++$i)        
    {
        $row = $result->fetch_assoc();
        $list[] = $row;
    }
    echo json_encode($list, JSON_NUMERIC_CHECK);
    $db->close();
?>