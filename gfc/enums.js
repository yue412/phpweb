Vue.component('gfc-enums', {
    // 在 JavaScript 中是 camelCase 的
    data: function () {
        return {
            enums: [],
            edit_type: {
                code: 0,
                name: '',
            },
            dialogVisible: false,
            handleConfirm: function () { },
        };
    },
    created: function () {
    },
    mounted() {
        this.load_data();
    },
    methods: {
        load_data() {
            var _this = this;
            do_ajax("get_enums.php", function (text) {
                _this.enums = JSON.parse(text);
                for (let i = 0; i < _this.enums.length; i++) {
                    const e = _this.enums[i];
                    _this.init_enum(e);
                }
            });
        },
        load_child(row, treeNode, resolve) {
            var _this = this;
            do_ajax("../db/get_records.php?table_name=gfc_enum_items&enum_id=" + row.enum_id, function (text) {
                var data = JSON.parse(text);
                row.children = data;

                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    _this.init_item(item, row);
                }

                resolve(data);
            });
        },
        init_item(item, e) {
            item.d_code = item.code;
            item.id = item.enum_id * 1000 + item.code;
            if (e)
                item.parent = e;
        },
        init_enum(e) {
            e.id = e.enum_id;
            e.d_code = "B." + e.code;
        },
        get_max_code() {
            var r = 0;
            for (let i = 0; i < this.enums.length; i++) {
                const e = this.enums[i];
                r = Math.max(e.code, r);
            }
            return r;
        },
        add() {
            var _this = this;
            //var suggest_code = this.get_suggest_code(parent);
            this.edit_type = {
                code: this.get_max_code() + 1,
                name: '',
            };
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_type);
                arr.push(['table_name', 'gfc_enum']);
                do_ajax(encodeURI("../db/insert_record.php?" + build_url_params(arr)), function (text) {
                    if (isNaN(text)) {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    var id = parseInt(text);
                    var new_enum = { enum_id: id, code: _this.edit_type.code, name: _this.edit_type.name, child_cnt: 0 };
                    _this.init_enum(new_enum);
                    _this.enums.push(new_enum);
                    _this.dialogVisible = false;
                });
            };
            this.dialogVisible = true;
        },
        add_child(parent) {
            var _this = this;
            //var suggest_code = this.get_suggest_code(parent);
            this.edit_type = {
                code: 0,
                name: '',
            };
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_type);
                arr.push(['table_name', 'gfc_enum_items']);
                arr.push(['enum_id', parent.enum_id]);
                do_ajax(encodeURI("../db/insert_record.php?" + build_url_params(arr)), function (text) {
                    if (isNaN(text)) {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    var id = parseInt(text);
                    var item = { enum_id: parent.enum_id, code: _this.edit_type.code, name: _this.edit_type.name };
                    _this.init_item(item, parent);
                    ++parent.child_cnt;
                    if (parent.children)
                        parent.children.push(item);
                    _this.dialogVisible = false;
                });
            };
            this.dialogVisible = true;
        },
        edit(obj) {
            for (const key in this.edit_type) {
                this.edit_type[key] = obj[key];
            }
            var _this = this;
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_type);
                arr.push(['table_name', 'gfc_enum']);
                arr.push(['primary_key', 'enum_id']);
                arr.push(['key_val', obj.enum_id]);
                do_ajax(encodeURI("../db/update_record.php?" + build_url_params(arr)), function (text) {
                    if (text != '') {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    for (const key in _this.edit_type) {
                        obj[key] = _this.edit_type[key];
                    }
                    _this.init_enum(obj);
                    _this.dialogVisible = false;
                });
            };
            this.dialogVisible = true;
        },
        edit_item(obj) {
            for (const key in this.edit_type) {
                this.edit_type[key] = obj[key];
            }
            var _this = this;
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_type);
                arr.push(['table_name', 'gfc_enum_items']);
                arr.push(['primary_key', 'enum_id|code']);
                arr.push(['key_val', obj.enum_id + '|' + obj.code]);
                do_ajax(encodeURI("../db/update_record.php?" + build_url_params(arr)), function (text) {
                    if (text != '') {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    for (const key in _this.edit_type) {
                        obj[key] = _this.edit_type[key];
                    }
                    _this.init_item(obj);
                    _this.dialogVisible = false;
                });
            };
            this.dialogVisible = true;
        },
        del(obj) {
            var _this = this;
            if (obj) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        do_ajax("../db/del_record.php?table_name=gfc_enum&enum_id=" + obj.enum_id, function (text) {
                            if (text != "") {
                                _this.$message({
                                    message: text,
                                    type: 'error'
                                })
                                return;
                            }
                            var i = _this.enums.indexOf(obj);
                            _this.enums.splice(i, 1);
                        });
                    })
                    .catch(_ => { });
            }
        },
        del_item(obj) {
            var _this = this;
            if (obj) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        do_ajax("../db/del_record.php?table_name=gfc_enum_items&enum_id=" + obj.enum_id + "&code=" + obj.code, function (text) {
                            if (text != "") {
                                _this.$message({
                                    message: text,
                                    type: 'error'
                                })
                                return;
                            }
                            var i = obj.parent.children.indexOf(obj);
                            obj.parent.children.splice(i, 1);
                        });
                    })
                    .catch(_ => { });
            }
        },
    },
    template: '<div>\
        <el-button type="primary" @click="add">添加枚举</el-button>\
        <el-table :data="enums" style="width: 100%;margin-left: 0%;" row-key="id" lazy :load="load_child"\
            :tree-props="{children: \'children\', hasChildren: \'child_cnt\'}">\
            <el-table-column prop="d_code" label="编码" width="250">\
            </el-table-column>\
            <el-table-column prop="name" label="名称">\
            </el-table-column>\
            <el-table-column fixed="right" label="操作" width="400">\
            <template slot-scope="scope">\
                <div v-if="\'child_cnt\' in scope.row">\
                    <el-button @click="add" type="text">添加枚举</el-button>\
                    | <el-button @click="add_child(scope.row)" type="text">添加枚举值</el-button>\
                    | <el-button @click="edit(scope.row)" type="text">编辑</el-button>\
                    | <el-button @click="del(scope.row)" type="text">删除</el-button>\
                </div>\
                <div v-else>\
                    <el-button @click="add_child(scope.row.parent)" type="text">添加枚举值</el-button>\
                    | <el-button @click="edit_item(scope.row)" type="text">编辑</el-button>\
                    | <el-button @click="del_item(scope.row)" type="text">删除</el-button>\
                </div>\
            </template>\
            </el-table-column>\
        </el-table>\
        <el-dialog title="编辑" :visible.sync="dialogVisible">\
            <el-form :model="edit_type" label-width="120px">\
                <el-form-item label="编码">\
                    <el-input-number v-model="edit_type.code"></el-input-number>\
                </el-form-item>\
                <el-form-item label="名称">\
                    <el-input v-model="edit_type.name"></el-input>\
                </el-form-item>\
            </el-form>\
            <div slot="footer" class="dialog-footer">\
                <el-button @click="dialogVisible = false">取 消</el-button>\
                <el-button type="primary" @click="handleConfirm">确 定</el-button>\
            </div>\
        </el-dialog>\
    </div>',
})