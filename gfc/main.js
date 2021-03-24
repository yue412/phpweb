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
    }
);
