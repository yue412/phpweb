var g_epsilon = 1e-6;
var g_debug_simplex_cnt = 0;
var g_objective_value = 0;
var g_log_objective_value = false;
var g_solve_only_once = false;

function solve_int(objective_function, constraint_list, result, objective_value) {
    var r = solve(objective_function, constraint_list, result, objective_value);
    if (r != 1)
        return r;
    // 剪枝
    if (g_log_objective_value) {
        if (objective_function.is_max) {
            if (objective_value.value < g_objective_value)
                return 0;
        }
        else {
            if (objective_value.value > g_objective_value)
                return 0;
        }
    }
    for (let i = 0; i < result.length; i++) {
        const pair = result[i];
        var int_val = Math.round(pair[1])
        if (Math.abs(int_val - pair[1]) < g_epsilon)
            continue;
        int_val = Math.ceil(pair[1]);
        // 非整数
        var s = JSON.stringify(constraint_list);
        var new_constraint_list1 = JSON.parse(s);
        {
            // 作坊
            var constraint = new Object();
            constraint.opr_type = 1;
            constraint.value = int_val;
            constraint.items = [[1, pair[0]]];
            new_constraint_list1.push(constraint);
        }
        var new_result1 = [];
        var new_value1 = new Object();
        var r1 = solve_int(objective_function, new_constraint_list1, new_result1, new_value1);
        // 只计算一次
        if (g_solve_only_once && r1 == 1) {
            copy_array(new_result1, result);
            //result = JSON.parse(JSON.stringify(new_result1));
            objective_value.value = new_value1.value;
            return r1;
        }
        if (r1 == -1)
            return -1;
        // 非整数
        var new_constraint_list2 = JSON.parse(s);
        {
            // 作坊
            var constraint = new Object();
            constraint.opr_type = -1;
            constraint.value = int_val - 1;
            constraint.items = [[1, pair[0]]];
            new_constraint_list2.push(constraint);
        }
        var new_result2 = [];
        var new_value2 = new Object();
        var r2 = solve_int(objective_function, new_constraint_list2, new_result2, new_value2);
        if (r1 == -1 || r2 == -1) {
            return -1;
        }
        if (r1 == 1 || r2 == 1) {
            if (r1 == 1 && r2 == 1) {
                if ((Math.round(new_value1.value) >= Math.round(new_value2.value) && objective_function.is_max) ||
                    (Math.round(new_value1.value) <= Math.round(new_value2.value) && !objective_function.is_max)) {
                    copy_array(new_result1, result);
                    //result = JSON.parse(JSON.stringify(new_result1));
                    objective_value.value = new_value1.value;
                }
                else {
                    copy_array(new_result2, result);
                    //result = JSON.parse(JSON.stringify(new_result2));
                    objective_value.value = new_value2.value;
                }
            }
            else if (r1 == 1) {
                copy_array(new_result1, result);
                //result = JSON.parse(JSON.stringify(new_result1));
                objective_value.value = new_value1.value;
            }
            else {
                copy_array(new_result2, result);
                //result = JSON.parse(JSON.stringify(new_result2));
                objective_value.value = new_value2.value;
            }
            return 1;
        }
        else {
            return 0;
        }
    }
    // 全部都是整数，记录极值
    g_objective_value = objective_value.value;
    g_log_objective_value = true;
    return r;
}

//先不考虑整数
function solve(objective_function, constraint_list, result, objective_value) {
    var var_list = [];
    var Ct = [];
    var factor = objective_function.is_max ? 1 : -1;
    for (let i = 0; i < objective_function.items.length; i++) {
        const pair = objective_function.items[i];
        var_list.push(pair[1]); // 变量名
        Ct.push(pair[0] * factor); // 系数
    }
    var b = [];
    var A = [];
    var new_var_no = 0;
    var base = [];
    //var rows = [];
    var index = 0;
    for (let i = 0; i < constraint_list.length; i++) {
        const constraint = constraint_list[i];
        //var factor = constraint.value < - g_epsilon ? -1 : 1; /////????
        var factor = constraint.opr_type > 0 ? -1 : 1;
        var row = new Array(var_list.length).fill(0);
        //init_number_array(row);
        for (let j = 0; j < constraint.items.length; j++) {
            const pair = constraint.items[j];
            var k = index_of_val_list(var_list, pair[1]);
            var val = pair[0] * factor;
            if (k == -1) {
                //var_list.push("_t"+(new_var_no++));
                var_list.push(pair[1]);
                row.push(val);
            }
            else {
                row[k] = val;
            }
        }
        var b_val = constraint.value * factor;
        A.push(row);
        b.push(b_val);
        if (constraint.opr_type != 0) // ==0 may be error
        {
            var_list.push("_t" + (new_var_no++));
            row.push(1);
            if (b_val - b[index] < - g_epsilon)
                index = i;
            base.push(row.length - 1);
        }
    }

    /*
    for (let i = 0; i < rows.length; i++) {
        const index = rows[i];
        var row = A[index];
        for (let j = 0; j < row.length; j++) {
            row[j] = -row[j];
        }
        b[index] = -b[index];
    }
    */

    grow_number_array(Ct, var_list.length);
    for (let i = 0; i < A.length; i++) {
        grow_number_array(A[i], var_list.length);
    }
    if (b[index] < g_epsilon) {
        //构造辅助线性规划函数
        //var_list.push("_s");
        var r = adjust_help(A, b, base, index);
        if (r != 1)
            return r;
    }
    var X = new Array(var_list.length);
    var matrix = init_matrix(Ct, A, b);
    adjust_Ct(matrix, base);
    var r = simplex(matrix, base, X, objective_value);
    if (r == 1) {
        for (let i = 0; i < var_list.length; i++) {
            if (var_list[i].charAt(0) == "_")
                continue;
            result.push([var_list[i], X[i]]);
        }
        if (!objective_function.is_max)
            objective_value.value = -objective_value.value;
    }
    return r;
}

