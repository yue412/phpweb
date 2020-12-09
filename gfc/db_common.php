<?php
    function insert_record($db, $table_name, &$fields)
    {
        foreach($fields as $key => &$value)
        {
            if($value == '')
                $value = 'NULL';
            else
                $value = '\''.$value.'\'';
        }
        $keys = array_keys($fields);
        $values = array_values($fields);
        $s_fields = '`'.implode('`, `', $keys).'`';
        $s_values = implode(', ', $values);
        $sql = 'INSERT INTO `'.$table_name.'` ('.$s_fields.') VALUES ('.$s_values.')';
        //var_dump($sql);
        if ($db->query($sql) === true)
        {
            exit($db->error);
        }
    }
?>