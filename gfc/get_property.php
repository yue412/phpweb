<?php
    include_once("../db/db_connect.php");
    include_once("../db/db_common.php");

    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql="SELECT * FROM gfc_property $where";
    echo json_encode(get_records($db, $sql), JSON_NUMERIC_CHECK);
    $db->close();
?>