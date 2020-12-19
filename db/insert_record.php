<?php
    include("db_connect.php");
    include("../common.php");
    include("db_common.php");
?>
<?php
    $table_name = $_GET['table_name'];
    //var_dump($source);
    $fields = $_GET;
    // 删除表名
    array_remove_by_key($fields, 'table_name');
    array_remove_by_key($fields, 't');

    insert_record($db, $table_name, $fields);
    echo get_last_id($db);
?>
<?php
    $db->close();
?>