<?php
    include 'sg_header.php';
    include 'sg_db_connect.php';
    include 'sg_common.php';
?>
<?php
    $table_name = get_browser_param('table_name', 0);
    $source = get_browser_param('source', '');

    $fields = $_GET;
    // 删除表名
    array_remove_by_key($fields, 'table_name');
    array_remove_by_key($fields, 'source');

    if(count($fields) > 0)
    {
        foreach($fields as $key => $value)
        {
            $sql = 'delete from '.$table_name.' where '.$key.' = '.$value;
            //var_dump($sql);
            $db->query($sql);
            break;
        }
    }
    else
    {
        echo 'Error: not find primary key';
    }
?>

<script language="javascript"type="text/javascript"> 
window.location.href=<?php echo '"'.$source.'"'; ?>; 
</script>

<?php
    $db->close();
    include 'sg_footer.php';
?>