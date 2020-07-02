<script type="text/javascript" src="common.js">
</script>
<?php
    //include_once "sg_common.h"
    function create_row(&$array)
    {
        echo '<tr>';
        foreach($array as $value)
        {
            echo '<td>';
            echo $value;
            echo '</td>';
        }
        echo '</tr>';        
    }

    function find_primary_key(&$db, $table_name)
    {
        $primary_key = '';
        $result = $db->query('SHOW FULL COLUMNS FROM '.$table_name);
        $num = $result->num_rows;
        for($i = 0; $i < $num; ++$i)
        {
            $row = $result->fetch_assoc();
            if ($row['Key'] == 'PRI')
            {
                $primary_key = $row['Field'];
                break;
            }
        }
        $result->close();
        return $primary_key;
    }

    function create_table(&$db, $sql, $table_name, $titles = NULL, $fixed_list = NULL, $modify_url = '', $delete_url = '')
    {
        $primary_key = find_primary_key($db, $table_name);
        //var_dump($sql);
        $result = $db->query($sql);
        $num = $result->num_rows;
        //var_dump($num);
        echo '<table border="1">';
        // title
        if(is_array($titles))
        {
            if($modify_url != '' || $delete_url != '')
            {
                $titles[] = '操作';
            }
            create_row($titles);
        }
        for($i = 0; $i < $num; ++$i)
        {
            $row = $result->fetch_assoc();
            if(is_array($fixed_list))
            {
                foreach($row as $key => &$value)
                {
                    if (array_key_exists($key, $fixed_list))
                    {
                        $arr = $fixed_list[$key];
                        if(!is_null($value))
                            $value = $arr[$value];
                    }
                }
            }            
            $val = '';
            if(array_key_exists($primary_key, $row))
            {
                $s_id = '&'.$primary_key.'='.$row[$primary_key];
                if($modify_url != '')
                {
                    if(strstr($modify_url, '?') == FALSE)
                        $modify_url .= '?';
                    $val .= ' <a href="'.$modify_url.$s_id.'">修改</a> ';
                }
                    
                if($delete_url != '')
                {
                    if(strstr($delete_url, '?') == FALSE)
                        $delete_url .= '?';
                    $param['param'] = $delete_url.$s_id;
                    $val .= ' <a href="sg_delete_confirm.php?'.http_build_query($param).'">删除</a> ';
                }
                //var_dump($val);
                if($val != '')
                    $row[] = $val;
            }
            //var_dump($row);
            create_row($row);
        }
        echo '</table>';
        $result->free();
    }

    function get_referenced_table(&$db, $table_name, $field_name, &$ref_table_name, &$ref_primary_key)
    {
        $sql = 'select referenced_table_name as "table", referenced_column_name as "field" from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where table_name="'.$table_name.'" and column_name = "'.$field_name.'"';
        $result = $db->query($sql);
        $num = $result->num_rows;
        if($num > 0)
        {
            $row = $result->fetch_assoc();
            $ref_table_name = $row['table'];
            $ref_primary_key = $row['field'];
            $result->close();
            return TRUE;
        }
        $result->close();
        return FALSE;
    }

    function get_dict_list(&$db, $table_name, $primary_key)
    {
        $sql = 'select * from '.$table_name.' order by '.$primary_key;
        $result = $db->query($sql);
        $num = $result->num_rows;
        $list = array();
        for($i = 0; $i < $num; ++$i)
        {
            $row = $result->fetch_assoc();
            $list[$row[$primary_key]] = $row['name'];
        }
        $result->close();
        return $list;
    }

    function gen_combox($field_name, $arr, $default, $allow_null = FALSE)
    {
        echo '<param id="'.$field_name.'_p" name="'.$field_name.'" value="'.$default.'">';
        echo '<select name="'.$field_name.'" id="'.$field_name.'_">';
        if($allow_null)
        {
            $selected = is_null($default) ? 'selected = "selected"' : '';
            echo '<option value="" '.$selected.'>-=空=-</option>';
        }

        foreach($arr as $key=>$value)
        {
            $selected = '';
            if($key == $default && !is_null($default))
                $selected = 'selected = "selected"';
            echo '<option value="'.$key.'" '.$selected.'>'.$value.'</option>';
        }
        echo '</select>';
    }

    function create_new_form(&$db, $table_name, $titles = NULL, $fixed_list = NULL, $default_list = NULL, $source = NULL)
    {
        echo '<form action="insert_record.php">';
        create_form($db, $table_name, $titles, $fixed_list, $default_list, $source);
        echo '</form>';
    }

    function get_record_by_id(&$db, $table_name, $primary_key, $key_val)
    {
        $sql = 'select * from '.$table_name.' where '.$primary_key.' = '.$key_val;
        $result = $db->query($sql);
        $num = $result->num_rows;
        if($num > 0)
            $row = $result->fetch_assoc();
        else
            $row = array();
        $result->close();  
        return $row;      
    }

    function create_update_form(&$db, $table_name, $primary_key, $key_val, $titles = NULL, $fixed_list = NULL, $source = NULL)
    {
        echo '<form action="update_record.php">';
        echo '<input type="hidden" name="primary_key" value="'.$primary_key.'"> ';
        echo '<input type="hidden" name="key_val" value="'.$key_val.'"> ';
        create_form($db, $table_name, $titles, $fixed_list, get_record_by_id($db, $table_name, $primary_key, $key_val), $source);
        echo '</form>';
    }

    function create_form(&$db, $table_name, $titles = NULL, $fixed_list = NULL, $default_list = NULL, $source = NULL)
    {
        echo '<input type="hidden" name="table_name" value="'.$table_name.'"> ';
        echo '<input type="hidden" name="source" value="'.$source.'"> ';
        $result = $db->query('SHOW FULL COLUMNS FROM '.$table_name);
        $num = $result->num_rows;
        for($i = 0; $i < $num; ++$i)
        {
            $row = $result->fetch_assoc();
            if ($row['Key'] == 'PRI' && $row['Extra'] == 'auto_increment')
            {
                //主键，自增长暂不处理
            }
            else 
            {
                $field_name = $row['Field'];
                // 缺省值
                $default_val = $row['Default'];
                if(is_array($default_list) && array_key_exists($field_name, $default_list))
                {
                    $default_val = $default_list[$field_name];
                    //var_dump($default_val);
                }

                $sName = is_array($titles) && array_key_exists($field_name, $titles) ? $titles[$field_name] : $field_name;
                echo $sName.': ';
                if($row['Key'] == 'MUL')
                {
                    //外键
                    if(get_referenced_table($db, $table_name, $field_name, $ref_table_name, $ref_primary_key))
                    {
                        $arr = get_dict_list($db, $ref_table_name, $ref_primary_key);
                        gen_combox($field_name, $arr, $default_val, $row['Null'] == 'YES');
                        
                    }
                }
                else
                {
                    //普通字段
                    if(is_array($fixed_list) && array_key_exists($field_name, $fixed_list))
                    {
                        $arr = $fixed_list[$field_name];
                        //var_dump($default_val);
                        gen_combox($field_name, $arr, $default_val, $row['Null'] == 'YES');
                    }
                    else
                    {
                        //字段类型
                        $length = strpos($row['Type'],'(');
                        if($length === false) {
                            $length = strlen($row['Type']);
                        }
                        $val_type = substr($row['Type'], 0, $length);

                        if($val_type == 'tinyint')
                        {
                            // bool
                            $default = $default_val != 0 ? 'checked="checked"' : '';
                            $checkbox_id = $field_name.'_';
                            echo '<input type="hidden" name="'.$field_name.'" id="'.$checkbox_id.'_val" value="'.$default_val.'">';
                            echo '<input type="checkbox" id="'.$checkbox_id.'" onclick="checkbox_check(\''.$checkbox_id.'\')" '.$default.'/>';
                        }
                        else
                        {
                            $input_type = "text";
                            $default = 'value="'.$default_val.'"';
                            if($val_type == 'int')
                            {
                                $input_type ="number";
                            }                            
                            echo '<input name="'.$field_name.'" id="'.$field_name.'_" type="'.$input_type.'" '.$default.'>';
                        }
                    }
                }
                echo '<br>';
            }
        }
        $result->free();  
        echo '<input type="submit" value="提交">';      
    }    

    function table_data_to_json($db, $sql, $var_name)
    {
        $result = $db->query($sql);
        $list = array();
        $num = $result->num_rows;
        for($i = 0; $i < $num; ++$i)        
        {
            $row = $result->fetch_assoc();
            $list[] = $row;
        }
        echo '<script type="text/javascript">';
        echo 'var '.$var_name.' = '.json_encode($list).';';
        echo '</script>';
        $result->free();
    }
?>