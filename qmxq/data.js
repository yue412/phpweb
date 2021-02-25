function Factory(name, employeesCount, ranks) {
    this.name = name;
    this.employeesCount = employeesCount;
    this.skill = 0;
    this.affinity = 0;
    this.power = 0;
    this.intelligence = 0;
    this.enable = true;
    this.ranks = ranks;
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

function Rank(name, skill, affinity, power, intelligence) {
    this.name = name;
    this.skill = skill;
    this.affinity = affinity;
    this.power = power;
    this.intelligence = intelligence;
}

Rank.prototype.display = function () {
    var s = this.name + "\n";
    if (this.skill > 0)
        s += "技巧:" + this.skill + "\n";
    if (this.affinity > 0)
        s += "亲和:" + this.affinity + "\n";
    if (this.power > 0)
        s += "力气:" + this.power + "\n";
    if (this.intelligence > 0)
        s += "智力:" + this.intelligence + "\n";
    return s;
}

//cls 水1 火2 风3 光4 暗5

var CLS_WATER = 1;
var CLS_FIRE = 2;
var CLS_WIND = 3;
var CLS_LIGHT = 4;
var CLS_DARK = 5;

var g_qmxq_data = {
    factory: [
        new Factory("道具店", 7, [
            new Rank("B-", 318, 191, 0, 0),
            new Rank("B", 420, 252, 0, 0),
            new Rank("B+", 533, 320, 0, 0),
            new Rank("A-", 549, 329, 0, 0),
            new Rank("A", 693, 415, 0, 0),
            new Rank("A+", 852, 511, 0, 0),
            new Rank("S-", 869, 521, 0, 0),
            new Rank("S", 1064, 638, 0, 0),
        ]),
        new Factory("超市", 7, [
            new Rank("E+", 0, 114, 68, 0),
            new Rank("D-", 0, 128, 76, 0),
            new Rank("D", 0, 195, 117, 0),
            new Rank("D+", 0, 270, 162, 0),
            new Rank("C-", 0, 288, 172, 0),
            new Rank("C", 0, 400, 240, 0),
            new Rank("C+", 0, 522, 313, 0),
            new Rank("B-", 0, 543, 326, 0),
            new Rank("B", 0, 712, 427, 0),
            new Rank("B+", 0, 892, 535, 0),
            new Rank("A-", 0, 918, 550, 0),
        ]),
        new Factory("警局", 4, [
            new Rank("F-", 0, 0, 1, 1),
            new Rank("F", 0, 0, 48, 29),
            new Rank("F+", 0, 0, 75, 45),
            new Rank("E-", 0, 0, 82, 49),
            new Rank("E", 0, 0, 127, 76),
            new Rank("E+", 0, 0, 190, 114),
            new Rank("D-", 0, 0, 213, 128),
            new Rank("D", 0, 0, 315, 189),
            new Rank("D+", 0, 0, 431, 258),
            new Rank("C-", 0, 0, 460, 276),
            new Rank("C", 0, 0, 625, 375),
            new Rank("C+", 0, 0, 810, 486),
        ]),
    ],
    employees: [
        new Empolyee("教授", 5, CLS_DARK,
            766, 1919, 49, 96, 126, 24, 24, 273
        ),
        new Empolyee("锦鲤鲤", 4, CLS_WATER,
            432, 742, 57, 39, 23, 312, 23, 23
        ),
        new Empolyee("小始小终", 4, CLS_DARK,
            514, 682, 48, 48, 78, 144, 23, 23
        ),
        new Empolyee("学者", 4, CLS_DARK,
            254, 626, 48, 48, 23, 23, 23, 207
        ),
        new Empolyee("倪不染", 3, CLS_WATER,
            1309, 400, 86, 2, 42, 195, 42, 111
        ),
        new Empolyee("程序猿", 3, CLS_WIND,
            1376, 372, 168, 0, 129, 42, 42, 195
        ),
        new Empolyee("火枪手", 3, CLS_FIRE,
            776, 830, 0, 142, 195, 42, 42, 129
        ),
        new Empolyee("魔法师", 3, CLS_DARK,
            688, 2220, 0, 0, 129, 42, 42, 195
        ),
        new Empolyee("栗子蛋糕公主", 3, CLS_DARK,
            336, 750, 0, 48, 135, 71, 22, 22
        ),
        new Empolyee("黑巧克力皇后", 3, CLS_DARK,
            144, 882, 5, 43, 135, 22, 22, 71
        ),
        new Empolyee("汽水王子", 3, CLS_WATER,
            964, 180, 24, 5, 22, 126, 71, 22
        ),
        new Empolyee("奶茶王子", 3, CLS_WIND,
            510, 180, 29, 0, 22, 53, 81, 22
        ),
        new Empolyee("啤酒王子", 3, CLS_LIGHT,
            918, 180, 29, 0, 22, 71, 126, 22
        ),
        new Empolyee("阿宁", 3, CLS_LIGHT,
            558, 315, 2, 8, 33, 78, 3, 3
        ),
        new Empolyee("可乐王子", 3, CLS_DARK,
            187, 104, 5, 5, 3, 24, 15, 3
        ),
        new Empolyee("小魔王", 3, CLS_DARK,
            528, 288, 24, 24, 22, 22, 81, 47
        ),
        new Empolyee("铁匠", 2, CLS_FIRE,
            1012, 485, 54, 0, 79, 2, 162, 2
        ),
        new Empolyee("骨头兵", 2, CLS_DARK,
            1546, 291, 52, 3, 2, 168, 79, 2
        ),
        new Empolyee("剑士", 2, CLS_FIRE,
            1305, 426, 114, 0, 2, 168, 79, 2
        ),
        new Empolyee("桃几小姐", 2, CLS_WATER,
            570, 746, 44, 44, 69, 142, 2, 2
        ),
        new Empolyee("指路npc", 2, CLS_WATER,
            884, 429, 44, 0, 2, 69, 142, 2
        ),
        new Empolyee("弓箭手", 2, CLS_WIND,
            218, 1144, 0, 84, 130, 124, 2, 2
        ),
        new Empolyee("漆漆", 2, CLS_DARK,
            473, 1265, 3, 42, 130, 2, 2, 57
        ),
        new Empolyee("呜呜", 2, CLS_LIGHT,
            1733, 297, 42, 3, 2, 130, 60, 2
        ),
        new Empolyee("叶姬", 2, CLS_WIND,
            262, 493, 24, 24, 90, 27, 37, 27
        ),
        new Empolyee("哭泣的女人", 2, CLS_WATER,
            190, 430, 10, 24, 37, 60, 2, 2
        ),
        new Empolyee("棒棒糖女仆", 2, CLS_WIND,
            265, 521, 0, 24, 74, 2, 2, 90
        ),
        new Empolyee("旅行商人", 2, CLS_WIND,
            429, 120, 3, 22, 2, 2, 66, 31
        ),
        new Empolyee("猎人", 2, CLS_WIND,
            229, 521, 0, 24, 34, 90, 2, 2
        ),
        new Empolyee("村长", 1, CLS_FIRE,
            933, 108, 0, 0, 163, 79, 1, 1
        ),
        new Empolyee("小蓝", 1, CLS_WATER,
            597, 88, 0, 0, 117, 42, 42, 124
        ),
        new Empolyee("小黄", 1, CLS_FIRE,
            162, 750, 0, 0, 52, 52, 172, 159
        ),
        new Empolyee("小橙", 1, CLS_FIRE,
            72, 419, 0, 0, 66, 22, 84, 22
        ),
        new Empolyee("小红", 1, CLS_FIRE,
            479, 48, 0, 0, 22, 66, 84, 22
        ),
        new Empolyee("村长夫人", 1, CLS_WATER,
            72, 419, 0, 0, 34, 125, 1, 1
        ),
        new Empolyee("居民npc", 1, CLS_WATER,
            504, 48, 0, 0, 85, 37, 1, 1
        ),
        new Empolyee("小绿", 1, CLS_WIND,
            72, 419, 0, 0, 84, 66, 22, 22
        ),
    ],
};