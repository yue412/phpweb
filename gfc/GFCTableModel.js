function GFCTableModel(table_name, primary_field_name, filter_field_name, filter_value, filter_condition)
{
    this.table_name = table_name;
    this.primary_field_name = primary_field_name;
    this.filter_field_name = filter_field_name;
    this.filter_value = filter_value;
    this.filter_condition = filter_condition;
    this.observer_list = [];
    this.data = null;
}

GFCTableModel.prototype.init = function()
{
    var params = [["table_name", this.table_name]];
    if(this.filter_condition)
        params.push(["_where", this.filter_condition]);
    else if (this.filter_field_name && this.filter_value) {
        params.push([this.filter_field_name, this.filter_value]);
    }

    var model = this;
    do_ajax("../db/get_records.php?"+build_url_params(params), function(text){
        model.data = JSON.parse(text);
        model.observer_list.forEach(function(observer){
            observer.init_data();
        });
    });
}

GFCTableModel.prototype.attach_observer = function(table)
{
    this.observer_list.push(table);
}

GFCTableModel.prototype.index_by_id = function(id)
{
    if(this.data == null)
        return -1;
    for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i];
        if(item[this.primary_field_name] == id)
        {
            return i;
        }
    }
    return -1;
}

GFCTableModel.prototype.find_item = function(id)
{
    var index = this.index_by_id(id);
    if(index == -1)
        return null;
    else
        return this.data[index];
}

GFCTableModel.prototype.add = function(data)
{
    this.data.push.apply(this.data, data);
    this.observer_list.forEach(function(observer){
        observer.add(data);
    });
}

GFCTableModel.prototype.update = function(data)
{
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        var index = this.index_by_id(item[this.primary_field_name]);
        this.data[index] = item;
        this.observer_list.forEach(function(observer){
            observer.update(index, item);
        });
    }
}