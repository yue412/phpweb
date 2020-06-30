function build_chef_params(name){
    var chefs = g_bcjh_data.chefs;
    for (let i = 0; i < chefs.length; i++) {
        if(name === chefs[i].name)
        {
            var s = "";
            s += "name="+chefs[i].name;
            s += "&id="+chefs[i].chefId;
            s += "&stirfry="+chefs[i].stirfry;
            s += "&bake="+chefs[i].bake;
            s += "&boil="+chefs[i].boil;
            s += "&steam="+chefs[i].steam;
            s += "&fry="+chefs[i].fry;
            s += "&knife="+chefs[i].knife;
            s += "&meat="+chefs[i].meat;
            s += "&veg="+chefs[i].veg;
            s += "&fish="+chefs[i].fish;
            s += "&creation="+chefs[i].creation;
            s += "&rarity="+chefs[i].rarity;
            s += "&level=3";
            return s;
        }
    }
    return "";
}