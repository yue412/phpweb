<template>
    <div>
        <gfc-speciality-select @speciality-change="load_data"></gfc-speciality-select>
        <el-button type="primary" @click="add" v-if="this.$root.can_edit">添加构件类型</el-button>
        <el-table :data="types" style="width: 100%" row-key="element_type_id" lazy :load="load_child"
            :tree-props="{children: 'children', hasChildren: 'child_cnt'}">
            <el-table-column prop="whole_code" label="编码" width="180">
            </el-table-column>
            <el-table-column prop="name" label="名称"  width="240">
            </el-table-column>
            <el-table-column prop="description" label="英文描述">
            </el-table-column>
            <el-table-column width="180" label="构件单元">
                <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.is_unit"></i>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="250" v-if="this.$root.can_edit">
                <template slot-scope="scope">
                    <el-button @click="add(scope.row)" type="text">添加</el-button>
                    | <el-button @click="add_child(scope.row)" type="text" :disabled="scope.row.level >= 3">添加下一级</el-button>
                    | <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                    | <el-button @click="del(scope.row)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑" :visible.sync="dialogVisible">
            <el-form :model="edit_type" label-width="120px">
                <el-form-item label="编码">
                    <el-input-number v-model="edit_type.code"></el-input-number>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="edit_type.name"></el-input>
                </el-form-item>
                <el-form-item label="英文描述" >
                    <el-input v-model="edit_type.description"></el-input>
                </el-form-item>
                <el-form-item label="构件单元" >
                    <el-checkbox v-model="edit_type.is_unit"></el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>    
</template>
<script>
import GfcSpecialitySelect from './speciality_select.vue';

export default {
    // 在 JavaScript 中是 camelCase 的
    data: function () {
        return {
            types: [],
            edit_type: {
                code: 0,
                name: '',
                description: '',
                is_unit: false,
            },
            dialogVisible: false,
            handleConfirm: function () { },
            //can_edit: false,
            speciality_id: -1,
        };
    },
    created: function () {
    },
    mounted() {
        //this.load_data();
        //var _this = this;
        //this.$root.eventHub.$on('enable_edit', (enabled) => {
        //    _this.can_edit = enabled;
        //});
    },
    methods: {
        load_data(speciality_id) {
            var _this = this;
            this.speciality_id = speciality_id;
            do_ajax("get_element_type.php?speciality_id=" + speciality_id + "&element_type_pid=-1", function (text) {
                _this.types = JSON.parse(text);
            });
        },
        load_child(row, treeNode, resolve) {
            //row.treeNode = treeNode;
            //row.resolve = resolve;
            var _this = this;
            var speciality_id = row.speciality_id;
            var pid = row.element_type_id;
            do_ajax("get_element_type.php?speciality_id=" + speciality_id + "&element_type_pid=" + pid, function (text) {
                var data = JSON.parse(text);
                //* */
                row.children = data;
                _this.init_parent(data, row);
                resolve(data);
            });
        },
        init_parent(list, parent) {
            for (let i = 0; i < list.length; i++) {
                list[i].parent = parent;
            }
        },
        get_type(tree, id) {
            for (let i = 0; i < tree.length; i++) {
                const type = tree[i];
                if (type.element_type_id == id)
                    return type;
                if (type.children) {
                    var t = this.get_type(type.children, id);
                    if (t)
                        return t;
                }
            }
            return null;
        },
        get_suggest_code(parent) {
            if (parent != null)
                return (parent.child_cnt + 1) * 5;
            var result = 0;
            for (let i = 0; i < this.types.length; i++) {
                const t = this.types[i];
                result = Math.max(t.code, result);
            }
            return result + 5;
        },
        add(sibling) {
            var parent = null;
            if (sibling && sibling.element_type_pid)
                parent = this.get_type(this.types, sibling.element_type_pid);
            this.add_child(parent);
        },
        add_child(parent) {
            var _this = this;
            var suggest_code = this.get_suggest_code(parent);
            this.edit_type = {
                code: suggest_code,
                name: '',
                description: '',
                is_unit: false,
                speciality_id: this.speciality_id,
            };
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_type);
                arr.push(['table_name', 'gfc_element_type']);
                if (parent)
                    arr.push(['element_type_pid', parent.element_type_id]);
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
                    do_ajax("get_element_type.php?" + build_url_params([['element_type_id', id]]), function (text) {
                        var child = JSON.parse(text);
                        _this.init_parent(child, parent);
                        if (parent) {
                            ++parent.child_cnt;
                            if (parent.children)
                                parent.children.push.apply(parent.children, child);
                        }
                        else {
                            _this.types.push.apply(_this.types, child);
                        }
                    });
                    _this.dialogVisible = false;
                });
            };
            this.dialogVisible = true;
        },
        edit(type) {
            for (const key in this.edit_type) {
                this.edit_type[key] = type[key];
            }
            var _this = this;
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_type);
                arr.push(['table_name', 'gfc_element_type']);
                arr.push(['primary_key', 'element_type_id']);
                arr.push(['key_val', type.element_type_id]);
                if (type.element_type_pid)
                    arr.push(['element_type_pid', type.element_type_pid]);
                do_ajax(encodeURI("../db/update_record.php?" + build_url_params(arr)), function (text) {
                    if (text != '') {
                        _this.$message({
                            message: text,
                            type: 'error'
                        })
                        return;
                    }
                    var bUpdateCode = type.code != _this.edit_type.code;
                    for (const key in _this.edit_type) {
                        type[key] = _this.edit_type[key];
                    }
                    if (bUpdateCode) {
                        _this.update_child_code(type);
                    }
                    _this.dialogVisible = false;
                });
            };
            this.dialogVisible = true;
        },
        del(type) {
            var _this = this;
            if (type) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        do_ajax("../db/del_record.php?table_name=gfc_element_type&element_type_id=" + type.element_type_id, function (text) {
                            if (text != "") {
                                _this.$message({
                                    message: text,
                                    type: 'error'
                                })
                                return;
                            }
                            _this.del_type(_this.types, type);
                        });
                    })
                    .catch(_ => { });
            }
        },
        del_type(tree, type) {
            for (let i = 0; i < tree.length; i++) {
                const t = tree[i];
                if (t == type) {
                    tree.splice(i, 1);
                    return true;
                }
                if (t.children) {
                    if (this.del_type(t.children, type)) {
                        --t.child_cnt;
                        return false;
                    }
                }
            }
            return false;
        },
        update_child_code(type) {
            this.update_whole_code(type);
            if (type.children) {
                for (let i = 0; i < type.children.length; i++) {
                    const child = type.children[i];
                    this.update_child_code(child);
                }
            }
        },
        update_whole_code(type) {
            var arr = [];
            var parent = type;
            while (parent) {
                arr.push(padding(parent.code, 2));
                parent = parent.parent;
            }
            arr.reverse();
            for (let i = arr.length; i < 3; i++) {
                arr.push('00');
            }
            type.whole_code = '14-' + arr.join('.');
        },
    },
    components: {
        GfcSpecialitySelect,
    },
}
</script>