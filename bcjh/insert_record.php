<?php
    include_once("header.php");
    include_once("db_connect.php");
    include_once("common.php");
?>
<?php
    $table_name = $_GET['table_name'];
    $source = $_GET['source'];
    //var_dump($source);
    $fields = $_GET;
    // 删除表名
    array_remove_by_key($fields, 'table_name');
    array_remove_by_key($fields, 'source');
    
    foreach($fields as $key => &$value)
    {
        if($value == '')
            $value = 'NULL';
        else
            $value = '\''.$value.'\'';
    }
    $keys = array_keys($fields);
    $values = array_values($fields);
    $s_fields = '`'.implode('`, `', $keys).'`';
    $s_values = implode(', ', $values);
    $sql = 'INSERT INTO `'.$table_name.'` ('.$s_fields.') VALUES ('.$s_values.')';
    //var_dump($sql);
    $db->query($sql);

    // 跳转回去
?>
<script language="javascript"type="text/javascript"> 
window.location.href=<?php echo '"'.$source.'"'; ?>; 
</script>
<?php
    $db->close();
    include_once("footer.php");
?>