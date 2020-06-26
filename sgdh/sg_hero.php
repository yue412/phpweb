<?php
    include "sg_header.php";
    include "sg_db_connect.php";
    include "sg_table_common.php";
    include "sg_common.php";
?>
<a href=<?php echo '"sg_new_hero.php"'?>>新建</a>
<a href="sg_main2.html">返回</a>
<br>
<?php
    $sql = 'SELECT a.hero_id, 
        b.name,
        a.level, 
        a.weapon,
        a.clothes, 
        a.hat, 
        a.bracer,
        a.shoes, 
        a.other1,
        a.other2
        FROM sg_hero2 as a 
        inner join sg_hero_class as b on a.hero_class_id = b.hero_class_id
        order by convert(b.name using gbk)
        ';
    $modify_url = 'sg_modify_hero.php';
    $delete_url = 'sg_delete_record.php?'.http_build_query(array('table_name'=>'sg_hero2', 'source'=>'sg_hero.php'));
    $g_bool_str2 = array('','是');
    create_table($db, $sql, 
        'sg_hero2',
        array('id', '名称', '级别', '武器', '衣服', '帽子', '护手', '鞋', '装饰1', '装饰2'), 
        array('weapon'=>$g_bool_str2,
            'clothes'=>$g_bool_str2,
            'hat'=>$g_bool_str2,
            'bracer'=>$g_bool_str2,
            'shoes'=>$g_bool_str2,
            'other1'=>$g_bool_str2,
            'other2'=>$g_bool_str2
        ), 
        $modify_url, 
        $delete_url);
?>

<?php
    $db->close();
    include "sg_footer.php";
?>