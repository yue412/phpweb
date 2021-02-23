
var app = new Vue(
    {
        el: '#qmxq',
        data: {
            factory: g_qmxq_data.factory,
            employees: g_qmxq_data.employees,
            results: [],
            f_ranks: [],
            f_marks: [],
            already_calc: false,
            update: false,
        },
        created: function () {
            for (let i = 0; i < this.employees.length; i++) {
                var e = this.employees[i];
                e.enable = getCookie(e.name) == 'true';
            }
            for (let i = 0; i < this.factory.length; i++) {
                const f = this.factory[i];
                this.f_ranks.push(f.ranks.length - 1 - 2);
                var obj = new Object;
                for (let j = 0; j < f.ranks.length; j++) {
                    obj[j] = f.ranks[j].name;
                }
                this.f_marks.push(obj);
            }
        },
        watch: {
            employees: {
                handler(newValue, oldValue) {
                    // 这种方式有点重
                    if (newValue.length != oldValue.length)
                        return;
                    for (let i = 0; i < newValue.length; i++) {
                        var item = newValue[i];
                        setCookie(item.name, item.enable ? "true" : "false", 14);
                    }
                },
                deep: true
            }
        },
        methods: {
            calc: function () {
                // 目标函数
                this.already_calc = true;
                var objective_function = new Object();
                objective_function.is_max = false;
                objective_function.items = [];
                // 约束函数
                var constraint_list = [];
                var props = ['skill', 'affinity', 'power', 'intelligence'];
                var arr_var_set = new Array(this.employees.length);
                for (let i = 0; i < arr_var_set.length; i++) {
                    arr_var_set[i] = new Set();
                }
                for (let i = 0; i < this.factory.length; i++) {
                    const f = this.factory[i];
                    var constraint_cnt = new Object();
                    constraint_cnt.opr_type = -1;
                    constraint_cnt.value = f.employeesCount;
                    var var_set = new Set(); // 避免重复
                    var arr_factor = new Array(this.employees.length).fill(0);
                    for (let j = 0; j < props.length; j++) {
                        const prop = props[j];
                        var rank = f.ranks[this.f_ranks[i]];
                        if (rank[prop] > 0) {
                            var constraint = new Object();
                            constraint.opr_type = 1;
                            constraint.value = rank[prop];
                            constraint.items = []; //[1, var_name]
                            for (let k = 0; k < this.employees.length; k++) {
                                const e = this.employees[k];
                                if (e.enable && (e[prop] > 10)) {
                                    var var_name = 'X_' + i + '_' + k;
                                    var_set.add(var_name);
                                    arr_var_set[k].add(var_name);
                                    constraint.items.push([e[prop], var_name]);
                                    arr_factor[k] += e[prop];
                                    //objective_function.items.push([e[prop], var_name]);
                                }
                            }
                            constraint_list.push(constraint);
                        }
                    }
                    constraint_cnt.items = []; //[1, var_name]
                    var_set.forEach(x => {
                        constraint_cnt.items.push([1, x]);
                    });
                    if (var_set.size > 0)
                        constraint_list.push(constraint_cnt);
                    for (let k = 0; k < arr_factor.length; k++) {
                        const factor = arr_factor[k];
                        if (factor > 0) {
                            var var_name = 'X_' + i + '_' + k;
                            objective_function.items.push([factor, var_name]);
                        }
                    }
                }
                for (let i = 0; i < arr_var_set.length; i++) {
                    var set = arr_var_set[i];
                    if (set.size > 0) {
                        var constraint_one = new Object(); // 份数限制
                        constraint_one.opr_type = -1;
                        constraint_one.value = 1;
                        constraint_one.items = [];
                        set.forEach(x => constraint_one.items.push([1, x]));
                        constraint_list.push(constraint_one);
                    }
                }
                var result = [];
                var objective_value = new Object();
                //var r = solve_fast(objective_function, constraint_list, result, objective_value);
                g_solve_only_once = false;
                g_log_objective_value = false;
                //g_objective_value = limit;
                var r = solve_int(objective_function, constraint_list, result, objective_value);
                if (r == 1) {
                    //final_objective_value.value = objective_value.value;
                    //final_result = result;
                    //final_comb = comb;
                    this.results = new Array(this.factory.length);
                    for (let i = 0; i < result.length; i++) {
                        const pair = result[i];
                        var cnt = Math.round(pair[1]);
                        //var cnt = pair[1];
                        if (cnt == 0)
                            continue;
                        if (pair[0].charAt(0) != "X")
                            continue;
                        var arr = pair[0].split("_");
                        var f_id = parseInt(arr[1]);
                        var id = parseInt(arr[2]);
                        if (this.results[f_id] == null)
                            this.results[f_id] = [];
                        this.results[f_id].push(this.employees[id]);
                    }
                    if (this.update) {
                        for (let k = 0; k < this.employees.length; k++) {
                            const e = this.employees[k];
                            e.enable = false;
                        }
                        for (let i = 0; i < this.results.length; i++) {
                            const f = this.results[i];
                            for (let j = 0; j < f.length; j++) {
                                const e = f[j];
                                e.enable = true;
                            }
                        }

                    }

                }
                else {
                    this.results = [];
                }

            },
            sum_prop: function (list, prop) {
                if (list == null)
                    return 0;
                var result = 0;
                for (let i = 0; i < list.length; i++) {
                    const e = list[i];
                    result += e[prop];
                }
                return result;
            },
            select_all: function () {
                for (let i = 0; i < this.employees.length; i++) {
                    const e = this.employees[i];
                    e.enable = true;
                }
            },
        },
    }
);
