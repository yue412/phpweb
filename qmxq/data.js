function Factory(name, employeesCount) {
    this.name = name;
    this.employeesCount = employeesCount;
    this.skill = 0;
    this.affinity = 0;
    this.power = 0;
    this.intelligence = 0;
    this.enable = true;
}

function Empolyee(name, rarity, cls, life, attack, armor, criticalHit, skill, affinity, power, intelligence) {
    this.name = name;
    this.rarity = rarity;
    this.cls = cls;
    this.life = life;
    this.attack = attack;
    this.armor = armor;
    this.criticalHit = criticalHit;
    this.skill = skill;
    this.affinity = affinity;
    this.power = power;
    this.intelligence = intelligence;
    this.enable = true;
}

//cls 水1 火2 风3 光4 暗5

var CLS_WATER = 1;
var CLS_FIRE = 2;
var CLS_WIND = 3;
var CLS_LIGHT = 4;
var CLS_DARK = 5;

var g_qmxq_data = {
    factory: [
        new Factory("道具店", 6),
        new Factory("超市", 3),
    ],
    employees: [
        new Empolyee("教授", 5, CLS_DARK,
            48, 305, 5, 20, 24, 5, 5, 37
        ),
        new Empolyee("程序猿", 3, CLS_WIND,
            720, 180, 48, 0, 65, 22, 22, 108
        ),
        new Empolyee("火枪手", 3, CLS_FIRE,
            288, 420, 0, 82, 108, 22, 22, 53
        ),
        new Empolyee("魔法师", 3, CLS_DARK,
            384, 1263, 0, 0, 71, 22, 22, 117
        ),
        new Empolyee("黑巧克力皇后", 3, CLS_DARK,
            84, 280, 5, 23, 51, 12, 12, 33
        ),
        new Empolyee("小魔王", 3, CLS_DARK,
            224, 67, 5, 5, 3, 3, 24, 9
        ),
        new Empolyee("骨头兵", 2, CLS_DARK,
            900, 216, 52, 3, 2, 138, 61, 2
        ),
        new Empolyee("桃几小姐", 2, CLS_WATER,
            154, 262, 24, 24, 25, 54, 2, 2
        ),
        new Empolyee("叶姬", 2, CLS_WIND,
            118, 460, 24, 24, 84, 27, 25, 27
        ),
        new Empolyee("棒棒糖女仆", 2, CLS_WIND,
            121, 298, 0, 24, 25, 2, 2, 54
        ),
        new Empolyee("旅行商人", 2, CLS_WIND,
            396, 120, 3, 22, 2, 2, 66, 28
        ),
        new Empolyee("铁匠", 2, CLS_FIRE,
            310, 107, 24, 0, 25, 2, 54, 2
        ),
        new Empolyee("指路npc", 2, CLS_WATER,
            468, 204, 24, 0, 2, 37, 72, 2
        ),
        new Empolyee("猎人", 2, CLS_WIND,
            229, 397, 0, 24, 34, 72, 2, 2
        ),
        new Empolyee("弓箭手", 2, CLS_WIND,
            118, 358, 0, 24, 54, 54, 2, 2
        ),
        new Empolyee("剑士", 2, CLS_FIRE,
            507, 105, 24, 0, 2, 78, 28, 2
        ),
        new Empolyee("漆漆", 2, CLS_DARK,
            157, 298, 3, 22, 54, 2, 2, 28
        ),
        new Empolyee("光光", 2, CLS_LIGHT,
            533, 204, 22, 3, 2, 78, 37, 2
        ),
        new Empolyee("村长夫人", 1, CLS_WATER,
            72, 210, 0, 0, 25, 89, 1, 1
        ),
        new Empolyee("村长", 1, CLS_FIRE,
            240, 48, 0, 0, 49, 25, 1, 1
        ),
        new Empolyee("居民npc", 1, CLS_WATER,
            336, 48, 0, 0, 49, 37, 1, 1
        ),
    ],
};