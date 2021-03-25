import './speciality_select.js';
import './props_table.js';
import './qty_table.js';

Vue.component('gfc-property-dict', {
    // 在 JavaScript 中是 camelCase 的
    data: function () {
        return {
            element_types: [],
            tree_props: { 
                label: 'name', 
                children: 'children', 
                isLeaf: (data, node)=>{
                    return data.child_cnt == 0;
                },
            },
            speciality_id: 0,
            element_type_id: -1,
            active_tab: 'first',
        };
    },
    created: function () {
    },
    mounted() {
        //this.load_data();
    },
    methods: {
        load_data(speciality_id) {
            var _this = this;
            this.speciality_id = speciality_id;
            do_ajax("get_element_type.php?speciality_id=" + speciality_id + "&element_type_pid=-1", function (text) {
                _this.element_types = JSON.parse(text);
                var id = _this.element_types.length > 0 ? _this.element_types[0].element_type_id : -1;
                _this.$nextTick(() => {
                    _this.$refs.typeTree.setCurrentKey(id);
                });
                //_this.init_element_types(_this.element_types);
            });
        },
        load_child(node, resolve) {
            //row.treeNode = treeNode;
            //row.resolve = resolve;
            var _this = this;
            var speciality_id = node.data.speciality_id;
            var pid = node.data.element_type_id;
            do_ajax("get_element_type.php?speciality_id=" + speciality_id + "&element_type_pid=" + pid, function (text) {
                var data = JSON.parse(text);
                //* */
                node.data.children = data;
                //_this.init_parent(data, row);
                //_this.init_element_types(data);
                resolve(data);
            });
        },
        handleNodeClick(data) {
            this.element_type_id = data.element_type_id;
        },
    },
    template: '<div>\
        <el-container>\
            <div style="width: 15%" class="gfc-panel">\
            <gfc-speciality-select @speciality-change="load_data"></gfc-speciality-select>\
            <el-tree id="element_type_tree" ref="typeTree" :data="element_types" :props="tree_props" :load="load_child" @node-click="handleNodeClick" node-key="element_type_id" lazy></el-tree>\
            </div>\
            <el-tabs v-model="active_tab" style="width: 85%">\
                <el-tab-pane label="构件属性" name="first">\
                    <gfc-props-table :element-type-id="element_type_id">\
                    </gfc-props-table>\
                </el-tab-pane>\
                <el-tab-pane label="工程量字典" name="second">\
                    <gfc-qty-table :element-type-id="element_type_id">\
                    </gfc-qty-table>\
                </el-tab-pane>\
            </el-tabs>\
        </el-container>\
    </div>',
})