function adjust_Ct(matrix, base) {
    var height = matrix.length;
    for (let i = 0; i < base.length; i++) {
        const col = base[i];
        var Ct_row = matrix[height - 1];
        if (Math.abs(Ct_row[col]) > g_epsilon) {
            gaussian(matrix, i, col);
        }
    }
}

function adjust_help(A, b, base, index) {
    var var_len = A[0].length;
    for (let i = 0; i < A.length; i++) {
        A[i].push(-1);
    }
    var Ct1 = new Array(var_len + 1);
    Ct1.fill(0);
    Ct1[var_len] = -1;
    var matrix = init_matrix(Ct1, A, b);
    gaussian(matrix, index, var_len);
    base[index] = var_len;
    //
    var result = new Array(var_len + 1);
    var objective_value = new Object();
    var r = simplex(matrix, base, result, objective_value);
    if (r == 1) {
        if (Math.abs(result[var_len]) > g_epsilon) {
            return 0;
        }
        else {
            if(base[index] == var_len)
            {
                // 此种情况下，必然为0
                if(Math.abs(matrix[index][var_len+1]) > g_epsilon)
                    return 0;
                // 重新找基
                var new_col = -1;
                for (let i = 0; i <= var_len; i++) {
                    if (Math.abs(matrix[index][i])>g_epsilon)
                    {
                        new_col = i;
                        break;
                    }
                }
                if(new_col != -1)
                {
                    gaussian(matrix, index, new_col);
                    base[index] = new_col;
                }
                else
                    base[index] = -1;//全部为零，无基
            }
            var width = var_len;
            var height = b.length;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    A[i][j] = matrix[i][j];
                }
                A[i].pop();
                b[i] = matrix[i][width + 1]; // jump '_s'
            }
        }
    }
    return r;
}

// 单纯形法
// max(Ct*X)
// AX=b
// b>=0 X>=0
function simplex2(Ct, A, b, base, result, objective_value) {

    // 构造Matrix
    // ( A,b)
    // (Ct,0)
    var width = Ct.length;
    var height = b.length;
    var matrix = init_matrix(Ct, A, b);
    //var base = new Array(height);
    // 找到最初的基变量
    /*
    for (let i = 0; i < height; i++) {
        base[i] = -1;
        var bZero = Math.abs(matrix[i][width]) < g_epsilon;
        var bSucc = false;
        for (let j = 0; j < width; j++) {
            if (Math.abs(matrix[i][j]) < g_epsilon)
                continue;
            if(bZero || (matrix[i][j] > g_epsilon && matrix[i][width] > g_epsilon) 
                || (matrix[i][j] < -g_epsilon && matrix[i][width] < -g_epsilon))
            {
                gaussian(matrix, i, j);
                base[i] = j;
                bSucc = true;
                break;
            }
        }
        if (!bSucc && !bZero)
            return 0; // 无解
    }
    */
    //b有可能是负的了，要处理
    /*
    while (true) {
        var isValid = true;
        for (let i = 0; i < height; i++) {
            if (matrix[i][width] < -g_epsilon) {
                isValid = false;
                var bSucc = false;
                for (let j = 0; j < width; j++) {
                    if (matrix[i][j] < -g_epsilon) {
                        gaussian(matrix, i, j);
                        base[i] = j;
                        bSucc = true;
                        break;
                    }
                }
                if (!bSucc)
                    return 0;
            }
        }
        if (isValid) {
            break;
        }
    }
    */
    return simplex(matrix, base, result, objective_value);
}

