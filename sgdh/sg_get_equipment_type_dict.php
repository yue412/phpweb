<?php
    //include "sg_header.php";
    include "sg_db_connect.php";  
    include "sg_common.php";  
?>
<?php
    $result = $db->query('
        SELECT * FROM sg_equipment_type_dict
    ');
    $list = array();
    $num = $result->num_rows;
    for($i = 0; $i < $num; ++$i)        
    {
        $row = $result->fetch_assoc();
        $record = array();
        $record['id'] = $row['equipment_type_id'];
        $record['name'] = $row['name'];
        $list[] = $record;
    }
    echo json_encode($list);
    $result->free();
?>
<?php
    $db->close();
    //include "sg_footer.php";
?>
