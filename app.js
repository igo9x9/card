function Card(cardID, isLarge, rawID) {
    const self = this;

    self.status = "stock";// "stock" or "hand" or "layout" or "discard"

    self.id = cardID;
    self.title = "";
    self.img = "";
    self.description = "";

    if (!rawID) {
        self.rawID = Math.random();
    } else {
        self.rawID = rawID;
    }

    let cardWidth = 130;
    let cardHeight = 195;
    let cardTitleFontSize = 20;
    let cardDescriptionFontSize = 8;
    // let imageWidth = 120;
    // let imageHeight = 70;
    let imageScale = 0.5;
    let titleY = -65;
    let imageY = -18;
    let descriptionY = 50;

    let attackBoxScale = 0.5;
    let attackFontSize = 70;

    if (isLarge) {
        cardWidth *= 2;
        cardHeight *= 2;
        cardTitleFontSize *= 2;
        cardDescriptionFontSize = cardDescriptionFontSize * 2 + 2;
        imageScale = 1;
        imageY *= 2;
        titleY *= 2;
        descriptionY *= 2;
        attackBoxScale *= 2;
    }

    createFromCardID(self.id);

    self.ui = RectangleShape({
        width: cardWidth,
        height: cardHeight,
        fill: self.bad ? "RebeccaPurple" : "WhiteSmoke",
        stroke: "black",
        strokeWidth: 5,
        cornerRadius: 5,
        shadow: "black",
        shadowBlur: 15,
    });

    self.backupAttack = self.attack;
    self.backupDefense = self.defense;

    // 画像
    // RectangleShape({
    //     width: imageWidth,
    //     height: imageHeight,
    //     fill: "blue", 
    // }).addChildTo(self.ui).setPosition(0, imageY);
    Sprite(self.img).addChildTo(self.ui).setPosition(0, imageY).setScale(imageScale);

    // タイトル
    LabelArea({
        text: self.title,
        fontSize: cardTitleFontSize,
        fontWeight: 800,
        width: cardWidth - 20,
        height: cardTitleFontSize * 2,
        align: "center",
        stroke: "white",
        strokeWidth: 5,
    }).addChildTo(self.ui).setPosition(0, titleY);

    // 解説
    LabelArea({
        text: self.description,
        fontSize: cardDescriptionFontSize,
        width: cardWidth - 20,
        height: cardDescriptionFontSize * 6,
        fill: self.bad ? "white" : "black",
    }).addChildTo(self.ui).setPosition(0, descriptionY);

    // 攻撃力
    if (self.attack !== 0) {
        self.ui.attackBox = CircleShape({radius:50, fill:"firebrick", strokeWidth:5, stroke: "black"})
            .setScale(attackBoxScale).addChildTo(self.ui)
            .setPosition((-1) * cardWidth/2 + attackBoxScale/2 + 20, cardHeight/2 - attackBoxScale/2 - 20);
        self.ui.attackLabel = Label({
            text: self.attack,
            fontSize: attackFontSize,
            fill: "white",
            fontWeight: 800,
            stroke: "black",
            strokeWidth: 5,
        }).addChildTo(self.ui.attackBox).setPosition(0, 0);
    }
    
    // 防御力
    if (self.defense !== 0) {
        self.ui.defenseBox = CircleShape({radius:50, fill:"blue", strokeWidth:5, stroke: "black"})
            .setScale(attackBoxScale).addChildTo(self.ui)
            .setPosition(cardWidth/2 - attackBoxScale/2 - 20, cardHeight/2 - attackBoxScale/2 - 20);
        self.ui.defenseLabel = Label({
            text: self.defense,
            fontSize: attackFontSize,
            fill: "white",
            fontWeight: 800,
            stroke: "black",
            strokeWidth: 5,
        }).addChildTo(self.ui.defenseBox).setPosition(0, 0);
    }

    // 攻撃力アップ
    self.attackUp = function(point) {
        if (self.attack === 0) return;
        self.attack += point;
        self.ui.attackBox.setScale(2)
        .tweener
        .wait(100)
        .call(function() {
            self.ui.attackLabel.text = self.attack;
        })
        .to({scaleX: 0.5, scaleY: 0.5}, 300)
        .play();
    };

    // 防御力アップ
    self.defenseUp = function(point) {
        if (self.defense === 0) return;
        self.defense += point;
        self.ui.defenseBox.setScale(2)
        .tweener
        .wait(100)
        .call(function() {
            self.ui.defenseLabel.text = self.defense;
        })
        .to({scaleX: 0.5, scaleY: 0.5}, 300)
        .play();
    };

    // 攻撃力と防御力を元に戻す
    self.reset = function() {

        if (self.backupAttack > 0) {
            self.attack = self.backupAttack;
            self.ui.attackLabel.text = self.attack;
        }

        if (self.backupDefense > 0) {
            self.defense = self.backupDefense;
            self.ui.defenseLabel.text = self.defense;
        }
    };

    // カードIDからカードを生成
    function createFromCardID(id) {
        if (id === "00") {
            self.title = "トビ";
            self.img = "card-00";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "01") {
            self.title = "オシツブシ";
            self.img = "card-01";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "02") {
            self.title = "サバキ";
            self.img = "card-02";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "03") {
            self.title = "ハイ";
            self.img = "card-03";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "04") {
            self.title = "ブツカリ";
            self.img = "card-04";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "05") {
            self.title = "ハネ返す";
            self.img = "card-05";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "06") {
            self.title = "シノギ";
            self.img = "card-06";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "07") {
            self.title = "コスミ";
            self.img = "card-07";
            self.description = "";
            self.attack = 1;
            self.defense = 1;
            self.skill = null;
        } else if (id === "10") {
            self.title = "スベリ";
            self.img = "card-10";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "11") {
            self.title = "キリ";
            self.img = "card-11";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "12") {
            self.title = "眼を取る";
            self.img = "card-12";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "13") {
            self.title = "頭を叩く";
            self.img = "card-13";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "14") {
            self.title = "エグリ";
            self.img = "card-14";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "15") {
            self.title = "ハネ";
            self.img = "card-15";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "16") {
            self.title = "シボリ";
            self.img = "card-16";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "17") {
            self.title = "ホウリコミ";
            self.img = "card-17";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "20") {
            self.title = "フリカワリ";
            self.img = "card-20";
            self.description = "";
            self.attack = 1;
            self.defense = 1;
            self.skill = null;
        } else if (id === "21") {
            self.title = "打ち込み";
            self.img = "card-21";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "22") {
            self.title = "両ニラミ";
            self.img = "card-22";
            self.description = "";
            self.attack = 1;
            self.defense = 1;
            self.skill = null;
        } else if (id === "23") {
            self.title = "石塔シボリ";
            self.img = "card-23";
            self.description = "";
            self.attack = 1;
            self.defense = 1;
            self.skill = null;
        } else if (id === "24") {
            self.title = "二段バネ";
            self.img = "card-24";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "25") {
            self.title = "捨てる";
            self.img = "card-25";
            self.description = "";
            self.attack = 0;
            self.defense = 2;
            self.skill = null;
        } else if (id === "26") {
            self.title = "根拠を奪う";
            self.img = "card-26";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "27") {
            self.title = "薄みを\nとがめる";
            self.img = "card-27";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "30") {
            self.title = "急所を突く";
            self.img = "card-30";
            self.description = "";
            self.attack = 2;
            self.defense = 2;
            self.skill = null;
        } else if (id === "31") {
            self.title = "秀策の\nコスミ";
            self.img = "card-31";
            self.description = "";
            self.attack = 2;
            self.defense = 2;
            self.skill = null;
        } else if (id === "32") {
            self.title = "鉄柱";
            self.img = "card-32";
            self.description = "";
            self.attack = 0;
            self.defense = 3;
            self.skill = null;
        } else if (id === "33") {
            self.title = "村正の妖刀";
            self.img = "card-33";
            self.point = 6;
            self.description = "カードを引くたびに攻撃力が変化（１～６））。";
            self.attack = 1;
            self.defense = 0;
            self.skill = "攻撃力ランダム";
        } else if (id === "34") {
            self.title = "手抜き";
            self.img = "card-34";
            self.point = 1;
            self.description = "カードを引いた時に、HPが" + self.point + "回復。";
            self.attack = 2;
            self.defense = -2;
            self.skill = "ドロー回復";
        } else if (id === "35") {
            self.title = "定石外れ";
            self.img = "card-35";
            self.point = 4;
            self.description = "カードを引くたびに攻撃力が変化（＋０～３）。";
            self.attack = 1;
            self.defense = -3;
            self.skill = "攻撃力ランダム";
        } else if (id === "36") {
            self.title = "石の下";
            self.img = "card-36";
            self.description = "";
            self.attack = 0;
            self.defense = 3;
            self.skill = null;
        } else if (id === "37") {
            self.title = "鬼手";
            self.img = "card-37";
            self.description = "敵の防御力を無視して攻撃。";
            self.attack = 5;
            self.defense = 0;
            self.skill = "貫通";
        } else if (id === "38") {
            self.title = "耳赤の一手";
            self.img = "card-38";
            self.description = "敵の防御力を無視して攻撃。";
            self.attack = 4;
            self.defense = 4;
            self.skill = "貫通";
        } else if (id === "40") {
            self.title = "休憩";
            self.img = "card-40";
            self.point = 1;
            self.description = "HPが" + self.point + "回復。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "回復";
        } else if (id === "41") {
            self.title = "諦めない心";
            self.img = "card-41";
            self.point = 2;
            self.description = "カードを引いた時に、HPが" + self.point + "回復。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "ドロー回復";
        } else if (id === "50") {
            self.title = "迫力";
            self.img = "card-50";
            self.description = "このターンに限り、すべてのカードの攻撃力が２倍。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "攻撃力２倍";
        } else if (id === "51") {
            self.title = "厚み";
            self.img = "card-51";
            self.description = "このターンに限り、すべてのカードの攻撃力と防御力が２倍。";
            self.attack = 1;
            self.defense = 1;
            self.skill = "攻撃力防御力２倍";
        } else if (id === "52") {
            self.title = "流れを\n変える";
            self.img = "card-52";
            self.description = "全ての捨て札を山札に戻してから、山札をシャッフルする。";
            self.attack = 0;
            self.defense = 2;
            self.skill = "シャッフル";
        } else if (id === "53") {
            self.title = "長考";
            self.img = "card-53";
            self.description = "（合成専用）";
            self.attack = 0;
            self.defense = 0;
            self.skill = "";
        } else if (id === "54") {
            self.title = "形勢判断";
            self.img = "card-54";
            self.description = "（合成専用）";
            self.attack = 0;
            self.defense = 0;
            self.skill = "";
        } else if (id === "55") {
            self.title = "捨て石";
            self.img = "card-55";
            self.description = "（合成専用）";
            self.attack = 0;
            self.defense = 0;
            self.skill = "";
        } else if (id === "56") {
            self.title = "魔手";
            self.img = "card-56";
            self.description = "山札を攻撃力の高い順に並べ替える";
            self.attack = 0;
            self.defense = 4;
            self.skill = "攻撃力ソート";
        } else if (id === "90") {
            self.title = "アキ三角";
            self.img = "card-90";
            self.point = 1;
            self.description = "カードを引くたびに" + self.point + "のダメージ。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "自ダメージ";
            self.bad = true;
        } else if (id === "91") {
            self.title = "ダメ詰まり";
            self.img = "card-91";
            self.point = 2;
            self.description = "カードを引くたびに" + self.point + "のダメージ。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "自ダメージ";
            self.bad = true;
        } else if (id === "92") {
            self.title = "サカレ形";
            self.img = "card-92";
            self.point = 3;
            self.description = "カードを引くたびに" + self.point + "のダメージ。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "自ダメージ";
            self.bad = true;
        }

        if (!self.title) {
            throw("カードID不正: id=" + id);
        }
    }
}
