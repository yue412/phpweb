<?php
    include_once("../db/db_connect.php");
    include_once("../db/db_common.php");

    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql="select *, LENGTH(whole_code) - LENGTH(REPLACE(whole_code,'.','')) AS level from (select *, getCode(element_type_id) as whole_code, (SELECT count(*) FROM gfc_element_type as b where b.element_type_pid = a.element_type_id) as child_cnt from gfc_element_type as a $where) as c";
    echo json_encode(get_records($db, $sql), JSON_NUMERIC_CHECK);
    $db->close();
?>