<?php
    include_once("db_connect.php");
    include_once("common.php");
    include_once("db_common.php");

    $arr = $_GET;
    unset($arr["t"]);
    insert_record($db, "gfc_element_type", $arr);
    $db->close();
?>