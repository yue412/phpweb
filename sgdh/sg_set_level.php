<?php
    include("sg_header.php");
    include("sg_db_connect.php");
    include("sg_common.php")
?>
<?php
    $hero_id = $_GET['id'];
    $opr = $_GET['opr'];

    $flag = $opr > 0 ? '+' : '-';
    $sql = 'UPDATE `sg_hero2` SET `level` = `level` '.$flag.' 1 WHERE (`hero_id` = \''.$hero_id.'\')';
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