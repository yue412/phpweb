var app = new Vue(
    {
        el: '#gfc',
        data: {

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
            load_data: function () {
                var _this = this;
                do_ajax("../db/get_records.php?table_name=kxszx_fish", function (text) {
                    var my_fishes = JSON.parse(text);
                });
            },
            handleSelect: function(key, keyPath) {

            },
        },
    }
);
