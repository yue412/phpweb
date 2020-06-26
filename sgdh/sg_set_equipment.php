<?php
    include("sg_header.php");
    include("sg_db_connect.php");
    include("sg_common.php")
?>
<?php
    $hero_id = $_GET['id'];
    $type = $_GET['type'];
    $val = $_GET['val'];
    //var_dump($source);
    $field_names = array('weapon', 'clothes', 'hat', 'bracer', 'shoes', 'other1', 'other2');

    $field = $field_names[$type];
    $value = $val == 0 ? 0 : 1;
    $sql = 'UPDATE `sg_hero2` SET `'.$field.'` = \''.$value.'\' WHERE (`hero_id` = \''.$hero_id.'\')';
    //var_dump($sql);
    $db->query($sql);

    // 跳转回去
?>
<script language="javascript"type="text/javascript"> 
    history.back(-1);
</script>
<?php
    $db->close();
    include("sg_footer.php");
?>