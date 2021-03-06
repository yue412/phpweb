<?php
    include_once("db_connect.php");
    include_once("../common.php")
?>
<?php
    $table_name = $_GET['table_name'];
    $primary_key = $_GET['primary_key'];
    $key_val = $_GET['key_val'];
    $primary_key_list = explode("|", $primary_key);
    $key_val_list = explode("|", $key_val);
    $list = array();
    for ($i=0; $i < count($primary_key_list) && $i < count($key_val_list); $i++) { 
        $list[] = '(`'.$primary_key_list[$i].'` = \''.$key_val_list[$i].'\')';
    }
    $where = implode('and', $list);
    //var_dump($source);
    $fields = $_GET;
    // 删除表名
    array_remove_by_key($fields, 'table_name');
    array_remove_by_key($fields, 'primary_key');
    array_remove_by_key($fields, 'key_val');
    array_remove_by_key($fields, 't');
    // 将bool值转为1
    $list = array();
    foreach($fields as $key => $value)
    {
        if($value == '' || strcasecmp($value,'NULL') == 0)
            $value = 'NULL';
        else
            $value = '\''.$value.'\'';
        $list[] = '`'.$key.'` = '.urldecode($value);
    }
    $s_list = implode(',', $list);
    $sql = 'UPDATE `'.$table_name.'` SET '.$s_list.' WHERE '.$where;
    //var_dump($sql);
    if(!$db->query($sql))
    {
        echo $db->error;
    }
    $db->close();
?>