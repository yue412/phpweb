function effect_chef_default(chef, owner, partial)
{

}

function calc_price_default(chef, owner, recipe)
{
    return 0;
}

function effect_limit_default(recipe)
{
}

function adjust_type(type)
{
    return type == "vegetable" ? "veg" : type;
}

function effect_chef_abs(chef, owner, partial)
{
    if(this.condition == "Self" && chef != owner)
        return;
    if(this.condition == "Partial" && !partial)
        return;
    if("tag" in this && chef.tags.indexOf(this.tag) == -1 )
        return;
    chef[adjust_type(this.type)] += this.value;
}

function effect_chef_percent(chef, owner)
{
    if(this.condition == "Self" && chef != owner)
        return;
    if("tag" in this && chef.tags.indexOf(this.tag) == -1 )
        return;
    var type = adjust_type(this.type);
    chef[type] += Math.floor(this.value / 100 * chef[type+"_raw"]) ;
}

function calc_price_percent(chef, owner, recipe)
{
    if(this.condition == "Self" && chef != owner)
        return 0;
    var type = adjust_type(this.type.substr(3));
    if (recipe[type] > 0)
        return this.value / 100 * recipe.calc_price();
    else
        return 0;
}

function calc_price_gold_gain(chef, owner, recipe)
{
    if(this.condition == "Self" && chef != owner)
        return 0;
    return this.value / 100 * recipe.calc_price();
}

function calc_price_use_all(chef, owner, recipe)
{
    if(recipe.rarity == this.rarity)
        return this.value / 100 * recipe.calc_price();
    else
        return 0;
}

function effect_limit_max(recipe)
{
    if(recipe.rarity == this.rarity)
        recipe.limit += this.value;
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
            effect.effect_limit = effect_limit_default;
            //if (effect.condition == "Self")
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
                else if(effect.type == "gold_gain")
                {
                    effect.calc_price = calc_price_gold_gain;
                }
                else if(effect.type == "useall")
                {
                    effect.calc_price = calc_price_use_all;
                }
                else if(effect.type == "maxequiplimit")
                {
                    effect.effect_limit = effect_limit_max;
                }                
            }

        }
    }
}