//单纯形法
function simplex(matrix, base, result, objective_value) {
    ++g_debug_simplex_cnt;
    // 构造Matrix
    // ( A,b)
    // (Ct,0)
    var width = matrix[0].length - 1;
    var height = matrix.length - 1;
    var debug_cnt = 0;
    while (true) {
        var max_val = 0;
        var col = -1;
        for (let i = 0; i < width; i++) {
            if (matrix[height][i] > (max_val + g_epsilon)) {
                max_val = matrix[height][i];
                col = i;
            }
        }
        if (col == -1) {
            // 有解
            // 非基变量全部为0
            // var result = new Array(b.length);
            init_number_array(result);
            for (let i = 0; i < base.length; i++) {
                var col = base[i];
                var row = i;
                if (col >= 0) {
                    result[col] = matrix[row][width];
                }
            }
            objective_value.value = -matrix[height][width];
            return 1;
        }
        var min_val = 0;
        var row = -1;
        for (let i = 0; i < height; i++) {
            if (Math.abs(matrix[i][col]) < g_epsilon)
                continue;
            if (matrix[i][col] > g_epsilon) {
                var f = matrix[i][width] / matrix[i][col];
                if ((row == -1) || (f < min_val - g_epsilon)) {
                    min_val = f;
                    row = i;
                }
            }
        }
        if (row == -1) {
            return -1; // 可行解无界
        }
        gaussian(matrix, row, col);
        base[row] = col;
        if (debug_cnt++ > 1000) {
            return -2; // 死循环了
        }
    }
}

function gaussian(matrix, row, col) {
    if (Math.abs(matrix[row][col]) < g_epsilon)
        return;
    // 归一
    var d = matrix[row][col];
    for (let i = 0; i < matrix[row].length; i++) {
        matrix[row][i] /= d;
    }
    // 高斯消元
    for (let i = 0; i < matrix.length; i++) {
        if (i == row)
            continue;
        //        if(Math.abs(r[col]) < g_epsilon)
        //            continue;
        var factor = matrix[i][col];
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] -= matrix[row][j] * factor;
        }
    }
}

function init_matrix(Ct, A, b) {
    // 构造Matrix
    // ( A,b)
    // (Ct,0)
    var width = Ct.length;
    var height = b.length;
    var matrix = [];
    for (let i = 0; i < height; i++) {
        var row = new Array(width + 1);
        for (let j = 0; j < width; j++) {
            row[j] = A[i][j];
        }
        row[width] = b[i];
        matrix.push(row);
    }

    var last_row = new Array(width + 1);
    for (let i = 0; i < width; i++) {
        last_row[i] = Ct[i];
    }
    last_row[width] = 0;
    matrix.push(last_row);

    return matrix;
}

function grow_number_array(array, new_cnt) {
    var cnt = new_cnt - array.length;
    for (let i = 0; i < cnt; i++) {
        array.push(0);
    }
}

function init_number_array(array) {
    for (let i = 0; i < array.length; i++) {
        array[i] = 0;
    }
}

function index_of_val_list(var_list, var_name) {
    for (let i = 0; i < var_list.length; i++) {
        if (var_list[i] == var_name)
            return i;
    }
    return -1;
}

function copy_array(src, dest) {
    dest.length = 0;
    for (let i = 0; i < src.length; i++) {
        dest.push(src[i]);
    }
}

function calc_new_lp(lp, col, int_val) {
    // clone
    var _lp = clone_LP_info(lp);
    var width = _lp.matrix[0].length;
    var new_row = new Array(width);
    init_number_array(new_row);
    new_row[col] = 1;
    new_row[new_row.length - 1] = int_val;
    _lp.matrix.splice(_lp.matrix.length - 1, 0, new_row);
    gaussian(_lp.matrix, _lp.matrix.length - 2, col);
    _lp.base[_lp.matrix.length - 2] = col;
    //check
    for (let j = 0; j < (_lp.matrix.length - 1); j++) {
        const val = _lp.matrix[j][width - 1];
        if (val < - g_epsilon) {
            return null; // 无解
        }
    }
    return _lp;
}

function clone_LP_info(lp) {
    var new_lp = new Object();
    new_lp.base = lp.base.slice(0);
    new_lp.matrix = [];
    for (let i = 0; i < lp.matrix.length; i++) {
        var row = lp.matrix[i].slice(0);
        new_lp.matrix.push(row);
    }
    return new_lp;
}

function in_base(base, col) {
    for (let i = 0; i < base.length; i++) {
        if (col == base[i])
            return true;
    }
    return false;
}

