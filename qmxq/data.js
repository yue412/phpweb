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

export var g_qmxq_data = {
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
            new Rank("S+", 1275, 765, 0, 0),
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
            new Rank("A", 0, 1155, 693, 0),
            new Rank("A+", 0, 1404, 842, 0),
            new Rank("S-", 0, 1433, 859, 0),
            new Rank("S", 0, 1750, 1050, 0),
            new Rank("S+", 0, 2079, 1247, 0),
        ]),
        new Factory("警局", 6, [
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
            new Rank("B-", 0, 0, 843, 506),
            new Rank("B", 0, 0, 1087, 652),
            new Rank("B+", 0, 0, 1356, 813),
            new Rank("A-", 0, 0, 1395, 837),
        ]),
        new Factory("事务所", 5, [
            new Rank("F-", 1, 0, 0, 1),
            new Rank("F", 49, 0, 0, 82),
            new Rank("F+", 72, 0, 0, 120),
            new Rank("E-", 79, 0, 0, 132),
            new Rank("E", 117, 0, 0, 195),
            new Rank("E+", 168, 0, 0, 280),
            new Rank("C-", 384, 0, 0, 640),
            new Rank("C", 510, 0, 0, 850),
            new Rank("C+", 648, 0, 0, 1080),
            new Rank("B-", 675, 0, 0, 1125),
            new Rank("B", 855, 0, 0, 1425),
            new Rank("B+", 1050, 0, 0, 1750),
        ]),
    ],
    employees: [
        new Empolyee("德鲁伊", 5, CLS_WIND,
            1396, 2016, 113, 132, 44, 217, 44, 168
        ),
        new Empolyee("教授", 5, CLS_DARK,
            1278, 3367, 79, 176, 186, 44, 44, 353
        ),
        new Empolyee("圣骑士", 4, CLS_LIGHT,
            3248, 743, 152, 25, 48, 225, 292, 48
        ),
        new Empolyee("锦鲤鲤", 4, CLS_WATER,
            904, 1711, 117, 84, 43, 641, 43, 43
        ),
        new Empolyee("学者", 4, CLS_DARK,
            629, 1596, 10, 191, 43, 43, 43, 515
        ),
        new Empolyee("舞娘", 4, CLS_WATER,
            699, 1310, 88, 88, 236, 174, 43, 43
        ),
        new Empolyee("盗贼", 4, CLS_DARK,
            1130, 1119, 44, 132, 236, 43, 43, 183
        ),
        new Empolyee("野蛮人", 4, CLS_FIRE,
            1633, 1091, 39, 287, 43, 43, 641, 43
        ),
        new Empolyee("小始小终", 4, CLS_DARK,
            559, 682, 48, 48, 78, 144, 23, 23
        ),
        new Empolyee("术士", 4, CLS_WATER,
            192, 856, 24, 72, 78, 23, 23, 144
        ),
        new Empolyee("药师", 4, CLS_WIND,
            1009, 197, 72, 24, 78, 144, 23, 23
        ),
        new Empolyee("火枪手", 3, CLS_FIRE,
            1080, 1239, 0, 212, 252, 52, 52, 167
        ),
        new Empolyee("魔法师", 3, CLS_DARK,
            918, 2823, 0, 0, 161, 52, 52, 252
        ),
        new Empolyee("倪不染", 3, CLS_WATER,
            1465, 400, 86, 2, 42, 195, 42, 111
        ),
        new Empolyee("阿宁", 3, CLS_LIGHT,
            1074, 1500, 2, 151, 129, 204, 42, 42
        ),
        new Empolyee("程序猿", 3, CLS_WIND,
            1874, 596, 168, 35, 147, 42, 42, 222
        ),
        new Empolyee("浣熊小弟", 3, CLS_LIGHT,
            552, 700, 10, 58, 87, 150, 27, 27
        ),
        new Empolyee("侦探小姐", 3, CLS_LIGHT,
            570, 912, 59, 29, 81, 27, 27, 150
        ),
        new Empolyee("猪蹄古董", 3, CLS_WIND,
            758, 410, 48, 5, 71, 22, 135, 22
        ),
        new Empolyee("浣熊二哥", 3, CLS_WIND,
            522, 588, 29, 24, 71, 22, 22, 135
        ),
        new Empolyee("保安", 3, CLS_WATER,
            1046, 410, 54, 24, 22, 71, 135, 22
        ),
        new Empolyee("栗子蛋糕公主", 3, CLS_DARK,
            360, 750, 0, 48, 135, 71, 22, 22
        ),
        new Empolyee("黑巧克力皇后", 3, CLS_DARK,
            144, 882, 5, 43, 135, 22, 22, 71
        ),
        new Empolyee("啤酒王子", 3, CLS_LIGHT,
            1085, 180, 29, 0, 22, 71, 135, 22
        ),
        new Empolyee("可乐王子", 3, CLS_DARK,
            1455, 180, 24, 5, 22, 135, 71, 22
        ),
        new Empolyee("汽水王子", 3, CLS_WATER,
            1140, 180, 24, 5, 22, 135, 71, 22
        ),
        new Empolyee("奶茶王子", 3, CLS_WIND,
            1140, 180, 29, 0, 22, 71, 135, 22
        ),
        new Empolyee("小魔王", 3, CLS_DARK,
            920, 288, 24, 24, 22, 22, 135, 47
        ),
        new Empolyee("桃几小姐", 2, CLS_WATER,
            679, 856, 54, 54, 79, 162, 2, 2
        ),
        new Empolyee("铁匠", 2, CLS_FIRE,
            1094, 485, 54, 0, 79, 2, 162, 2
        ),
        new Empolyee("骨头兵", 2, CLS_DARK,
            1761, 291, 52, 3, 2, 168, 79, 2
        ),
        new Empolyee("弓箭手", 2, CLS_WIND,
            268, 1516, 0, 114, 168, 168, 2, 2
        ),
        new Empolyee("剑士", 2, CLS_FIRE,
            1480, 426, 114, 0, 2, 168, 79, 2
        ),
        new Empolyee("漆漆", 2, CLS_DARK,
            565, 1491, 3, 52, 150, 2, 2, 67
        ),
        new Empolyee("呜呜", 2, CLS_LIGHT,
            2581, 426, 52, 3, 2, 168, 79, 2
        ),
        new Empolyee("哭泣的女人", 2, CLS_WATER,
            538, 670, 10, 44, 57, 130, 2, 2
        ),
        new Empolyee("棒棒糖女仆", 2, CLS_WIND,
            431, 752, 0, 44, 120, 2, 2, 130
        ),
        new Empolyee("指路npc", 2, CLS_WATER,
            1019, 429, 44, 0, 2, 69, 142, 2
        ),
        new Empolyee("猎人", 2, CLS_WIND,
            623, 910, 0, 44, 63, 130, 2, 2
        ),
        new Empolyee("叶姬", 2, CLS_WIND,
            428, 784, 44, 44, 136, 47, 60, 47
        ),
        new Empolyee("木乃伊", 2, CLS_WIND,
            1291, 432, 49, 0, 2, 57, 130, 2
        ),
        new Empolyee("旅行商人", 2, CLS_WIND,
            1214, 220, 3, 42, 2, 2, 130, 69
        ),
        new Empolyee("小蓝", 1, CLS_WATER,
            1079, 108, 0, 0, 179, 52, 52, 179
        ),
        new Empolyee("小绿", 1, CLS_WIND,
            162, 838, 0, 0, 179, 179, 52, 52
        ),
        new Empolyee("小黄", 1, CLS_FIRE,
            162, 838, 0, 0, 52, 52, 179, 179
        ),
        new Empolyee("小橙", 1, CLS_FIRE,
            162, 838, 0, 0, 179, 52, 179, 52
        ),
        new Empolyee("小红", 1, CLS_FIRE,
            1079, 108, 0, 0, 52, 179, 179, 52
        ),
        new Empolyee("村长夫人", 1, CLS_WATER,
            162, 838, 0, 0, 82, 223, 1, 1
        ),
        new Empolyee("村长", 1, CLS_FIRE,
            1079, 108, 0, 0, 163, 82, 1, 1
        ),
        new Empolyee("居民npc", 1, CLS_WATER,
            994, 108, 0, 0, 163, 73, 1, 1
        ),
    ],
};