//0-other 1-coin 2-jewel 3-crown
function Fish(name, type, dict) {
    this.name = name;
    this.type = type ? type : 0;
    this.cnt = 0;
    this.crown = 0;
    this.jewel = 0;
    this.need = 0;
    this.need_crown = 0;
    this.left = 0;
    this.dict = dict ? dict : null;
    this.create_crown_fish = [];
    this.create_jewel_fish = [];
};

Fish.prototype.total = function () {
    return this.cnt + this.crown;
};

Fish.prototype.type_name = function () {
    switch (this.type) {
        case 1:
            return '金币';
        case 2:
            return '宝石';
        case 3:
            return '皇冠';
        default:
            return '其它';
    }
};

var app = new Vue(
    {
        el: '#kxszx',
        data: {
            crown: null,
            crown_map: null,
            jewel: null,
            jewel_map: null,
            //coin_map: null,
            results: new Map(),
            crown_results: new Map(),
            results_table: [],
            crown_table: [],
            jewel_table: [],
            activeTab: 'collect',
            search: '',
            dialogFormVisible: false,
            edit_fish: { cnt: 0, crown: 0, name: '' },
            currentPage: 1,
            pagesize: 10,
            type_filter: [],
            sort_arg: null,

            fish_map: new Map(),
        },
        created: function () {
            this.crown_map = new Map();
            for (let i = 0; i < g_kxszx_data.formulas.length; i++) {
                var f = g_kxszx_data.formulas[i];
                this.crown_map.set(f.dest, f);
                this.fish_map.set(f.dest, new Fish(f.dest, 3, f));
            }
            this.crown = g_kxszx_data.formulas;
            this.jewel_map = new Map();
            for (let i = 0; i < g_kxszx_data.jewel.length; i++) {
                var j = g_kxszx_data.jewel[i];
                for (let k = 0; k < j.dest.length; k++) {
                    const fish = j.dest[k];
                    this.jewel_map.set(fish, j);
                    this.fish_map.set(fish, new Fish(fish, 2, j));
                }
            }
            this.jewel = g_kxszx_data.jewel;

            for (let i = 0; i < g_kxszx_data.coin.length; i++) {
                var f = g_kxszx_data.coin[i];
                //this.coin_map.set(f, f);
                this.fish_map.set(f, new Fish(f, 1));
            }

            for (let i = 0; i < g_kxszx_data.formulas.length; i++) {
                var f = g_kxszx_data.formulas[i];
                for (let j = 0; j < f.fishes.length; j++) {
                    const item = f.fishes[j];
                    var fish = this.get_fish(item.fish);
                    fish.create_crown_fish.push({ fish: f.dest, cnt: item.cnt });
                }
            }

            for (let i = 0; i < g_kxszx_data.jewel.length; i++) {
                var j = g_kxszx_data.jewel[i];
                for (let k = 0; k < j.jewels.length; k++) {
                    const item = j.jewels[k];
                    var fish = this.get_fish(item.fish);
                    for (let m = 0; m < j.dest.length; m++) {
                        const fn = j.dest[m];
                        fish.create_jewel_fish.push({ fish: fn, cnt: item.cnt });
                    }
                }
            }

        },
        watch: {

            search: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.gen_results_table();
                }
            },
            /*
            crown: {
                handler(newValue, oldValue) {
                    // 这种方式有点重
                    if (newValue && oldValue) {
                        if (newValue.length != oldValue.length)
                            return;
                        this.collect_all();
                    }
                },
                deep: true
            }*/
        },
        mounted: function () {
            this.load_data();
        },
        computed: {

        },
        methods: {
            load_data: function () {
                var _this = this;
                do_ajax("../db/get_records.php?table_name=kxszx_fish", function (text) {
                    var my_fishes = JSON.parse(text);
                    for (let i = 0; i < my_fishes.length; i++) {
                        const fish = my_fishes[i];
                        var f = _this.get_fish(fish.name);
                        f.cnt = fish.cnt;
                        f.crown = fish.crown_cnt;
                        f.left = f.total();
                    }
                    _this.collect_all();
                    _this.gen_results_table();
                });
            },
            /*
            count_fish: function (map, fish, cnt) {
                if (!map.has(fish))
                    map.set(fish, 0);
                map.set(fish, map.get(fish) + cnt);
            },
            */
            get_fish: function (name) {
                if (!this.fish_map.has(name))
                    this.fish_map.set(name, new Fish(name));
                return this.fish_map.get(name);
            },
            collect: function (fish, cnt) {
                var f = this.get_fish(fish);
                f.need_crown += cnt;
                cnt = cnt - f.left;
                if (cnt <= 0) {
                    f.left = -cnt;
                    return;
                }
                f.left = 0;
                f.need += cnt;
                var cf = this.crown_map.get(fish);
                if (cf == null) {
                    return;
                }
                for (let i = 0; i < cf.fishes.length; i++) {
                    this.collect(cf.fishes[i].fish, cf.fishes[i].cnt * cnt);
                }
            },
            collect_all: function () {
                for (let i = 0; i < this.crown.length; i++) {
                    var c = this.crown[i];
                    this.collect(c.dest, 1);
                }
                this.fish_map.forEach(function (fish, key, item) {
                    if (fish.type == 1 || fish.type == 2) {
                        fish.need_crown += 1;
                        if (fish.left == 0)
                            fish.need += 1;
                    }
                    fish.need_crown = fish.need_crown < fish.crown ? 0 : fish.need_crown - fish.crown;
                });
                this.collect_jewel();
            },
            gen_results_table: function () {
                var r = [];
                var index = 0;
                var _this = this;
                this.fish_map.forEach(function (fish, name, item) {
                    if ((_this.search == '' || name.indexOf(_this.search) >= 0) && (_this.type_filter.length == 0 || _this.type_filter.indexOf(fish.type) >= 0))
                        r.push(fish);
                    fish.id = ++index;
                });
                this.results_table = r;
                if (this.sort_arg)
                    this.sortChange(this.sort_arg);
                var last_page = Math.max(Math.ceil(this.results_table.length / this.pagesize), 1);
                if (this.currentPage > last_page)
                    this.currentPage = last_page;
            },
            collect_jewel: function () {
                var r = new Map();
                var index = 0;
                var _this = this;
                this.jewel.forEach(item => {
                    var factor = item.dest.length;
                    for (let i = 0; i < item.dest.length; i++) {
                        const fn = item.dest[i];
                        var f = _this.get_fish(fn);
                        if (f.need > 0) {
                            for (let j = 0; j < item.jewels.length; j++) {
                                const je = item.jewels[j];
                                fj = _this.get_fish(je.fish);
                                fj.jewel += je.cnt * factor * f.need;
                            }
                        }
                    }
                });
            },
            filterType(value, row) {
                return row.type === value;
            },
            handleTabChange: function (tab, event) {

            },
            handleClick: function (row) {
                this.edit_fish.cnt = row.cnt;
                this.edit_fish.crown = row.crown;
                this.edit_fish.name = row.name;
                this.dialogFormVisible = true;
            },
            handleConfirm: function () {
                var url = "../db/get_records.php?table_name=kxszx_fish&name=" + this.edit_fish.name;
                var _this = this;
                do_ajax(url, function (text) {
                    var fishes = JSON.parse(text);
                    if (fishes.length > 0) {
                        // update
                        var url = "../db/update_record.php?table_name=kxszx_fish&primary_key=name&key_val=" + _this.edit_fish.name + "&cnt=" + _this.edit_fish.cnt + "&crown_cnt=" + _this.edit_fish.crown;
                        do_ajax(url, function (text) {
                            _this.closeConfirm();
                        });
                    }
                    else {
                        // insert
                        var url = "../db/insert_record.php?table_name=kxszx_fish&name=" + _this.edit_fish.name + "&cnt=" + _this.edit_fish.cnt + "&crown_cnt=" + _this.edit_fish.crown;
                        do_ajax(url, function (text) {
                            _this.closeConfirm();
                        });
                    }
                });

            },
            closeConfirm: function () {
                var _this = this;
                var fish = _this.get_fish(_this.edit_fish.name);
                fish.cnt = _this.edit_fish.cnt;
                fish.crown = _this.edit_fish.crown;
                _this.fish_map.forEach(function (fish, key, item) {
                    fish.need = 0;
                    fish.need_crown = 0;
                    fish.jewel = 0;
                    fish.left = fish.total();
                });
                _this.collect_all();
                _this.gen_results_table();
                _this.dialogFormVisible = false;
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
            },
            handleSizeChange: function (pageSize) {
                this.pagesize = pageSize;
            },
            sortChange: function (arg) {
                if (arg.column) {
                    this.sort_arg = arg;
                    //let sortTableData = cloneDeep(this.tableData);
                    if (arg.order === 'descending') {
                        if (arg.prop === 'name') {
                            this.results_table.sort(this.sortByName(arg.prop, true));
                        } else {
                            this.results_table.sort(this.sortByProp(arg.prop, true));
                        }
                    } else {
                        if (arg.prop === 'name') {
                            this.results_table.sort(this.sortByName(arg.prop, false));
                        } else {
                            this.results_table.sort(this.sortByProp(arg.prop, false));
                        }
                    }
                    //                    this.tableData = sortTableData;
                }
                /*else {
                    this.tableData = this.jobListRaw;
                }
                this.page = 1;*/
            },
            sortByProp: function (sortKey, order) {
                if (order) {
                    return (a, b) => {
                        return b[sortKey] - a[sortKey];
                    };
                } else {
                    return (a, b) => {
                        return a[sortKey] - b[sortKey];
                    };
                }
            },
            // 根据名称对表格进行排序
            sortByName: function (sortKey, order) {
                if (order) {
                    return (a, b) => {
                        a[sortKey] = a[sortKey] == null ? '' : a[sortKey];
                        b[sortKey] = b[sortKey] == null ? '' : b[sortKey];
                        return b[sortKey].localeCompare(a[sortKey]);
                    };
                } else {
                    return (a, b) => {
                        a[sortKey] = a[sortKey] == null ? '' : a[sortKey];
                        b[sortKey] = b[sortKey] == null ? '' : b[sortKey];
                        return a[sortKey].localeCompare(b[sortKey]);
                    };
                }
            },
            filterChange: function (filters, e) {
                if (filters['type']) {
                    this.type_filter = filters['type'];
                    this.gen_results_table();
                }
            },
        },
    }
);
