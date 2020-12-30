<?php
    include_once "db/db_connect.php";
    include_once "db/db_common.php";
    $fields = $_POST;
    $source = $_POST['source'];
    unset($fields['source']);
    insert_record($db, 'users', $fields);
    $db->close();
?>
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <title>注册</title>
    <link rel="stylesheet" href="yue412.css" />
</head>

<body>
    <div style="text-align: center;">
        注册成功！<a href=<?php echo '"'.$source.'"'; ?>>返回登录</a>
    </div>
</body>

</html>