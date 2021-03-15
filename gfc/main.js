var app = new Vue(
    {
        el: '#gfc',
        data: {
            active_index: 0,
            component_list: ['gfc-element-type', 'gfc-element-type', 'gfc-enums']
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
        },
    }
);
