<?php
    function array_remove_by_key(&$arr, $key)
    {
        $keys = array_keys($arr);
        $index = array_search($key, $keys); 
        if($index !== FALSE){ 
            array_splice($arr, $index, 1); 
        }
    }

    function get_browser_param($name, $default)
    {
        global $_GET;
        $val = $default;
        if(is_param_exist($name))
        {
            $val = $_GET[$name];
        }    
        return $val;      
    }

    function is_param_exist($name)
    {
        if(is_array($_GET)&&count($_GET)>0)
        {
            if(isset($_GET[$name]))
                return true;
        }
        return false;
    }
?>