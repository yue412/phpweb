var g_property_schema = [
    {"caption":"名称", "name":"{{name}}", "class":""},
    {"caption":"编码", "name":"{{code}}", "class":""},
    {"caption":"数据类型", "name":"{{value_type}}", "class":""},
    {"caption":"可用值列表", "name":"{{pick_list}}", "class":""},
    {"caption":"单位", "name":"{{unit_id}}", "class":""},
    {"caption":"必填", "name":"{{required}}", "class":""},
    {"caption":"说明", "name":"{{remark}}", "class":""},
    {"caption":"属性分类", "name":"{{classification}}", "class":""},
    {"caption":"操作", "name":"<span class=\"can-link\" onclick=\"add_element_type({{element_type_pid}})\">添加</span> | <span class=\"can-link\" onclick=\"add_element_type({{element_type_id}})\">添加下一级</span> | <span class=\"can-link\" onclick=\"edit_element_type({{element_type_id}})\">编辑</span> | 删除"}
];

function display_property_dict()
{
    var e =document.getElementById("main");
    e.innerHTML = "<div id='property_view'><div id='tree_panel'><form class='layui-form' action=''><div class='layui-inline'><select><option value='2'>建筑</option><option value='1' selected=''>结构</option></select></div></form><div id=\"element_type_tree\"></div></div><div id=\"property_dict\"><div class='button'>新增属性</div><div id='property'></div></div></div>";
    build_element_type_tree(document.getElementById("element_type_tree"));
/*    do_ajax("get_property.php?element_type_id="+element_type_id, function(text){
        var data = JSON.parse(text);
        initData(data);
    });
    */
}

function display_property(element_type_id)
{
    do_ajax("get_property.php?element_type_id="+element_type_id, function(text){
        var data = JSON.parse(text);
        var table = create_table(data, g_property_schema, "property_id");
        table.id = "tb_property";
        table.className = "display-table";
        var e = document.getElementById("property");
        e.innerHTML = "";
        e.appendChild(table);        
    });
}

function build_element_type_tree(parent_node)
{
    do_ajax("get_element_type.php?speciality_id=2&element_type_pid=-1", function(text){
        var data = JSON.parse(text);
        create_tree_node(data, parent_node);
    });
}

function create_tree_node(data, parent_node)
{
    var sHtml = "";
    for (let j = 0; j < data.length; j++) {
        const d = data[j];
        var s = "<div id=\"tree_{{element_type_id}}\"><div {{#child_cnt}}class=\"out-box\"{{/child_cnt}} {{^child_cnt}}class=\"out-box-hide\"{{/child_cnt}} onclick=\"expand_tree_node({{element_type_id}})\">{{#child_cnt}}<div id=\"collapse_{{element_type_id}}\" class=\"cross\"></div>{{/child_cnt}}</div><span id=\"code_{{element_type_id}}\" class=\"link_tree_node\" onclick=\"display_property({{element_type_id}})\">{{name}}</span></div>";
        Mustache.parse(s);
        sHtml += Mustache.render(s, d);
    }
    parent_node.innerHTML = sHtml;
}

function expand_tree_node(element_type_id)
{
    var e = document.getElementById("collapse_" + element_type_id);
    if(e == null)
        return;
    var expand = e.className == "cross";
    if(expand)
    {
        do_ajax("get_element_type.php?element_type_pid="+element_type_id, function(text){
            var data = JSON.parse(text);
            var tree_node = document.getElementById("tree_"+element_type_id);
            var div_node = document.createElement("div");
            div_node.id = "tree_child_"+element_type_id;
            div_node.style = "margin-left:17px";
            tree_node.appendChild(div_node);
            create_tree_node(data, div_node);
        });
        e.className = "line";
    }
    else
    {
        var tree_node = document.getElementById("tree_"+element_type_id);
        var node = tree_node.firstElementChild;
        while(node)
        {
            if(node.id == "tree_child_"+element_type_id)
            {
                tree_node.removeChild(node);
                break;
            }
            node = node.nextElementSibling;
        }
        e.className = "cross";
    }
}