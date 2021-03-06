var g_cook_types = ["stirfry", "boil", "knife", "fry", "bake", "steam"];
var g_cook_type_names = ["炒", "煮", "切", "炸", "烤", "蒸"];
var g_material_types = ["meat", "fish", "veg", "creation"];
var g_material_types2 = ["meat", "fish", "vegetable", "creation"];
var g_material_shop = [["鸡舍", "meat"], ["猪圈", "meat"], ["牧场", "meat"], ["池塘", "fish"], ["菜棚", "veg"], ["菜地", "veg"], ["森林", "veg"], ["作坊", "creation"]];
var g_Rate_names = ["无", "可", "优", "特", "神", "传"];
var g_rate_factor = [0, 1, 1.1, 1.3, 1.5, 2];

function get_skill_options() {
    var options = [{ value: -1, text: "<空>" }];
    var skills = g_bcjh_data.skills;
    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        var option = new Object();
        option.text = skill.desc;
        option.value = skill.skillId;
        options.push(option);
    }
    return options;
}

function get_equip_options() {
    var options = [{ value: -1, text: "<空>" }];
    var equips = g_bcjh_data.equips;
    for (let i = 0; i < equips.length; i++) {
        const equip = equips[i];
        var option = new Object();
        option.text = equip.galleryId + equip.name;
        option.value = equip.equipId;
        options.push(option);
    }
    return options;
}

var g_edit_chef_schemas = [
    { caption: "名称", name: "name", type: "text" },
    { caption: "级别", name: "level", type: "number" },
    { caption: "炒", name: "stirfry", type: "number" },
    { caption: "煮", name: "boil", type: "number" },
    { caption: "切", name: "knife", type: "number" },
    { caption: "炸", name: "fry", type: "number" },
    { caption: "烤", name: "bake", type: "number" },
    { caption: "蒸", name: "steam", type: "number" },
    { caption: "肉", name: "meat", type: "number" },
    { caption: "菜", name: "veg", type: "number" },
    { caption: "鱼", name: "fish", type: "number" },
    { caption: "面", name: "creation", type: "number" },
    { caption: "技能", name: "skill_id", type: "select", options: get_skill_options() },
    { caption: "装备", name: "equip_id", type: "select", options: get_equip_options() },
    { caption: "终极技能", name: "ultimate_skill_id", type: "select", options: get_skill_options() },
];
g_filter_material = "";
g_filter_recipe = "";
g_first_guest_name = "";

function calc_price2(recipe, chef, chefs, price_add, ChefTagEffect) {
    var temp = price_add;
    if (ChefTagEffect && chef.tags) {
        for (let i = 0; i < chef.tags.length; i++) {
            const tag = chef.tags[i];
            temp += ChefTagEffect[tag] * 100;
        }
    }
    var price = calc_price(recipe, chef, chefs, temp);
    return price;
}

function get_best_chefs(recipe, chefs, price_add, ChefTagEffect, all_chefs) {
    var result = [0, []];
    for (let i = 0; i < chefs.length; i++) {
        const chef = chefs[i];
        var price = calc_price2(recipe, chef, all_chefs, price_add, ChefTagEffect);
        if (price > result[0]) {
            result[0] = price;
            result[1].length = 0;
            result[1].push(chef.name);
        }
        else if (price == result[0] && price > 0) {
            result[1].push(chef.name);
        }
    }
    return result;
}

// 从n个数里选m个，范围[0..n-1]
function combination(n, m) {
    if (n <= m) {
        var result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = i;
        }
        return [result];
    }
    else if (m == 1) {
        var result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = [i];
        }
        return result;
    }
    else {
        var r1 = combination(n - 1, m - 1);
        for (let i = 0; i < r1.length; i++) {
            r1[i].push(n - 1);
        }
        var r2 = combination(n - 1, m);
        return r1.concat(r2);
    }
}

function material_by_id(id) {
    var materials_dict = g_bcjh_data.materials;
    for (let i = 0; i < materials_dict.length; i++) {
        if (id == materials_dict[i].materialId) {
            return materials_dict[i];
        }
    }
    return null;
}

function is_cook_type(type) {
    for (let i = 0; i < g_cook_types.length; i++) {
        if (type.toLowerCase() == g_cook_types[i])
            return true;
    }
    return false;
}

function is_use_cook_type(type) {
    for (let i = 0; i < g_cook_types.length; i++) {
        if (type.toLowerCase() == "use" + g_cook_types[i])
            return true;
    }
    return false;
}

