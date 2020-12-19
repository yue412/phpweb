function GFCSchema(caption, field_name, input_type, picklist, col_class, name)
{
    this.caption = caption;
    this.field_name = field_name;
    this.input_type = input_type;
    this.class = col_class;
    this.name = name == null ? (input_type == "checkbox" ? "{{#"+field_name+"}}●{{/"+field_name+"}}{{^"+field_name+"}}○{{/"+field_name+"}}": "{{"+field_name+"}}") : name;
    this.init_pick_list(picklist);
}

GFCSchema.prototype.transform = function(item)
{
    if(this.picklist)
    {
        if(this.picklist_has_id)
        {
            for (let i = 0; i < this.picklist.length; i++) {
                const pair = this.picklist[i];
                var id = item[this.field_name];
                if(id == pair.id)
                {
                    item[this.field_name] = pair.caption;
                    break;
                }
            }
        }
    }
}

GFCSchema.prototype.init_pick_list = function(str)
{
    if(str)
    {
        var str_list = str.split("\n");
        var arr = [];
        str_list.forEach(item => {
            str_arr = item.split("=");
            if(str_arr.length > 1)
                arr.push({"id":parseInt(str_arr[0]), "caption":str_arr[1]});
            else
                arr.push({"caption":str_arr[0]});
        });
        this.picklist = arr;
        this.picklist_has_id = str.indexOf("=") != -1;
    }
}
