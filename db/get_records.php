<?php
    include_once("db_connect.php");
    include_once("db_common.php");

    $table_name = $_GET['table_name'];
    
    unset($_GET["table_name"]);
    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql = "select * from $table_name $where";

    echo json_encode(get_records($db, $sql), JSON_NUMERIC_CHECK);
    $db->close();
?>