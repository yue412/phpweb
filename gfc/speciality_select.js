//import {do_ajax} from '../common';

Vue.component('gfc-speciality-select', {
    // 在 JavaScript 中是 camelCase 的
    props: ['login-ref'],
    data: function () {
        return {
            speciality_dict: null,
            selected: -1,
        };
    },
    created: function () {
    },
    mounted() {
        this.load_data();
    },
    watch: {
        selected: {
            deep: false,
            immediate: true,
            handler: function (val, oldVal) {
                if(val != oldVal)
                {
                    this.$emit('speciality-change', val);
                }
            }
        },
    },
    methods: {
        load_data: function () {
            var _this = this;
            do_ajax("../db/get_records.php?table_name=gfc_speciality", function (text) {
                _this.speciality_dict = JSON.parse(text);
                _this.selected = _this.speciality_dict.length > 0 ? _this.speciality_dict[0].speciality_id : -1;
            });
        },
    },
    template: '<el-select v-model="selected" placeholder="请选择">\
        <el-option\
            v-for="item in speciality_dict"\
            :key="item.speciality_id"\
            :label="item.name"\
            :value="item.speciality_id">\
        </el-option>\
    </el-select>',
})