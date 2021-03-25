<?php
    include_once("../db/db_connect.php");
    include_once("../db/db_common.php");

    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql="SELECT *, (select count(*) from gfc_enum_items where gfc_enum_items.enum_id = gfc_enum.enum_id) as child_cnt FROM gfc_enum $where order by code";
    echo json_encode(get_records($db, $sql), JSON_NUMERIC_CHECK);
    $db->close();
?>