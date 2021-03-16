Vue.component('gfc-enum-list', {
    // 在 JavaScript 中是 camelCase 的
    data: function () {
        return {
            enums: [],
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
            do_ajax("../db/get_records.php?table_name=gfc_enum", function (text) {
                _this.enums = JSON.parse(text);
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
                    do_ajax("../db/get_records.php?" + build_url_params([['table_name', 'gfc_enum'],['enum_id', id]]), function (text) {
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
        <!--el-table :data="enums" style="width: 100%">\
            <el-table-column prop="name" label="枚举">\
            </el-table-column>\
            <el-table-column fixed="right" label="" width="100">\
                <template slot-scope="scope">\
                    <el-link @click="edit(scope.row)" icon="el-icon-edit" circle size="mini"></el-link>\
                    <el-link @click="del(scope.row)" icon="el-icon-delete"" circle size="mini"></el-link>\
                </template>\
            </el-table-column>\
        </el-table-->\
        <ul>\
            <li v-for="item in enums">\
                <el-button @click="" type="text">{{item.name}}</el-button>\
                <el-link @click="edit(item)" icon="el-icon-edit" size="mini"></el-link>\
                <el-link @click="del(item)" icon="el-icon-delete"" size="mini"></el-link>\
            </li>\
        </ul>\
    ',
})