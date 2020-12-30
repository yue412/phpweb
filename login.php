<?php
    include_once "db/db_connect.php";
    include_once "db/db_common.php";
    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql = "select * from users $where";
    $records = get_records($db, $sql);
    if(count($records)>0)
        echo $records[0]["users_id"];
    else
        echo "用户名和密码不匹配";
    $db->close();
?>