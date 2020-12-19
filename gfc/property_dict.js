var g_cur_element_type_id = -1;

function display_property_dict()
{
    var e =document.getElementById("main");
    e.innerHTML = "<div id='property_view'><div id='tree_panel'><div id=\"element_type_tree\"></div></div><div id=\"property_dict\"><div id='property'></div></div></div>";
    g_cur_element_type_id = -1;
    build_element_type_tree(document.getElementById("element_type_tree"));
/*    do_ajax("get_property.php?element_type_id="+element_type_id, function(text){
        var data = JSON.parse(text);
        initData(data);
    });
    */
}
/*
function add_property()
{
    if(g_cur_element_type_id == -1)
        return;
    layer.open({
        type: 2,
        btn: ['确定','取消'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            var body = layer.getChildFrame('body', index);
            var doc = body[0].ownerDocument;
            var e = doc.getElementById("name");
            var sName = e.value.trim();
            if(sName == "")
            {
                layer.alert('名称不能为空');
                return;
            }
            e = doc.getElementById("code");
            var sCode = e.value.trim();
            if(sCode == "")
            {
                layer.alert('编码不能为空');
                return;
            }

            var arr = [];
            arr.push(build_param(doc, "code"));
            arr.push(build_param(doc, "name"));
            arr.push(build_param(doc, "value_type"));
            arr.push(build_param(doc, "pick_list"));
            arr.push(build_param(doc, "remark"));
            arr.push(build_param(doc, "classification"));
            if(doc.getElementById("unit_id")>0)
                arr.push(build_param(doc, "unit_id"));
            arr.push(build_checkbox_param(doc, "required"));
            arr.push("element_type_id="+g_cur_element_type_id);
            arr.push("table_name=gfc_property");
            // db添加
            do_ajax("insert_record.php?"+arr.join("&"), function(text){
                if(text != "")
                {
                    layer.alert(text);
                    return;
                }
                // ui添加
                
                do_ajax("get_property.php?element_type_id="+g_cur_element_type_id+"&name="+sName, function(text){
                    var table = document.getElementById("tb_property");
                    var data = JSON.parse(text);
                    if(data.length > 0)
                    {
                        insert_table_data(table, table.rows.length, data, g_property_schema);
                    }
                });
            });
            layer.close(index);
        },
        title: '新增属性',
        maxmin: false,
        area: ['480px', '320px'],
        content: 'edit_property.html'
    });
}
*/

function display_property(element_type_id)
{
    g_cur_element_type_id = element_type_id;
    do_ajax("../db/get_records.php?table_name=gfc_unit", function(text){
        var data = JSON.parse(text);
        var unit_arr = ["-1=<空>"];
        for (let i = 0; i < data.length; i++) {
            const unit_obj = data[i];
            unit_arr.push(unit_obj.unit_id+"="+unit_obj.name);
        }
        var schema = [
            new GFCSchema("名称", "name", "text"),
            new GFCSchema("编码", "code", "text"),
            new GFCSchema("数据类型", "value_type", "combox", "0=整数\n1=浮点数\n2=布尔型\n3=文本"),
            new GFCSchema("可用值列表", "pick_list", "textarea"),
            new GFCSchema("单位", "unit_id", "combox", unit_arr.join("\n")),
            new GFCSchema("必填", "required", "checkbox"),
            new GFCSchema("说明", "remark", "text"),
            new GFCSchema("属性分类", "classification", "text")
        ];
        var main = document.getElementById("property");
        main.innerHTML = "";
        var model = new GFCTableModel("gfc_property", "property_id", "element_type_id", element_type_id);
        var editor = new GFCEditor(model, schema, 480, 360);
        var table = new GFCTable(main, model, schema, editor);
        model.init();   
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