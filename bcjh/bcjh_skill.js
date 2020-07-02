function effect_chef_default(chef)
{

}

function calc_price_default(recipe)
{
    return 0;
}

function adjust_type(type)
{
    return type == "vegetable" ? "veg" : type;
}

function effect_chef_abs(chef)
{
    chef[adjust_type(this.type)] += this.value;
}

function effect_chef_percent(chef)
{
    var type = adjust_type(this.type);
    chef[type] += this.value / 100 * chef[type+"_raw"] ;
}

function calc_price_percent(recipe)
{
    var type = adjust_type(this.type.substr(3));
    if (recipe[type] > 0)
        return this.value / 100 * recipe.calc_price();
    else
        return 0;
}

function init_skills(skills)
{
    for (let i = 0; i < skills.length; i++) {
        var skill = skills[i];
        for (let j = 0; j < skill.effect.length; j++) {
            var effect = skill.effect[j];
            effect.type = effect.type.toLowerCase();
            effect.effect_chef = effect_chef_default;
            effect.calc_price = calc_price_default;
            if (effect.condition == "Self")
            {
                if (is_cook_type(effect.type) || is_material_type(effect.type))
                {
                    if (effect.cal == "Abs")
                    {
                        effect.effect_chef = effect_chef_abs;
                    }
                    else if (effect.cal == "Percent")
                    {
                        effect.effect_chef = effect_chef_percent;
                    }
                }
                else if  (is_use_cook_type(effect.type) || is_use_material_type(effect.type))
                {
                    if (effect.cal == "Percent")
                    {
                        effect.calc_price = calc_price_percent;
                    }
                }
            }
        }
    }
}