<?php
    include_once("../db/db_connect.php");
    include_once("../db/db_common.php");

    unset($_GET["t"]);
    $where = generate_where_code($_GET);
    $sql="SELECT * FROM gfc_property order by code";
    $list = get_records($db, $sql);
    for($i = 0; $i < count($list); ++$i)        
    {
        $r = &$list[$i];
        //var_dump($r);
        $r['is_bq'] = $r['is_bq'] != '0';
        $r['is_spec'] = $r['is_spec'] != '0';
        $r['is_qty'] = $r['is_qty'] != '0';
        $r['is_collect'] = $r['is_collect'] != '0';
        if($r['pick_list'] == null)
            $r['pick_list'] = -1;
        //var_dump($r);
    }
    //var_dump($list);
    echo json_encode($list, JSON_NUMERIC_CHECK);
    $db->close();
?>