function is_material_type(type) {
    for (let i = 0; i < g_material_types2.length; i++) {
        if (type.toLowerCase() == g_material_types2[i])
            return true;
    }
    return false;
}

function is_use_material_type(type) {
    for (let i = 0; i < g_material_types2.length; i++) {
        if (type.toLowerCase() == "use" + g_material_types2[i])
            return true;
    }
    return false;
}

function find_chef(name) {
    var chefs = g_bcjh_data.chefs;
    for (let i = 0; i < chefs.length; i++) {
        if (name === chefs[i].name) {
            return chefs[i];
        }
    }
    return null;
}

function calc_rate(recipe, chef) {
    var n = 5;
    for (let i = 0; i < g_cook_types.length; i++) {
        const type = g_cook_types[i];
        if (recipe[type] > 0)
            n = Math.min(n, Math.floor(chef[type] / recipe[type]));
    }
    return Math.max(n, 0);
}

function calc_rate_diff(recipe, chef, rate) {
    var result = [];
    for (let i = 0; i < g_cook_types.length; i++) {
        const type = g_cook_types[i];
        if (recipe[type] > 0) {
            let diff = chef[type] - recipe[type] * rate;
            if (diff < 0)
                result.push({ "type": type, "diff": -diff });
        }
    }
    return result;
}

function get_recipe_chefs(recipe, chefs) {
    var arr = [new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
    for (let i = 0; i < chefs.length; i++) {
        const chef = chefs[i];
        var rate = calc_rate(recipe, chef);
        chef.temp_price = calc_price(recipe, chef, chefs, 0);
        arr[rate].push(chef);
    }
    for (let chefs of arr) {
        chefs.sort(function (a, b) {
            let val = a.temp_price - b.temp_price;
            return val == 0 ? a.name.localeCompare(b.name) : -val;
        });
    }
    return arr;
}

function get_chef_names(chefs) {
    var list = new Array();
    for (let i = 0; i < chefs.length; i++) {
        const chef = chefs[i];
        list.push(chef.name);
    }
    return list.join(",");
}

function display_recipe_chefs(recipe_chefs, rate) {
    if (rate == 0)
        ++rate;
    var arr = new Array();
    for (let i = rate; i < recipe_chefs.length; i++) {
        const chefs = recipe_chefs[i];
        if (chefs.length == 0)
            continue;
        var s = g_Rate_names[i] + ":" + get_chef_names(chefs);
        arr.push(s);
    }
    return arr.join("<br>");
}

function display_first_guests(recipe_chefs, recipe) {
    var rate = Math.max(recipe.rate, 1);
    var arr = [];
    for (let i = rate - 1; i < recipe.guests.length; i++) {
        const guest = recipe.guests[i];
        if (recipe_chefs[i + 2].length > 0) {
            var s = g_Rate_names[i + 2] + ":" + guest.guest;
            arr.push(s);
        }
    }
    return arr.join("<br>");
}

function display_left_first_guests(recipe) {
    var rate = Math.max(recipe.rate, 1);
    var arr = [];
    for (let i = rate - 1; i < recipe.guests.length; i++) {
        const guest = recipe.guests[i];
        var s = g_Rate_names[i + 2] + ":" + guest.guest;
        arr.push(s);
    }
    return arr.join("\n");
}

function load_combox() {
    var e = document.getElementById("skill_id_");
    var e2 = document.getElementById("skill_id_p");
    if (e != null) {
        var n = e2.value;
        var skills = g_bcjh_data.skills;
        e.options.length = skills.length + 1;
        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i];
            var option = new Option();
            option.text = skill.desc;
            option.value = skill.skillId;
            e.options[i + 1] = option;
            if (skill.skillId == n)
                e.selectedIndex = i + 1;
        }
    }
    e = document.getElementById("ultimate_skill_id_");
    e2 = document.getElementById("ultimate_skill_id_p");
    if (e != null) {
        var n = e2.value;
        var skills = g_bcjh_data.skills;
        e.options.length = skills.length + 1;
        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i];
            var option = new Option();
            option.text = skill.desc;
            option.value = skill.skillId;
            e.options[i + 1] = option;
            if (skill.skillId == n)
                e.selectedIndex = i + 1;
        }
    }
    e = document.getElementById("equip_id_");
    e2 = document.getElementById("equip_id_p");
    if (e != null) {
        var n = e2.value;
        var equips = g_bcjh_data.equips;
        e.options.length = equips.length + 1;
        for (let i = 0; i < equips.length; i++) {
            const equip = equips[i];
            var option = new Option();
            option.text = equip.galleryId + equip.name;
            option.value = equip.equipId;
            e.options[i + 1] = option;
            if (equip.equipId == n)
                e.selectedIndex = i + 1;
        }
    }
}

