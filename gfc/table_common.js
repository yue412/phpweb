function create_table(data, schema, primary_field_name)
{
    var table = document.createElement("table");
    //table.border = 1;
    // title
    var arr = [];
    for (let i = 0; i < schema.length; i++) {
        const item = schema[i];
        arr.push([item.caption, item.class]);
    };
    insert_row(table, 0, arr);
    // data
    insert_table_data(table, 1, data, schema, primary_field_name);

    return table;
}

function insert_row(table, index, row_data, id)
{
    var row = table.insertRow(index);
    if(id != null)
        row.id = "tr_"+id;
    for (let i = 0; i < row_data.length; i++) {
        var cell = row.insertCell(row.cells.length);
        cell.innerHTML = row_data[i][0];
        cell.className = row_data[i][1];
    }
}    

function insert_table_data(table, index, data, schema, primary_field_name)
{
    for (let j = 0; j < data.length; j++) {
        const d = data[j];
        var arr = [];
        for (let i = 0; i < schema.length; i++) {
            const item = schema[i];
            arr.push([Mustache.render(item.name, d), item.class]);
        }
        insert_row(table, index+j, arr, d[primary_field_name]);
    }
}