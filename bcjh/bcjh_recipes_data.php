<?php
    include "db_connect.php";
?>
<?php
    $sql = "select * from bcjh_recipes";
    $result = $db->query($sql);
    $num = $result->num_rows;
    echo '[';
    for($i = 0; $i < $num; ++$i)
    {
        $row = $result->fetch_assoc();
        echo "{";
        foreach($row as $key => &$value)
        {
            echo '"'.$key.'":';
            echo $value;
            echo ',';
        }
        echo "},";
    }
    echo ']';
    $result->free();
?>
<?php
    $db->close();
?>