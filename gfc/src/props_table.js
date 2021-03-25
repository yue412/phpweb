Vue.component('gfc-props-table', {
    // 在 JavaScript 中是 camelCase 的
    props: ['element-type-id'],
    data: function () {
        return {
            type_props: [],
            edit_prop: {
                code: '',
                name: '',
                unit: '',
                data_type: 0,
                pick_list: -1,
                default: '',
                is_spec: false,
                is_bq: false,
                is_qty: false,
                is_collect: false,
                source: 0,
                classification: 0,
            },
            dialogVisible: false,
            handleConfirm: function () { },
            bool_field_width: 80,
            data_types: ["整数", "浮点数", "布尔型", "文本"],
            enum_list: [],
            classification_list: ['普通属性', '几何属性', '材料属性', '技术属性'],
            source_list: ['设计', '造价', '施工'],
            property_dict: null,
            adding: false,
        };
    },
    created: function () {
    },
    mounted() {
        //this.load_data();
        //this.get_enum_list();
    },
    watch: {
        elementTypeId: {
            deep: false,
            immediate: true,
            handler: function (val, oldVal) {
                if (val != oldVal) {
                    this.load_data();
                }
            }
        },
        'edit_prop.code': {
            handler: function (val, oldVal) {
                if(this.adding && val != oldVal)
                {
                    var prop = this.get_default_prop(val);
                    if(prop)
                    {
                        for (const key in this.edit_prop) {
                            if(key == 'code')
                                continue;
                            this.edit_prop[key] = prop[key];
                        }
                    }
                }
            }
        },
    },
    methods: {
        load_data() {
            var _this = this;
            do_ajax("get_property.php?element_type_id=" + this.elementTypeId, function (text) {
                _this.type_props = [];
                var data = JSON.parse(text);
                var group_nodes = [];
                for (let i = 1; i < _this.classification_list.length; i++) {
                    const item = _this.classification_list[i];
                    group_nodes.push({ property_id: -i, name: item, classification: i, children: [] });
                }
                for (let i = 0; i < data.length; i++) {
                    const prop = data[i];
                    if (prop.classification == 0)
                        _this.type_props.push(prop);
                    else if (prop.classification <= group_nodes.length)
                        group_nodes[prop.classification - 1].children.push(prop);
                }
                group_nodes.forEach(node => {
                    if (node.children.length > 0) {
                        _this.type_props.push(node);
                    }
                });
                do_ajax("get_property_dict.php", function (text) {
                    _this.property_dict = JSON.parse(text);
                });
            });
        },
        get_enum_list(func) {
            var _this = this;
            do_ajax("get_enums.php", function (text) {
                _this.enum_list = [{ enum_id: -1, name: '空', code: '' }];
                var data = JSON.parse(text);
                _this.enum_list.push.apply(_this.enum_list, data);
                if (func)
                    func();
            });
        },
        get_default_prop(code) {
            for (let i = 0; i < this.property_dict.length; i++) {
                const p = this.property_dict[i];
                if(p.code == code)
                    return p;
            }
            return null;
        },
        add(prop) {
            var _this = this;
            this.edit_prop = {
                code: '',
                name: '',
                unit: '',
                data_type: 0,
                pick_list: -1,
                default: '',
                is_spec: false,
                is_bq: false,
                is_qty: false,
                is_collect: false,
                source: 0,
                classification: prop ? prop.classification : 0,
            };
            this.adding = true;
            this.handleConfirm = function () {
                if (_this.edit_prop.pick_list == -1)
                    _this.edit_prop.pick_list = null;
                var arr = obj_to_array(_this.edit_prop);
                arr.push(['table_name', 'gfc_property']);
                arr.push(['element_type_id', _this.elementTypeId]);
                do_ajax(encodeURI("../db/insert_record.php?" + build_url_params(arr)), function (text) {
                    if (isNaN(text)) {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    var id = parseInt(text);
                    // ui添加
                    do_ajax("get_property.php?" + build_url_params([['property_id', id]]), function (text) {
                        var data = JSON.parse(text);
                        for (let j = 0; j < data.length; j++) {
                            const prop = data[j];
                            if (prop.classification == 0) {
                                _this.type_props.push(prop);
                            }
                            else {
                                var parent_node = null;
                                for (let i = 0; i < _this.type_props.length; i++) {
                                    const node = _this.type_props[i];
                                    if (node.classification == prop.classification) {
                                        parent_node = node;
                                        break;
                                    }
                                }
                                if (parent_node == null) {
                                    var name = _this.classification_list[prop.classification];
                                    var classification = prop.classification;
                                    parent_node = { property_id: -classification, name: name, classification: classification, children: [] };
                                    _this.type_props.push(parent_node);
                                }
                                parent_node.children.push(prop);
                            }
                        }
                    });
                    _this.adding = false;
                    _this.dialogVisible = false;
                });
            };
            //_this.dialogVisible = true;
            this.get_enum_list(() => { _this.dialogVisible = true; });
        },
        edit(prop) {
            for (const key in this.edit_prop) {
                this.edit_prop[key] = prop[key];
            }
            var _this = this;
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_prop);
                arr.push(['table_name', 'gfc_property']);
                arr.push(['primary_key', 'property_id']);
                arr.push(['key_val', prop.property_id]);
                do_ajax(encodeURI("../db/update_record.php?" + build_url_params(arr)), function (text) {
                    if (text != '') {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    do_ajax("get_property.php?" + build_url_params([['property_id', prop.property_id]]), function (text) {
                        var data = JSON.parse(text);
                        if (data.length > 0) {
                            for (const key in prop) {
                                prop[key] = data[0][key];
                            }
                        }
                    });
                    _this.dialogVisible = false;
                });
            };
            //this.dialogVisible = true;
            this.get_enum_list(() => { _this.dialogVisible = true; });
        },
        del(prop) {
            var _this = this;
            if (prop) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        do_ajax("../db/del_record.php?table_name=gfc_property&property_id=" + prop.property_id, function (text) {
                            if (text != "") {
                                _this.$message({
                                    message: text,
                                    type: 'error'
                                })
                                return;
                            }
                            if (prop.classification == 0) {
                                del_from_array(_this.type_props, prop);
                            }
                            else {
                                for (let i = 0; i < _this.type_props.length; i++) {
                                    const node = _this.type_props[i];
                                    if (node.classification == prop.classification && node.children) {
                                        del_from_array(node.children, prop)
                                        if (node.children.length == 0)
                                            _this.type_props.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        });
                    })
                    .catch(_ => { });
            }
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.property_id < 0)
                return 'group-row';
            return '';
        },
    },
    template: '<div>\
        <el-button type="primary" @click="add(null)" size="medium" v-if="this.$root.can_edit">添加属性</el-button>\
        <el-table :data="type_props" style="width: 100%" row-key="property_id" default-expand-all\
            :tree-props="{children: \'children\'}" :row-class-name="tableRowClassName">\
            <el-table-column type="index" label="序号" width="50">\
            </el-table-column>\
            <el-table-column prop="name" label="名称">\
            </el-table-column>\
            <el-table-column prop="code" label="代码" width="200">\
            </el-table-column>\
            <el-table-column prop="unit" label="单位"  width="50">\
            </el-table-column>\
            <el-table-column label="数据类型"  width="100">\
                <template slot-scope="scope">\
                    <span>{{data_types[scope.row.data_type]}}</span>\
                </template>\
            </el-table-column>\
            <el-table-column prop="pick_list_name" label="可用值列表" width="100">\
            </el-table-column>\
            <el-table-column prop="default" label="缺省值" width="100">\
            </el-table-column>\
            <el-table-column :width="bool_field_width" label="规格属性">\
                <template slot-scope="scope">\
                    <i class="el-icon-check" v-if="scope.row.is_spec"></i>\
                </template>\
            </el-table-column>\
            <el-table-column :width="bool_field_width" label="清单属性">\
                <template slot-scope="scope">\
                    <i class="el-icon-check" v-if="scope.row.is_bq"></i>\
                </template>\
            </el-table-column>\
            <el-table-column :width="bool_field_width" label="算量属性">\
                <template slot-scope="scope">\
                    <i class="el-icon-check" v-if="scope.row.is_qty"></i>\
                </template>\
            </el-table-column>\
            <el-table-column :width="bool_field_width" label="提量属性">\
                <template slot-scope="scope">\
                    <i class="el-icon-check" v-if="scope.row.is_collect"></i>\
                </template>\
            </el-table-column>\
            <el-table-column label="来源" width="50">\
                <template slot-scope="scope">\
                    <span>{{source_list[scope.row.source]}}</span>\
                </template>\
            </el-table-column>\
            <el-table-column fixed="right" label="操作"  width="200" v-if="this.$root.can_edit">\
                <template slot-scope="scope">\
                    <el-button @click="add(scope.row)" type="text">添加</el-button>\
                    | <el-button @click="edit(scope.row)" type="text">编辑</el-button>\
                    | <el-button @click="del(scope.row)" type="text">删除</el-button>\
                </template>\
            </el-table-column>\
        </el-table>\
        <el-dialog title="编辑" :visible.sync="dialogVisible">\
            <el-form :model="edit_prop" label-width="120px">\
                <el-form-item label="编码">\
                    <el-input v-model="edit_prop.code"></el-input>\
                </el-form-item>\
                <el-form-item label="名称">\
                    <el-input v-model="edit_prop.name"></el-input>\
                </el-form-item>\
                <el-form-item label="单位" >\
                    <el-input v-model="edit_prop.unit"></el-input>\
                </el-form-item>\
                <el-form-item label="数据类型" >\
                    <el-select v-model="edit_prop.data_type" placeholder="请选择">\
                        <el-option\
                            v-for="(item, index) in data_types"\
                            :key="index"\
                            :label="item"\
                            :value="index">\
                        </el-option>\
                    </el-select>\
                </el-form-item>\
                <el-form-item label="可用值列表" >\
                    <el-select v-model="edit_prop.pick_list" placeholder="请选择">\
                        <el-option\
                            v-for="item in enum_list"\
                            :key="item.enum_id"\
                            :label="item.code ? \'B.\' + item.code + \' \' + item.name : item.name"\
                            :value="item.enum_id">\
                        </el-option>\
                    </el-select>\
                </el-form-item>\
                <el-form-item label="缺省值" >\
                    <el-input v-model="edit_prop.default"></el-input>\
                </el-form-item>\
                <el-form-item label="属性特征" >\
                    <el-checkbox label="规格" v-model="edit_prop.is_spec"></el-checkbox>\
                    <el-checkbox label="清单" v-model="edit_prop.is_bq"></el-checkbox>\
                    <el-checkbox label="算量" v-model="edit_prop.is_qty"></el-checkbox>\
                    <el-checkbox label="提量" v-model="edit_prop.is_collect"></el-checkbox>\
                </el-form-item>\
                <el-form-item label="属性分类" >\
                    <el-select v-model="edit_prop.classification" placeholder="请选择">\
                        <el-option\
                            v-for="(item, index) in classification_list"\
                            :key="index"\
                            :label="item"\
                            :value="index">\
                        </el-option>\
                    </el-select>\
                </el-form-item>\
                <el-form-item label="属性来源" >\
                    <el-select v-model="edit_prop.source" placeholder="请选择">\
                        <el-option\
                            v-for="(item, index) in source_list"\
                            :key="index"\
                            :label="item"\
                            :value="index">\
                        </el-option>\
                    </el-select>\
                </el-form-item>\
            </el-form>\
            <div slot="footer" class="dialog-footer">\
                <el-button @click="dialogVisible = false">取 消</el-button>\
                <el-button type="primary" @click="handleConfirm">确 定</el-button>\
            </div>\
        </el-dialog>\
    </div>',
})