function get_skill(id) {
    var skills = g_bcjh_data.skills;
    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        if (skill.skillId == id) {
            return skill;
        }
    }
    return null;
}

function get_skill_name(id) {
    var skill = get_skill(id);
    if (skill != null)
        return skill.desc;
    else
        return "";
}

function get_equip(id) {
    var equips = g_bcjh_data.equips;
    for (let i = 0; i < equips.length; i++) {
        const equip = equips[i];
        if (equip.equipId == id) {
            return equip;
        }
    }
    return null;
}

function get_equip_by_name(name) {
    var equips = g_bcjh_data.equips;
    for (let i = 0; i < equips.length; i++) {
        const equip = equips[i];
        if (equip.name == name) {
            return equip;
        }
    }
    return null;
}

function get_equip_name(id) {
    var equip = get_equip(id);
    if (equip != null)
        return equip.name;
    else
        return "";
}

function get_tags(id) {
    for (let i = 0; i < g_bcjh_data.chefs.length; i++) {
        const chef = g_bcjh_data.chefs[i];
        if (chef.chefId == id)
            return chef.tags;
    }
    return [];
}

function _init_chef(chef){
    for (let j = 0; j < g_cook_types.length; j++) {
        const type = g_cook_types[j];
        chef[type] = parseInt(chef[type]);
        chef[type + "_raw"] = chef[type];
    }
    for (let j = 0; j < g_material_types.length; j++) {
        const type = g_material_types[j];
        chef[type] = parseInt(chef[type]);
        chef[type + "_raw"] = chef[type];
    }
    chef.skill = get_skill(chef.skill_id);
    chef.ultimate_skill = get_skill(chef.ultimate_skill_id);
    chef.equip = get_equip(chef.equip_id);
    chef.equip_skills = [];
    chef.tags = get_tags(chef.id);
    chef.skill_name = function () {
        return this.skill == null ? "" : this.skill.desc;
    }
    chef.ultimate_skill_conditions = [];
    chef.ultimate_skill_name = function () {
        if (this.ultimate_skill != null)
            return this.ultimate_skill.desc;
        else {
            //if (this.ultimate_skill_conditions.length >= 3)
            if (this.ultimate_skill_conditions2)
                return this.ultimate_skill_conditions2.join("\n");
            else
                return this.ultimate_skill_conditions.join("\n");
        }
        return "";
    }
    chef.equip_name = function () {
        return this.equip == null ? "" : this.equip.name;
    }
    if (chef.skill) {
        chef.skill.effect.forEach(e => {
            e.effect_chef(chef, chef);
        });
    }
    if (chef.equip) {
        chef.equip.skill.forEach(id => {
            e_skill = get_skill(id);
            if (e_skill) {
                e_skill.effect.forEach(e => {
                    e.effect_chef(chef, chef);
                });
                chef.equip_skills.push(e_skill);
            }
        });
    }
}

function init_chefs(chefs, partial_chefs) {
    for (let i = 0; i < chefs.length; i++) {
        var chef = chefs[i];
        _init_chef(chef);
    }
    //global
    for (let i = 0; i < chefs.length; i++) {
        var chef = chefs[i];

        if (chef.ultimate_skill) {
            chef.ultimate_skill.effect.forEach(e => {
                for (let j = 0; j < chefs.length; j++) {
                    const c = chefs[j];
                    e.effect_chef(c, chef);
                }
            });
        }
    }
    if (partial_chefs) {
        for (const partial_chef of partial_chefs) {
            if (partial_chef.ultimate_skill) {
                partial_chef.ultimate_skill.effect.forEach(e => {
                    if (e.condition == "Partial") {
                        for (let j = 0; j < chefs.length; j++) {
                            const c = chefs[j];
                            e.effect_chef(c, chef, true);
                        }
                    }
                });
            }
        }
    }
}

function init_chef(current, chefs, partial_chefs) {
    _init_chef(current);
    //global
    for (let i = 0; i < chefs.length; i++) {
        var chef = chefs[i];

        if (chef.ultimate_skill) {
            chef.ultimate_skill.effect.forEach(e => {
                e.effect_chef(current, chef);
            });
        }
    }
    if (partial_chefs) {
        for (const partial_chef of partial_chefs) {
            if (partial_chef.ultimate_skill) {
                partial_chef.ultimate_skill.effect.forEach(e => {
                    if (e.condition == "Partial") {
                        e.effect_chef(current, chef, true);
                    }
                });
            }
        }
    }
}

