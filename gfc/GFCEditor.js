function GFCEditor(model, schema, width, height)
{
    this.model = model;
    this.schema = schema;
    this.width = width;
    this.height = height;
}

GFCEditor.prototype.add = function()
{
    var that = this;
    var url = "edit_record.html?schema="+encodeURIComponent(JSON.stringify(this.schema));
    layer.open({
        type: 2,
        btn: ['确定','取消'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            var body = layer.getChildFrame('body', index);
            var doc = body[0].ownerDocument;
            var model = that.model;
            // 校验 todo
            var arr = that.get_edit_values(doc);
            arr.push("table_name="+model.table_name);
            if(model.filter_field_name)
                arr.push(model.filter_field_name+"="+model.filter_value)
            arr.push()
            // db添加
            do_ajax(encodeURI("../db/insert_record.php?"+arr.join("&")), function(text){
                if(isNaN(text))
                {
                    layer.alert(text);
                    return;
                }
                var id = parseInt(text);
                // ui添加
                do_ajax("../db/get_records.php?" + build_url_params([["table_name", model.table_name],[model.primary_field_name, id]]), function(text){
                    model.add(JSON.parse(text));
                });
            });
            layer.close(index);
        },
        title: '新增',
        maxmin: false,
        area: [this.width + 'px', this.height + 'px'],
        content: url
    });
}

GFCEditor.prototype.edit = function(id)
{
    var model = this.model;
    var that = this;
    var obj = model.find_item(id);
    if(obj == null)
        return;
    var arr = this.get_default_values(obj);
    var url = encodeURI("edit_record.html?"+arr.join("&"))+"&schema="+encodeURIComponent(JSON.stringify(that.schema));
    layer.open({
        type: 2,
        btn: ['确定','取消'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            var body = layer.getChildFrame('body', index);
            var doc = body[0].ownerDocument;
            // 校验 todo
            var arr = that.get_edit_values(doc);
            arr.push("table_name="+model.table_name);
            arr.push("primary_key="+model.primary_field_name);
            arr.push("key_val="+id);
            // db添加
            do_ajax(encodeURI("../db/update_record.php?"+arr.join("&")), function(text){
                if(text != "")
                {
                    layer.alert(text);
                    return;
                }
                // ui添加
                do_ajax("../db/get_records.php?"+build_url_params([["table_name", model.table_name],[model.primary_field_name, id]]), function(text){
                    model.update(JSON.parse(text));
                });
            });
            layer.close(index);
        },
        title: '编辑',
        maxmin: false,
        area: [this.width + 'px', this.height + 'px'],
        content: url
    });
}

GFCEditor.prototype.get_edit_values = function(doc)
{
    var arr = [];
    for (let i = 0; i < this.schema.length; i++) {
        const item = this.schema[i];
        if(item.input_type)
        {
            if(item.input_type == "checkbox")
                arr.push(build_checkbox_param(doc, item.field_name));
            else if(item.input_type == "combox")
                arr.push(build_combox_param(doc, item.field_name));
            else
                arr.push(build_param(doc, item.field_name));
        }
    }
    return arr;
}

GFCEditor.prototype.get_default_values = function(obj)
{
    var arr = [];
    for (let i = 0; i < this.schema.length; i++) {
        const item = this.schema[i];
        arr.push(item.field_name + "=" + obj[item.field_name]);
    }
    return arr;
}