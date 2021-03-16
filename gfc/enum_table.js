Vue.component('gfc-enum-table', {
    // 在 JavaScript 中是 camelCase 的
    props: ['enum-id'],
    data: function () {
        return {
            items: [],
        };
    },
    created: function () {
        this.enumId = -1;
    },
    mounted() {
        this.load_data();
    },
    watch: {
        enumId: {
            deep: false,
            immediate: true,
            handler: function (val, oldVal) {
                if (val != oldVal) {
                    this.load_data();
                }
            }
        },
    },
    methods: {
        load_data() {
            var _this = this;
            do_ajax("../db/get_records.php?table_name=gfc_enum_items&enum_id=" + this.enumId, function (text) {
                _this.items = JSON.parse(text);
            });
        },
        add() {
            var _this = this;
            this.$prompt('请输入枚举名称', '提示', {
            }).then(({ value }) => {
                var arr = [['table_name', 'gfc_enum'], ['name', value]];
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
                    do_ajax("../db/get_records.php?" + build_url_params([['table_name', 'gfc_enum'], ['enum_id', id]]), function (text) {
                        var enums = JSON.parse(text);
                        _this.enums.push.apply(_this.enums, enums);
                    });
                });
            }).catch(() => {
            });
        },
        edit() {

        },
        del() {

        },
    },
    template: '\
        <el-table :data="items" style="width: 100%"">\
            <el-table-column prop="code" label="编码" width="180">\
            </el-table-column>\
            <el-table-column prop="name" label="名称">\
            </el-table-column>\
            <el-table-column fixed="right" label="操作" width="250">\
                <template slot-scope="scope">\
                    <el-button @click="add(scope.row)" type="text">添加</el-button>\
                    | <el-button @click="add_child(scope.row)" type="text" :disabled="scope.row.level >= 3">添加下一级</el-button>\
                    | <el-button @click="edit(scope.row)" type="text">编辑</el-button>\
                    | <el-button @click="del(scope.row)" type="text">删除</el-button>\
                </template>\
            </el-table-column>\
        </el-table>\
    ',
})