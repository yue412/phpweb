<?php
    include_once("header.php");
    include_once("db_connect.php");
    include_once("common.php")
?>
<?php
    $table_name = $_GET['table_name'];
    $source = get_browser_param('source', '');
    $primary_key = $_GET['primary_key'];
    $key_val = $_GET['key_val'];
    //var_dump($source);
    $fields = $_GET;
    // 删除表名
    array_remove_by_key($fields, 'table_name');
    array_remove_by_key($fields, 'source');
    array_remove_by_key($fields, 'primary_key');
    array_remove_by_key($fields, 'key_val');
    array_remove_by_key($fields, 't');
    // 将bool值转为1
    $list = array();
    foreach($fields as $key => $value)
    {
        if($value == '')
            $value = 'NULL';
        else
            $value = '\''.$value.'\'';
        $list[] = '`'.$key.'` = '.$value;
    }
    $s_list = implode(',', $list);
    $sql = 'UPDATE `'.$table_name.'` SET '.$s_list.' WHERE (`'.$primary_key.'` = \''.$key_val.'\')';
    var_dump($sql);
    $db->query($sql);

    // 跳转回去
?>
<?php
    if($source != '')
    {
        echo '<script language="javascript"type="text/javascript">';
        echo "window.location.href=\"$source\";";
        echo '</script>';
    }
?>

<?php
    $db->close();
    include_once("footer.php");
?>