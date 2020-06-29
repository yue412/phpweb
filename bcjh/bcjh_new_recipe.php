<?php
    include_once 'header.php';
    include_once 'db_connect.php';
    include_once 'table_common.php';
    include_once 'common.php';
?>
<?php
    create_new_form($db, 'bcjh_recipes', 
        array('id'=>'名称', 'is_mastery'=>'是否熟练'), 
        null, 
        null, 
        null);
?>
<?php
    $db->close();
    include_once 'footer.php';
?>