function clear_chef(chef){
    for (let j = 0; j < g_cook_types.length; j++) {
        const type = g_cook_types[j];
        chef[type] = chef[type + "_raw"];
    }
    for (let j = 0; j < g_material_types.length; j++) {
        const type = g_material_types[j];
        chef[type] = chef[type + "_raw"];
    }
}

function sort_recipe(a, b) {
    return a.recipeId - b.recipeId;
}

function get_shop_type(shop) {
    for (let i = 0; i < g_material_shop.length; i++) {
        const pair = g_material_shop[i];
        if (pair[0] == shop)
            return pair[1];
    }
    return "";
}

function get_materials_count(materials) {
    var count = 0;
    for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        count += material.quantity;
    }
    return count;
}

function get_cook_name(recipe) {
    var arr = [];
    for (let i = 0; i < g_cook_types.length; i++) {
        const type = g_cook_types[i];
        if (recipe[type] > 0)
            arr.push(g_cook_type_names[i] + ":" + recipe[type]);
    }
    return arr.join(",");
}

function display_guests_like(guests, recipe) {
    var arr = [];
    for (let i = 0; i < guests.length; i++) {
        const guest = guests[i];
        for (let j = 0; j < guest.gifts.length; j++) {
            const gift = guest.gifts[j];
            if (gift.recipe == recipe.name) {
                arr.push(guest.name + ":" + gift.antique);
            }
        }
    }
    return arr.join("<br>");
}

function calc_limit(recipe) {
    switch (recipe.rarity) {
        case 1:
            return 40;
        case 2:
            return 30;
        case 3:
            return 25;
        case 4:
            return 20;
        case 5:
            return 15;
        default:
            return 0;
    }
}

function build_recipes(recipes, my_recipes, my_chefs) {
    var new_recipes = [];
    recipes.sort(sort_recipe);
    var i = 0;
    var j = 0;
    while (i < recipes.length && j < my_recipes.length) {
        var my_id = parseInt(my_recipes[j].id);
        if (recipes[i].recipeId > my_id)
            ++j;
        else if (recipes[i].recipeId < my_id)
            ++i;
        else {
            new_recipes.push(recipes[i]);
            recipes[i].is_mastery = parseInt(my_recipes[j].is_mastery) != 0;
            recipes[i].old_is_mastery = recipes[i].is_mastery;
            recipes[i].rate = parseInt(my_recipes[j].rate);
            recipes[i].old_rate = recipes[i].rate;
            recipes[i].limit = calc_limit(recipes[i]);
            recipes[i].calc_price = function () {
                return this.is_mastery ? this.price + this.exPrice : this.price;
            };
            recipes[i].calc_total_price = function () {
                return this.limit * this.calc_price();
            };
            recipes[i].materials_name = get_materials_name(recipes[i].materials);
            recipes[i].material_cnt = get_materials_count(recipes[i].materials);
            recipes[i].material_cnt_time = function () {
                return Math.round(this.material_cnt / this.time * 3600);
            }
            recipes[i].total_time = function () {
                return this.limit * this.time;
            }
            recipes[i].time_name = function () {
                return display_time(this.total_time());
            }
            recipes[i].cook_name = get_cook_name(recipes[i]);
            recipes[i].calc_price_time = function () {
                return Math.round(this.calc_price() / this.time * 3600);
            }
            recipes[i].unclock_name = function () {
                return this.rate >= 4 ? "-" : this.unlock;
            }
            recipes[i].gift_name = function () {
                return this.rate >= 4 ? "-" : this.gift;
            }
            for (let i = 0; i < g_material_types.length; i++) {
                const type = g_material_types[i];
                recipes[i].type = 0;
            }
            for (let k = 0; k < recipes[i].materials.length; k++) {
                const material = recipes[i].materials[k];
                var m = material_by_id(material.material);
                var type = get_shop_type(m.origin);
                if (type != "")
                    recipes[i][type] = 1;
                //;
            }
            var recipe_chefs = get_recipe_chefs(recipes[i], my_chefs);
            recipes[i].recipe_chefs = display_recipe_chefs(recipe_chefs, recipes[i].rate);
            recipes[i].recipe_chefs_arr = recipe_chefs;
            recipes[i].get_recipe_chefs_name = function (index) {
                //                var chefs = index <= this.rate || this.recipe_chefs_arr2 == null || this.recipe_chefs_arr[index].length > 0 ? this.recipe_chefs_arr[index] : this.recipe_chefs_arr2[index];
                var chefs = this.recipe_chefs_arr2 == null ? this.recipe_chefs_arr[index] : this.recipe_chefs_arr2[index];
                return get_chef_names(chefs);
            }
            recipes[i].first_guests = display_first_guests(recipe_chefs, recipes[i]);
            recipes[i].left_first_guests = display_left_first_guests(recipes[i]);
            recipes[i].guests_like = display_guests_like(g_bcjh_data.guests, recipes[i]);
            var best = get_best_chefs(recipes[i], my_chefs, 0, null, my_chefs);
            recipes[i].best_price = best[0];
            recipes[i].best_chefs = best[1].join(",");
            recipes[i].tags = 0;
            recipes[i].tag_cnt = 99;
            ++i;
            ++j;
        }
    }
    //global
    new_recipes.forEach(recipe => {
        my_chefs.forEach(chef => {
            if (chef.ultimate_skill) {
                chef.ultimate_skill.effect.forEach(effect => {
                    effect.effect_limit(recipe);
                });
            }
        });
    });
    return new_recipes;
}

