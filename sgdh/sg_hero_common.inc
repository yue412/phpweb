<?php
    table_data_to_json($db, 'select * from sg_hero_class', 'g_hero_class');
    table_data_to_json($db, 'SELECT * FROM sg_equipment_class order by equipment_type_id, level', 'g_equipment_class');
?>
<script type="text/javascript">
    function add_type_to_array(arr, hero_class, name)
    {
        if(hero_class[name] != null)
            arr.push(hero_class[name]);
    }
    function refresh_combobox(id, types)
    {
        var e = document.getElementById(id);
        e.options.length = 0;
        var option = document.createElement("option");
        option.text = "-=空=-";
        option.value = "";
        e.add(option,e.options[null]);        
        for (var i = 0; i <g_equipment_class.length; i++)
        {
            if(types.indexOf(g_equipment_class[i].equipment_type_id)!=-1)
            {
                var option = document.createElement("option");
                option.text = g_equipment_class[i].name;
                option.value = g_equipment_class[i].equipment_class_id;
                e.add(option,e.options[null]);
            }
        }
    }
    function hero_class_change()
    {
        var e = document.getElementById("hero_class_id_");
        var hero_class_id = e.value;
        var weapon_types = new Array();
        var clothes_types = new Array();
        var hat_types = new Array();
        var bracer_types = new Array();
        var shoes_types = new Array();
        var other1_types = new Array();
        var other2_types = new Array();
        for (var i = 0; i <g_hero_class.length; i++)
        {
            if (g_hero_class[i].hero_class_id == hero_class_id)
            {
                add_type_to_array(weapon_types, g_hero_class[i], 'weapon1_type');
                add_type_to_array(weapon_types, g_hero_class[i], 'weapon2_type');
                add_type_to_array(weapon_types, g_hero_class[i], 'weapon3_type');
                add_type_to_array(weapon_types, g_hero_class[i], 'weapon4_type');
                add_type_to_array(clothes_types, g_hero_class[i], 'clothes1_type');
                add_type_to_array(clothes_types, g_hero_class[i], 'clothes2_type');
                add_type_to_array(hat_types, g_hero_class[i], 'hat_type');
                add_type_to_array(bracer_types, g_hero_class[i], 'bracer_type');
                add_type_to_array(shoes_types, g_hero_class[i], 'shoes_type');
                add_type_to_array(other1_types, g_hero_class[i], 'other11_type');
                add_type_to_array(other1_types, g_hero_class[i], 'other12_type');
                add_type_to_array(other2_types, g_hero_class[i], 'other21_type');
                add_type_to_array(other2_types, g_hero_class[i], 'other22_type');
                break;
            }
        }
        // 刷新别的下拉框
        refresh_combobox('weapon_class_id_', weapon_types);
        refresh_combobox('clothes_class_id_', clothes_types);
        refresh_combobox('hat_class_id_', hat_types);
        refresh_combobox('bracer_class_id_', bracer_types);
        refresh_combobox('shoes_class_id_', shoes_types);
        refresh_combobox('other1_class_id_', other1_types);
        refresh_combobox('other2_class_id_', other2_types);
    }
</script>
<script type="text/javascript">
    var e_hero_class = document.getElementById("hero_class_id_");
    e_hero_class.onchange = hero_class_change;
    hero_class_change();
</script> 
