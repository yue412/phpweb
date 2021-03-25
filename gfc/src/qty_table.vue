<template>
    <div>
        <el-button
            type="primary"
            @click="add(null)"
            size="medium"
            v-if="this.$root.can_edit"
            >添加工程量</el-button>
        <el-table :data="type_qty" style="width: 100%">
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="code" label="代码" width="200">
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="100">
            </el-table-column>
            <el-table-column label="数据类型" width="100">
                <template slot-scope="scope">
                    <span>{{ data_types[scope.row.data_type] }}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" label="允许累加">
                <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.allow_sum"></i>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="200"
                v-if="this.$root.can_edit">
                <template slot-scope="scope">
                    <el-button @click="add(scope.row)" type="text">添加</el-button>
                    | <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                    | <el-button @click="del(scope.row)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑" :visible.sync="dialogVisible">
            <el-form :model="edit_qty" label-width="120px">
                <el-form-item label="编码">
                    <el-input v-model="edit_qty.code"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="edit_qty.name"></el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model="edit_qty.unit"></el-input>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-select
                        v-model="edit_qty.data_type"
                        placeholder="请选择">
                        <el-option
                            v-for="(item, index) in data_types"
                            :key="index"
                            :label="item"
                            :value="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="允许累加">
                    <el-checkbox v-model="edit_qty.allow_sum"></el-checkbox>
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
export default {
    // 在 JavaScript 中是 camelCase 的
    props: ["element-type-id"],
    data: function () {
        return {
            type_qty: [],
            edit_qty: {
                code: "",
                name: "",
                unit: "",
                data_type: 1,
                allow_sum: true,
            },
            dialogVisible: false,
            handleConfirm: function () {},
            data_types: ["整数", "浮点数", "布尔型", "文本"],
        };
    },
    created: function () {},
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
            },
        },
    },
    methods: {
        load_data() {
            var _this = this;
            do_ajax(
                "../db/get_records.php?table_name=gfc_qty&element_type_id=" +
                    this.elementTypeId,
                function (text) {
                    _this.type_qty = JSON.parse(text);
                    _this.init_data(_this.type_qty);
                }
            );
        },
        init_data(data) {
            for (let i = 0; i < data.length; i++) {
                const qty = data[i];
                qty.allow_sum = Boolean(qty.allow_sum);
            }
        },
        add(qty) {
            var _this = this;
            this.edit_qty = {
                code: "",
                name: "",
                unit: "",
                data_type: 1,
                allow_sum: true,
            };
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_qty);
                arr.push(["table_name", "gfc_qty"]);
                arr.push(["element_type_id", _this.elementTypeId]);
                do_ajax(
                    encodeURI(
                        "../db/insert_record.php?" + build_url_params(arr)
                    ),
                    function (text) {
                        if (isNaN(text)) {
                            _this.$message({
                                message: text,
                                type: "error",
                            });
                            return;
                        }
                        var id = parseInt(text);
                        // ui添加
                        do_ajax(
                            "../db/get_records.php?" +
                                build_url_params([
                                    ["table_name", "gfc_qty"],
                                    ["qty_id", id],
                                ]),
                            function (text) {
                                var data = JSON.parse(text);
                                _this.init_data(data);
                                _this.type_qty.push.apply(_this.type_qty, data);
                            }
                        );
                        _this.dialogVisible = false;
                    }
                );
            };
            _this.dialogVisible = true;
        },
        edit(qty) {
            for (const key in this.edit_qty) {
                this.edit_qty[key] = qty[key];
            }
            var _this = this;
            this.handleConfirm = function () {
                var arr = obj_to_array(_this.edit_qty);
                arr.push(["table_name", "gfc_qty"]);
                arr.push(["primary_key", "qty_id"]);
                arr.push(["key_val", qty.qty_id]);
                do_ajax(
                    encodeURI(
                        "../db/update_record.php?" + build_url_params(arr)
                    ),
                    function (text) {
                        if (text != "") {
                            _this.$message({
                                message: text,
                                type: "error",
                            });
                            return;
                        }
                        for (const key in _this.edit_qty) {
                            qty[key] = _this.edit_qty[key];
                        }
                        _this.dialogVisible = false;
                    }
                );
            };
            this.dialogVisible = true;
        },
        del(qty) {
            var _this = this;
            if (qty) {
                this.$confirm("确认删除？")
                    .then((_) => {
                        do_ajax(
                            "../db/del_record.php?table_name=gfc_qty&qty_id=" +
                                qty.qty_id,
                            function (text) {
                                if (text != "") {
                                    _this.$message({
                                        message: text,
                                        type: "error",
                                    });
                                    return;
                                }
                                del_from_array(_this.type_qty, qty);
                            }
                        );
                    })
                    .catch((_) => {});
            }
        },
    },
};
</script>