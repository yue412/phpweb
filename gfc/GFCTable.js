var g_editor = null;

function GFCTable(owner, model, schema, editor)
{
    g_editor = editor;
    //this.owner = owner;
    this.model = model;
    var _schema = schema.concat([new GFCSchema("操作", "", null, null, null, 
        "<span class=\"can-link\" onclick='_add_record()'>添加</span> | <span class=\"can-link\" onclick='_edit_record({{"+model.primary_field_name+"}})'>编辑</span> | 删除")]);
    compile_schema(_schema);
    this.schema = _schema;
    this.table = create_table(this.transform_display_data(model.data), _schema, model.primary_field_name);
    this.table.className = "gfc-table";
    owner.appendChild(this.table);
    model.attach_observer(this);
}

GFCTable.prototype.init_data = function()
{
    var data = this.transform_display_data(this.model.data);
    var primary_field_name = this.model.primary_field_name;
    insert_table_data(this.table, 1, data, this.schema, primary_field_name);
} 

GFCTable.prototype.add = function(data)
{
    if(data.length > 0)
    {
        var row_index = this.table.rows.length;
        insert_table_data(this.table, row_index, this.transform_display_data(data), this.schema, this.model.primary_field_name);
    }
} 

GFCTable.prototype.update = function(index, item)
{
    var row = this.table.rows[index + 1];
    update_row_data(row, this.transform_display_item(item), this.schema);
} 

GFCTable.prototype.transform_display_item = function(item)
{
    var new_item = clone(item);
    for (let i = 0; i < this.schema.length; i++) {
        const schema_item = this.schema[i];
        schema_item.transform(new_item);
    }
    return new_item;
} 

GFCTable.prototype.transform_display_data = function(data)
{
    if(data == null)
        return null;
    var new_data = [];
    data.forEach(item => {
        new_data.push(this.transform_display_item(item));
    });
    return new_data;
}

function _add_record()
{
    if(g_editor)
        g_editor.add();
}

function _edit_record(id)
{
    if(g_editor)
        g_editor.edit(id);
}

function compile_schema(schema)
{
    for (let i = 0; i < schema.length; i++) {
        var item = schema[i];
        Mustache.parse(item.name);
    }
}