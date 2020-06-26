<?php
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

    $sql = "select level from sg_hero2 where hero_id = ".$hero_id;
    $result = $db->query($sql);
    $num = $result->num_rows;
    if($num > 0)
    {
        $row = $result->fetch_assoc();
        echo $row['level'];
    }
    $result->free();
?>
<?php
    $db->close();
?>