<?php
    function adjust_bool_value(&$value)
    {
        if($value=="true")
            $value=1;
        else if($value=="false")
            $value=0;
    }
    function insert_record($db, $table_name, &$fields)
    {
        $keys = array();
        $values = array();
        foreach($fields as $key => &$value)
        {
            if(!($value == '' || strtolower($value) == "null"))
            {
                adjust_bool_value($value);
                $keys[] = $key;
                $values[] = '\''.urldecode($value).'\'';
            }
        }
        //$keys = array_keys($fields);
        //$values = array_values($fields);
        $s_fields = '`'.implode('`, `', $keys).'`';
        $s_values = implode(', ', $values);
        $sql = 'INSERT INTO `'.$table_name.'` ('.$s_fields.') VALUES ('.$s_values.')';
        //echo $sql;
        if (!$db->query($sql))
        {
            exit($db->error);
        }
    }

    function get_records($db, $sql)
    {
        $result = $db->query($sql);
        $list = array();
        $num = $result->num_rows;
        for($i = 0; $i < $num; ++$i)        
        {
            $row = $result->fetch_assoc();
            $list[] = $row;
        }
        return $list;
    }

    function get_last_id($db)
    {
        $sql = "SELECT last_insert_id() as last_id";
        $result = $db->query($sql);
        $num = $result->num_rows;
        if($num > 0)
        {
            $row = $result->fetch_assoc();
            return $row["last_id"];
        }
        return -1;
    }    

    function generate_where_code($params)
    {
        $arr = array();
        foreach($params as $key => $value)
        {
            if($key == "_where")
                $arr[] = $value;
            elseif($value == -1)
                $arr[] = "isnull($key)";
            else
                $arr[] = $key."='".$value."'";
        }
    
        $where = implode(" and ", $arr);
        if($where != "")
            $where = "where ".$where;
        return $where;
    }
?>