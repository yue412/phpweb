<?php
    include_once("db_connect.php");
    include_once("db_common.php");

    $table_name = $_GET['table_name'];
    
    unset($_GET["table_name"]);
    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql = "delete from $table_name $where";
    //echo $sql;

    //echo json_encode(get_records($db, $sql), JSON_NUMERIC_CHECK);
    //echo $sql;
    if(!$db->query($sql))
        echo $db->error;
    $db->close();
?>