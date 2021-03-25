import './element_type.js';
import './property_dict.js';
import './enums.js';

var app = new Vue(
    {
        el: '#gfc',
        data: {
            active_index: 0,
            component_list: ['gfc-element-type', 'gfc-property-dict', 'gfc-enums'],
            eventHub: new Vue(),
            can_edit: false,
        },
        created: function () {

        },
        watch: {
        },
        mounted: function () {
            //this.load_data();
        },
        computed: {

        },
        methods: {
            handleSelect: function(key, keyPath) {
                this.active_index = parseInt(key);
            },
            load_user_right(user_id) {
                var _this = this;
                if(user_id=="")
                {
                    this.can_edit = false;
                    return;
                }
                do_ajax("../db/get_records.php?table_name=users&users_id=" + user_id, function (text) {
                    var data = JSON.parse(text);
                    _this.can_edit = false;
                    if(data.length > 0)
                    {
                        _this.can_edit = data[0].right != 0;
                    }
                });
            },
        },
        template: '\
        <el-container>\
            <el-header>\
                <!--<div id="titles">GFC数据标准</div>-->\
                <el-row>\
                    <el-col :span="4">\
                        <div id="titles">GFC数据标准</div>\
                    </el-col>\
                    <el-col :span="16">\
                        <el-menu default-active="0" mode="horizontal" background-color="#545c64" text-color="#fff"\
                            active-text-color="#ffd04b" @select="handleSelect">\
                            <el-menu-item index="0">构件分类</el-menu-item>\
                            <el-menu-item index="1">属性管理</el-menu-item>\
                            <el-menu-item index="2">单位字典</el-menu-item>\
                        </el-menu>\
                    </el-col>\
                    <el-col :span="4">\
                        <login-panel login-ref="..\login.html" @give-user="load_user_right" id="login"></login-panel>\
                    </el-col>\
                </el-row>\
            </el-header>\
            <el-main>\
                <component :is="component_list[active_index]"></component>\
            </el-main>\
        </el-container>\
        ',
    }
);