function calc_price(recipe, chef, chefs, price_add) {
    var rate = calc_rate(recipe, chef);
    if (rate == 0)
        return 0;
    var price = recipe.calc_price();
    var delta = 0;
    delta += (g_rate_factor[rate] - 1) * price;
    if (chef.skill) {
        chef.skill.effect.forEach(e => {
            delta += e.calc_price(chef, chef, recipe);
        });
    }
    if (chef.equip_skills) {
        chef.equip_skills.forEach(e_skill => {
            e_skill.effect.forEach(e => {
                delta += e.calc_price(chef, chef, recipe);
            });
        });
    }
    delta += price * price_add / 100;
    // global
    for (let i = 0; i < chefs.length; i++) {
        const c = chefs[i];
        if (c.ultimate_skill) {
            c.ultimate_skill.effect.forEach(e => {
                delta += e.calc_price(chef, c, recipe);
            });
        }
    }
    return Math.ceil(price + delta);
}

function get_materials_name(materials) {
    var list = new Array();
    for (let i = 0; i < materials.length; i++) {
        const id = materials[i].material;
        const count = materials[i].quantity;
        var obj = material_by_id(id);
        list.push(obj.name + "*" + count);
    }
    return list.join(",");
}

function filter_recipes_by_material(recipes) {
    if (g_filter_material == "")
        return recipes;
    var new_recipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (get_materials_name(recipe.materials).indexOf(g_filter_material) >= 0)
            new_recipes.push(recipe);
    }
    return new_recipes;
}

function filter_recipes(recipes, filter) {
    if (filter[2] == "")
        return recipes;
    var new_recipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (Number.isInteger(recipe[filter[1]])) {
            if (recipe[filter[1]] == filter[2])
                new_recipes.push(recipe);
        }
        else {
            if (recipe[filter[1]].indexOf(filter[2]) >= 0)
                new_recipes.push(recipe);
        }
    }
    return new_recipes;
}

function filter_recipes_by_name(recipes) {
    if (g_filter_recipe == "")
        return recipes;
    var new_recipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (recipe.name.indexOf(g_filter_recipe) >= 0)
            new_recipes.push(recipe);
    }
    return new_recipes;
}

/*
function filter_recipes_by_first_guest_name(recipes, chefs) {
    if (g_first_guest_name == "")
        return recipes;
    var new_recipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        var recipe_chefs = get_recipe_chefs(recipe, chefs);
        var str = display_first_guests(recipe_chefs, recipe);
        if (str.indexOf(g_first_guest_name) >= 0)
            new_recipes.push(recipe);
    }
    return new_recipes;
}
*/

function display_time(time) {
    var hour = parseInt(time / 3600);
    time = time - hour * 3600;
    var minute = parseInt(time / 60);
    var second = time - minute * 60;
    var result = "";
    if (hour != 0)
        result += hour + "小时";
    if (minute != 0)
        result += minute + "分";
    if (second != 0)
        result += second + "秒";
    return result;
}

function recipe_by_id(id) {
    var recipes = g_bcjh_data.recipes;
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (recipe.recipeId == id) {
            return recipe;
        }
    }
    return null;
}

function get_partial_chefs(chefs) {
    let result = [];
    for (let i = 0; i < chefs.length; i++) {
        const chef = chefs[i];
        if (chef.ultimate_skill && chef.ultimate_skill.desc.indexOf("场上") >= 0) {
            for (const e of chef.ultimate_skill.effect) {
                if (e.condition == "Partial") {
                    result.push(chef);
                    break;
                }
            }
        }
    }
    return result;
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}