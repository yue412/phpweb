<?php
    include_once("db_connect.php");
    include_once("common.php");

    $arr = array();
    unset($_GET["t"]);
    foreach($_GET as $key => $value)
    {
        if($value == -1)
            $arr[] = "isnull($key)";
        else
            $arr[] = $key."='".$value."'";
    }

    $where = implode(" and ", $arr);
    if($where != "")
        $where = "where ".$where;

    $sql="select *, LENGTH(whole_code) - LENGTH(REPLACE(whole_code,'.','')) AS level from (select *, getCode(element_type_id) as whole_code, (SELECT count(*) FROM gfc_element_type as b where b.element_type_pid = a.element_type_id) as child_cnt from gfc_element_type as a $where) as c";
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