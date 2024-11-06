phina.globalize();

const version = "1.0";

// 山札（stock）
// 手札（hand）
// 場札（layout）
// 捨て札（discard）

let mapIndex = 0;

// プレーヤー
let player;

// デッキ
let myCards;


// ユーザの操作を抑止したい間はtrueにする
let waiting = false;

const ASSETS = {
    image: {
        "story": "img/story.jpeg",
        "stock": "img/stock.png",
        "discard": "img/discard.png",
        "card-00": "img/card-00.png",
        "card-01": "img/card-01.png",
        "card-02": "img/card-02.png",
        "card-03": "img/card-03.png",
        "card-04": "img/card-04.png",
        "card-05": "img/card-05.png",
        "card-06": "img/card-06.png",
        "card-07": "img/card-07.png",
        "card-10": "img/card-10.png",
        "card-11": "img/card-11.png",
        "card-12": "img/card-12.png",
        "card-13": "img/card-13.png",
        "card-14": "img/card-14.png",
        "card-15": "img/card-15.png",
        "card-16": "img/card-16.png",
        "card-17": "img/card-17.png",
        "card-20": "img/card-20.png",
        "card-21": "img/card-21.png",
        "card-22": "img/card-22.png",
        "card-23": "img/card-23.png",
        "card-24": "img/card-24.png",
        "card-25": "img/card-25.png",
        "card-26": "img/card-26.png",
        "card-27": "img/card-27.png",
        "card-30": "img/card-30.png",
        "card-31": "img/card-31.png",
        "card-32": "img/card-32.png",
        "card-33": "img/card-33.png",
        "card-34": "img/card-34.png",
        "card-35": "img/card-35.png",
        "card-36": "img/card-36.png",
        "card-37": "img/card-37.png",
        "card-38": "img/card-38.png",
        "card-40": "img/card-40.png",
        "card-41": "img/card-41.png",
        "card-50": "img/card-50.png",
        "card-51": "img/card-51.png",
        "card-52": "img/card-52.png",
        "card-53": "img/card-53.png",
        "card-54": "img/card-54.png",
        "card-55": "img/card-55.png",
        "card-56": "img/card-56.png",
        "card-90": "img/card-90.png",
        "card-91": "img/card-91.png",
        "card-92": "img/card-92.png",

        "defense": "img/defense.png",
        "life": "img/life.png",
        "monster01": "img/monster01.png",
        "monster02": "img/monster02.png",
        "monster03": "img/monster03.png",
        "monster04": "img/monster04.png",
        "monster05": "img/monster05.png",
        "monster06": "img/monster06.png",
        "monster07": "img/monster07.png",
        "monster08": "img/monster08.png",
        "monster09": "img/monster09.png",
        "monster10": "img/monster10.png",
        "monster11": "img/monster11.png",
        "monster12": "img/monster12.png",
        "monster13": "img/monster13.png",
        "monster14": "img/monster14.png",
        "monster15": "img/monster15.png",
        "monster16": "img/monster16.png",
        "monster17": "img/monster17.png",
        "monster99": "img/monster99.png",
        "dungeon01": "img/dungeon01.jpeg",
        "dungeon02": "img/dungeon02.jpeg",
        "dungeon09": "img/dungeon09.jpeg",
        "effect1": "img/effect1.jpeg",
        "close": "img/close.png",
        "npc1": "img/npc1.jpeg",
    }
};

phina.main(function() {
    App = GameApp({
        assets: ASSETS,
        startLabel: 'TitleScene',
        scenes: [
            {
                label: 'TitleScene',
                className: 'TitleScene',
            },
            {
                label: 'IntroScene',
                className: 'IntroScene',
            },
            {
                label: 'MainScene',
                className: 'MainScene',
            },
            {
                label: 'BattleScene',
                className: 'BattleScene',
            },
            {
                label: 'GetItemScene',
                className: 'GetItemScene',
            },
            {
                label: 'CardPlusScene',
                className: 'CardPlusScene',
            },
            {
                label: 'CardPresenterScene',
                className: 'CardPresenterScene',
            },
            {
                label: 'ResultScene',
                className: 'ResultScene',
            },
        ],
    });

    App.fps = 60;
    // App.enableStats();

    App.run();

});

// スクロール可能にするアクセサリ
// https://qiita.com/simiraaaa/items/52de20a30a02600f2486
phina.define('Scrollable', {
    superClass: 'phina.accessory.Accessory',
    scrollType: 'normal',
    vx: 0,
    vy: 0,
    minX: -Infinity,
    minY: -Infinity,
    maxX: Infinity,
    maxY: Infinity,
    _locked: false,
    init: function(target) {
        this.superInit(target);
        this.friction = 0.8;
        this.on('attached', this._attached);
    },
    lock: function() {
        this._locked = true;
        this.vx = this.vy = 0;
        return this;
    },
    unlock: function() {
        this._locked = false;
        return this;
    },
    // 摩擦をセット
    setFriction: function(v) {
        this.friction = v;
        return this;
    },
    
    setScrollType: function(type) {
        this.scrollType = type;
        return this;
    },
    
    setMaxX: function(x) {
        this.maxX = x;
        return this;
    },
    
    setMinX: function(x) {
        this.minX = x;
        return this;
    },
    
    setMaxY: function(y) {
        this.maxY = y;
        return this;
    },
    
    setMinY: function(y) {
        this.minY = y;
        return this;
    },
    
    setMaxPosition: function(x, y) {
        this.maxX = x;
        this.maxY = y;
        return this;
    },
    
    setMinPosition: function(x, y) {
        this.minX = x;
        this.minY = y;
        return this;
    },
    
    // 枠外を描画しないようにする
    enableClip: function() {
        this.target.clip = function(canvas) {
            var w = this.width;
            var h = this.height;
            canvas.beginPath().rect(-w * this.originX, -h * this.originY, w, h);
        };
        return this;
    },
    
    // 枠外も描画するようにする
    disableClip: function() {
        this.target.clip = null;
        return this;
    },
    
    _attached: function(e) {
        var target = this.target;
        target.setInteractive(true);
        this._setPointstart();
        this._setPointmove();
        this._setPointend();
        this._setEnterframe();
    },
    
    _setPointstart: function() {
        var self = this;
        this.target.on('pointstart', function(e) {
            self.pointing = true;
        });
    },
    _setPointmove: function() {
        var self = this;
        this.target.on('pointmove', function(e) {
            if (self._locked) return;
            self.getScrollMethod().move.call(this, e, self);
        });
    },
    _setPointend: function() {
        var self = this;
        this.target.on('pointend', function(e) {
            self.pointing = false;
            if (self._locked) return;
            self.vx = e.pointer.fx;
            self.vy = e.pointer.fy;
        });
    },
    
    _setEnterframe: function() {
        var self = this;
        this.target.on('enterframe', function(e) {
            if (self._locked) return;
            if(self.pointing === false){
                self.getScrollMethod().update(self);
            }
        }, this);
    },
    
    getScrollMethod: function() {
        return Scrollable.SCROLL_METHOD_MAP[this.scrollType] || Scrollable.SCROLL_METHOD_MAP.normal;
    },
    
    _static: {
        SCROLL_METHOD_MAP: {
            x: {
                move: function(e, self) {
                    var dx = e.pointer.dx;
                    var maxX = self.maxX;
                    var minX = self.minX;
                    this.children.forEach(function(child) {
                        child.x += dx;
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        if (child.x < minX) {
                            child.x = minX;
                        }
                    });
                },
                
                update: function(self) {
                    var target = self.target;
                    self.vx *= self.friction;
                    if(Math.abs(self.vx) < 1){
                        self.vx = 0;
                    }
                    var vx = self.vx;
                    var maxX = self.maxX;
                    var minX = self.minX;
                    target.children.forEach(function(child) {
                        child.x += vx;
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        if (child.x < minX) {
                            child.x = minX;
                        }
                    });
                },
            },
            
            y: {
                move: function(e, self) {
                    var dy = e.pointer.dy;
                    var maxY = self.maxY;
                    var minY = self.minY;
                    this.children.forEach(function(child) {
                        child.y += dy;
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
                update: function(self) {
                    var target = self.target;
                    self.vy *= self.friction;
                    if(Math.abs(self.vy) < 1){
                        self.vy= 0;
                    }
                    var vy = self.vy;
                    var maxY = self.maxY;
                    var minY = self.minY;
                    target.children.forEach(function(child) {
                        child.y += vy;
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
            },
            
            normal: {
                move: function(e, self) {
                    var p = e.pointer;
                    var key = Math.abs(p.dx) < Math.abs(p.dy) ? 'y' : 'x';
                    var v = p['d' + key];
                    var max = self['max' + key.toUpperCase()];
                    var min = self['min' + key.toUpperCase()];
                    this.children.forEach(function(child) {
                        child[key] += v;
                        if (child[key] > max) {
                            child[key] = max;
                        }
                        if (child[key] < min) {
                            child[key] = min;
                        }
                    });
                },
                
                update: function(self) {
                    // 移動量が大きい方のみ処理する
                    var key = Math.abs(self.vx) < Math.abs(self.vy) ? 'y' : 'x';
                    var vkey = 'v' + key;
                    var target = self.target;
                    self[vkey] *= self.friction;
                    if(Math.abs(self[vkey]) < 1){
                        self[vkey] = 0;
                    }
                    
                    var v = self[vkey];
                    var max = self['max' + key.toUpperCase()];
                    var min = self['min' + key.toUpperCase()];
                    target.children.forEach(function(child) {
                        child[key] += v;
                        if (child[key] > max) {
                            child[key] = max;
                        }
                        if (child[key] < min) {
                            child[key] = min;
                        }
                    });
                    
                    // 階段状に移動してしまう対策
                    self.vx = self.vy = 0;
                    self[vkey] = v;
                },
            },
            
            flick: {
                move: function(e, self) {
                    var pos = {
                        x: e.pointer.dx,
                        y: e.pointer.dy,
                    };
                    var maxX = self.maxX;
                    var maxY = self.maxY;
                    var minX = self.minX;
                    var minY = self.minY;
                    this.children.forEach(function(child) {
                        child.position.add(pos);
                        
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        
                        if (child.x < minX) {
                            child.x = minX;
                        }
                        
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
                
                update: function(self) {
                    var target = self.target;
                    self.vx *= self.friction;
                    self.vy *= self.friction;
                    
                    if(Math.abs(self.vx) < 1){
                        self.vx = 0;
                    }
                    
                    if(Math.abs(self.vy) < 1){
                        self.vy = 0;
                    }
                    
                    var pos = {
                        x: self.vx,
                        y: self.vy,
                    };
                    var maxX = self.maxX;
                    var maxY = self.maxY;
                    var minX = self.minX;
                    var minY = self.minY;
                    target.children.forEach(function(child) {
                        child.position.add(pos);
                        
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        
                        if (child.x < minX) {
                            child.x = minX;
                        }
                        
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
            },
            
        }
    }
});

window.onerror = function(message, file, lineNo) {
    alert("ERROR:" + message + "\n" + file + "\n" + lineNo);
    return true;
};
function BasicButton(param/* {text:string, width: int, height: int, primary: boolean, disable: boolean, dark: boolean, callback: function} */) {

    const self = this;

    self.ui = RectangleShape({
        width: param.width,
        height: param.height,
        fill: param.dark ? "black" : "white",
        stroke: param.dark ? "white" : "black",
        strokeWidth: 5,
        cornerRadius: 5,
    });

    if (!param.disable) {
        self.ui.setInteractive(true);
    }

    if (param.primary) {
        self.ui.strokeWidth = 10;
    }

    const label = Label({
        text: param.text,
        fontSize: 25,
        fontWeight: 800,
        fill: param.dark ? "white" : "black",
    }).addChildTo(self.ui);

}phina.define('BattleScene', {
    superClass: 'DisplayScene',
    init: function(param/*{player:Player, enemy:Enemy, items:map.items, backImage: String}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "gray";

        // 背景画像
        Sprite(param.backImage).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        // 敵画像
        const enemyImage = Sprite(param.enemy.img).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center()).setScale(0);
        enemyImage.alpha = 0;

        // 自ステータス
        self.myStatusBox = RectangleShape({
            width: 100,
            height: 200,
            fill: "rgba(0, 0, 0, 0.6)",
            stroke: 0,
        }).addChildTo(this).setPosition(this.gridX.span(-2), this.gridY.center(-2));
        Label({text: "You", fontSize: 20, fontWeight:800, fill: "white"}).addChildTo(self.myStatusBox).setPosition(0, -80);
        const myDefenseImg = Sprite("defense").addChildTo(self.myStatusBox).setPosition(0, -25);
        const myDefenseLabel = Label({text:"", fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(myDefenseImg);
        const myLifeImg = Sprite("life").addChildTo(self.myStatusBox).setPosition(0, 50);
        const myLifeLabel = Label({text:"", fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(myLifeImg);

        // 自ステータス再描画
        function refreshMyStatusBox() {
            // if (param.player.defense < 0) param.player.defense = 0;
            myDefenseLabel.text = param.player.defense;

            if (param.player.hp < 0) param.player.hp = 0;
            if (param.player.hp > param.player.maxHp) param.player.hp = param.player.maxHp;
            myLifeLabel.text = param.player.hp;
        }
        refreshMyStatusBox();

        // 敵ステータス
        self.enemyStatusBox = RectangleShape({
            width: 280,
            height: 80,
            fill: "rgba(0, 0, 0, 0.6)",
            stroke: 0,
        }).addChildTo(this).setPosition(this.gridX.center(4), this.gridY.span(1));
        Label({text: "Enemy", fontSize: 20, fontWeight:800, fill: "white"}).addChildTo(self.enemyStatusBox).setPosition(-90, -10);
        const enemyDefenseImg = Sprite("defense").addChildTo(self.enemyStatusBox).setPosition(0, 0);
        const enemyDefenseLabel = Label({text:"", fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(enemyDefenseImg);
        enemyDefenseLabel.text = "0";
        const enemyLifeImg = Sprite("life").addChildTo(self.enemyStatusBox).setPosition(70, 0);
        const enemyLifeLabel = Label({text:"", fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(enemyLifeImg);
        enemyLifeLabel.text = "10";

        // 敵ステータス再描画
        function refreshEnemyStatusBox() {
            if (param.enemy.defense < 0) param.enemy.defense = 0;
            enemyDefenseLabel.text = param.enemy.defense;

            if (param.enemy.hp < 0) param.enemy.hp = 0;
            enemyLifeLabel.text = param.enemy.hp;
        }
        refreshEnemyStatusBox();

        // 敵アクション表示
        self.enemyActions = [null, null, null];
        function drawAllEnemyActions(actions) {
            for (let i = 0; i < 3; i++) {
                if (self.enemyActions[i] !== null) {
                    self.enemyActions[i].remove();
                    self.enemyActions[i] = null;
                }
                if (!actions[i]) {
                    continue;
                }
                let color = "";
                if (actions[i].name === "attack") {
                    color = "firebrick";
                } else if (actions[i].name === "defense") {
                    color = "blue";
                } else if (actions[i].name === "life") {
                    color = "deeppink";
                } else if (actions[i].name === "card") {
                    color = "purple";
                } else {
                    continue;
                }

                if (actions[i].name === "life") {
                    self.enemyActions[i] = HeartShape({radius:50, fill:color, strokeWidth:5, stroke: "black"});
                } else if (actions[i].name === "card") {
                    self.enemyActions[i] = RectangleShape({width:80, height:100, fill:color, strokeWidth:5, stroke: "black"});
                } else {
                    self.enemyActions[i] = CircleShape({radius:50, fill:color, strokeWidth:5, stroke: "black"});
                }

                self.enemyActions[i].addChildTo(self)
                    .setPosition(self.enemyStatusBox.x - 150 + i * 52, self.enemyStatusBox.y + 40).setScale(0.5);

                const label = Label({text: "", fontSize:70, fontWeight:800, fill:"white", stroke:"black", strokeWidth:5})
                    .addChildTo(self.enemyActions[i]);

                if (actions[i].name === "card") {
                    label.text = "?";
                    self.enemyActions[i].setInteractive(true);
                    self.enemyActions[i].on("pointstart", function() {
                        const id = actions[i].point;
                        App.pushScene(CardDetailScene({
                            cardID: id,
                        }));
                    });
                } else {
                    label.text = actions[i].point;
                }
            }
        }

        // 敵のアクション実行
        function doEnemyAction(actionIndex) {
            const action = param.enemy.getAction()[actionIndex];
            return Flow(function(resolve) {
                if (!action) {
                    resolve();
                    return;
                }
                // 攻撃
                if (action.name === "attack") {
                    attackToPlayer(self.enemyActions[actionIndex], action.point)
                        .then(function() {
                            resolve();
                        });
                }
                // シールドアップ
                if (action.name === "defense") {
                    enemyShieldUp(self.enemyActions[actionIndex], action.point)
                        .then(function() {
                            resolve();
                        });
                }
                // 回復
                if (action.name === "life") {
                    enemyLifeUp(self.enemyActions[actionIndex], action.point)
                        .then(function() {
                            resolve();
                        });
                }
                // カード
                if (action.name === "card") {
                    enemyCard(self.enemyActions[actionIndex], action.point)
                        .then(function() {
                            resolve();
                        });
                }
            });
        }
        
        // 場札
        self.layoutCards = [null, null];

        // 場札のドロップ領域
        self.dropArea = RectangleShape({
            width: (130 + 10) * 2 + 30,
            height: 195 + 10 + 20,
            fill: "rgba(0, 0, 0, 0.2)",
            stroke: "yellow",
            strokeWidth: 1,
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center()).hide();

        // 場札置き場１
        self.layoutBox1 = RectangleShape({
            width: 130 + 10,
            height: 195 + 10,
            fill: "transparent",
            strokeWidth: 0,
        }).addChildTo(this).setPosition(240, this.gridY.center()).hide();
        // Label({
        //     text: "1",
        //     fontSize: 20,
        //     fill: "yellow",
        // }).addChildTo(self.layoutBox1).setPosition(0, 0);

        // 場札置き場２
        self.layoutBox2 = RectangleShape({
            width: 130 + 10,
            height: 195 + 10,
            fill: "transparent",
            strokeWidth: 0,
        }).addChildTo(this).setPosition(400, this.gridY.center()).hide();
        // Label({
        //     text: "2",
        //     fontSize: 20,
        //     fill: "yellow",
        // }).addChildTo(self.layoutBox2).setPosition(0, 0);

        // 山札の山
        const stock = new CardsUI(myCards);
        stock.shuffle();
        stock.ui.addChildTo(this).setPosition(this.gridX.center(10), this.gridY.center(1));

        let cards = [];

        // 敵の攻撃
        function attackToPlayer(enemyAction, damage) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "firebrick", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:damage, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(enemyAction.x, enemyAction.y)
                .tweener
                .call(function() {
                    enemyAction.remove();
                })
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.myStatusBox.x, y: self.myStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    self.myStatusBox.tweener.by({y:-20}, 30).by({y:20}, 50)
                    .call(function() {

                        let attackPoint = damage;

                        // まずシールドが減る
                        if (param.player.defense > 0) {
                            attackPoint -= param.player.defense;
                            let playerOldDefense = param.player.defense;
                            if (damage > param.player.defense) {
                                param.player.defense = 0;
                            } else {
                                param.player.defense -= damage;
                            }
                            // シールド変化アニメーション
                            const downNum = Label({text:(param.player.defense - playerOldDefense), fontSize:30, fontWeight:800, fill: "firebrick", stroke:"white", strokeWidth: 3});
                            downNum.addChildTo(self).setPosition(self.myStatusBox.x, self.myStatusBox.y - 30)
                            .tweener.by({y:-20, alpha:-1}, 1000)
                            .call(function() {
                                downNum.remove();
                            })
                            .play();
    
                        }

                        // まだ攻撃力が残っているなら、HPが減る
                        if (attackPoint > 0) {

                            param.player.hp -= attackPoint;
    
                            // ステータス変化アニメーション
                            const downNum = Label({text:"-" + attackPoint, fontSize:30, fontWeight:800, fill: "firebrick", stroke:"white", strokeWidth: 3});
                            downNum.addChildTo(self).setPosition(self.myStatusBox.x, self.myStatusBox.y + 30)
                            .tweener.by({y:-20, alpha:-1}, 1000)
                            .call(function() {
                                downNum.remove();
                            })
                            .play();
                        }

                        refreshMyStatusBox();
                    })
                    .wait(700)
                    .call(function() {
                        ball.remove();
                        enemyAction.remove();
                        resolve();
                    })
                    .play();
                })
                .play();
            })
        }

        // 敵のシールドアップ
        function enemyShieldUp(enemyAction, point) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "blue", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:point, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(enemyAction.x, enemyAction.y)
                .tweener
                .call(function() {
                    enemyAction.remove();
                })
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.enemyStatusBox.x, y: self.enemyStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeOutQuart")
                .call(function() {
                    // ステータス変化アニメーション
                    const upNum = Label({text:"+" + point, fontSize:30, fontWeight:800, fill: "blue", stroke:"white", strokeWidth: 3});
                    upNum.addChildTo(self).setPosition(self.enemyStatusBox.x, self.enemyStatusBox.y - 20)
                    .tweener.by({y:-20, alpha:-1}, 1000)
                    .call(function() {
                        upNum.remove();
                    })
                    .play();
                    param.enemy.defense += point;
                    refreshEnemyStatusBox();
                })
                .wait(700)
                .call(function() {
                    ball.remove();
                    resolve();
                })
                .play();
            })
        }

        // 敵の回復
        function enemyLifeUp(enemyAction, point) {
            return Flow(function(resolve) {
                const ball = HeartShape({radius: 150, fill: "deeppink", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:point, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);

                ball.setPosition(enemyAction.x, enemyAction.y)
                .tweener
                .call(function() {
                    enemyAction.remove();
                })
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.enemyStatusBox.x + 60, y: self.enemyStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeOutQuart")
                .call(function() {
                    // ステータス変化アニメーション
                    const upNum = Label({text:"+" + point, fontSize:30, fontWeight:800, fill: "blue", stroke:"white", strokeWidth: 3});
                    upNum.addChildTo(self).setPosition(self.enemyStatusBox.x + 60, self.enemyStatusBox.y - 20)
                    .tweener.by({y:-20, alpha:-1}, 1000)
                    .call(function() {
                        upNum.remove();
                    })
                    .play();
                    param.enemy.hp += point;
                    refreshEnemyStatusBox();
                })
                .wait(700)
                .call(function() {
                    ball.remove();
                    resolve();
                })
                .play();
            })
        }

        // 敵のカード攻撃
        function enemyCard(enemyAction, point) {
            return Flow(function(resolve) {
                const ball = RectangleShape({width: 170, height: 200, fill: "purple", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:"?", fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);

                ball.setPosition(enemyAction.x, enemyAction.y)
                .tweener
                .call(function() {
                    enemyAction.remove();
                })
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: stock.ui.x, y: stock.ui.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeOutQuart")
                .call(function() {
                    // ステータス変化アニメーション
                    const upNum = Label({text:"+1", fontSize:30, fontWeight:800, fill: "purple", stroke:"white", strokeWidth: 3});
                    upNum.addChildTo(self).setPosition(stock.ui.x, stock.ui.y - 20)
                    .tweener.by({y:-20, alpha:-1}, 1000)
                    .call(function() {
                        upNum.remove();
                    })
                    .play();

                    const card = new Card(point);
                    stock.addRandom(card);

                })
                .wait(700)
                .call(function() {
                    ball.remove();
                    resolve();
                })
                .play();
            })
        }

        // 敵に攻撃
        function attackToEnemy(targetCard) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "firebrick", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:targetCard.attack, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(targetCard.ui.x + targetCard.ui.attackBox.x, targetCard.ui.y + targetCard.ui.attackBox.y)
                .tweener
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.enemyStatusBox.x, y: self.enemyStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    self.enemyStatusBox.tweener.by({y:-20}, 30).by({y:20}, 50)
                    .call(function() {

                        let attackPoint = targetCard.attack;

                        // まずシールドが減る
                        // 貫通のスキルの場合はスキップ
                        if (param.enemy.defense > 0 && targetCard.skill !== "貫通") {
                            attackPoint -= param.enemy.defense;
                            let enemyOldDefense = param.enemy.defense;
                            if (targetCard.attack > param.enemy.defense) {
                                param.enemy.defense = 0;
                            } else {
                                param.enemy.defense -= targetCard.attack;
                            }
                            // シールド変化アニメーション
                            const downNum = Label({text:(param.enemy.defense - enemyOldDefense), fontSize:30, fontWeight:800, fill: "firebrick", stroke:"white", strokeWidth: 3});
                            downNum.addChildTo(self).setPosition(self.enemyStatusBox.x, self.enemyStatusBox.y - 20)
                            .tweener.by({y:-20, alpha:-1}, 1000)
                            .call(function() {
                                downNum.remove();
                            })
                            .play();
    
                        }

                        // まだ攻撃力が残っているなら、HPが減る
                        if (attackPoint > 0) {

                            param.enemy.hp -= attackPoint;
    
                            // ステータス変化アニメーション
                            const downNum = Label({text:"-" + attackPoint, fontSize:30, fontWeight:800, fill: "firebrick", stroke:"white", strokeWidth: 3});
                            downNum.addChildTo(self).setPosition(self.enemyStatusBox.x + 80, self.enemyStatusBox.y - 20)
                            .tweener.by({y:-20, alpha:-1}, 1000)
                            .call(function() {
                                downNum.remove();
                            })
                            .play();
                        }

                        refreshEnemyStatusBox();
                    })
                    .wait(700)
                    .call(function() {
                        ball.remove();
                        resolve();
                    })
                    .play();
                })
                .play();
            })
        }

        // 自分のシールドアップ
        function myShieldUp(targetCard) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "blue", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:targetCard.defense, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(targetCard.ui.x + targetCard.ui.defenseBox.x, targetCard.ui.y + targetCard.ui.defenseBox.y)
                .tweener
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.myStatusBox.x, y: self.myStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    // ステータス変化アニメーション
                    const upNum = Label({text:(targetCard.defense > 0 ? "+" : "") + targetCard.defense, fontSize:30, fontWeight:800, fill: "blue", stroke:"white", strokeWidth: 3});
                    upNum.addChildTo(self).setPosition(self.myStatusBox.x, self.myStatusBox.y - 50)
                    .tweener.by({y:-20, alpha:-1}, 1000)
                    .call(function() {
                        upNum.remove();
                    })
                    .play();
                    param.player.defense += targetCard.defense;
                    refreshMyStatusBox();
                })
                .wait(700)
                .call(function() {
                    ball.remove();
                    resolve();
                })
                .play();
            })
        }

        // 自分の回復
        function myLifeUp(targetCard) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "pink", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:targetCard.point, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(targetCard.ui.x, targetCard.ui.y)
                .tweener
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.myStatusBox.x, y: self.myStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    // ステータス変化アニメーション
                    const upNum = Label({text:"+" + targetCard.point, fontSize:30, fontWeight:800, fill: "blue", stroke:"white", strokeWidth: 3});
                    upNum.addChildTo(self).setPosition(self.myStatusBox.x, self.myStatusBox.y + 30)
                    .tweener.by({y:-20, alpha:-1}, 1000)
                    .call(function() {
                        upNum.remove();
                    })
                    .play();
                    param.player.hp += targetCard.point;
                    refreshMyStatusBox();
                })
                .wait(700)
                .call(function() {
                    ball.remove();
                    resolve();
                })
                .play();
            })
        }

        // 自分へのカードからの攻撃
        function attackToPlayerFromCard(targetCard, damage) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "firebrick", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:damage, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(targetCard.ui.x, targetCard.ui.y)
                .tweener
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.myStatusBox.x, y: self.myStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    self.myStatusBox.tweener.by({y:-20}, 30).by({y:20}, 50)
                    .call(function() {

                        param.player.hp -= damage;

                        // ステータス変化アニメーション
                        const downNum = Label({text:"-" + damage, fontSize:30, fontWeight:800, fill: "firebrick", stroke:"white", strokeWidth: 3});
                        downNum.addChildTo(self).setPosition(self.myStatusBox.x, self.myStatusBox.y + 30)
                        .tweener.by({y:-20, alpha:-1}, 1000)
                        .call(function() {
                            downNum.remove();
                        })
                        .play();

                        refreshMyStatusBox();
                    })
                    .wait(700)
                    .call(function() {
                        ball.remove();
                        resolve();
                    })
                    .play();
                })
                .play();
            })
        }

        // 山札のシャッフル
        function shuffle(targetCard) {
            return Flow(function(resolve) {
                targetCard.ui.tweener
                .wait(100)
                .by({y: -50}, 100)
                .wait(100)
                .call(function() {

                    // 捨て札の山を山札に戻してから、山札をシャッフル
                    Flow(function(resolve) {
                        returnCardToStockFromDiscard(resolve);
                    }).then(function() {
                        // 山札シャッフルアニメーション
                        const text = Label({text:"Shuffle", fontSize:20, fontWeight:800, fill: "white", stroke:"black", strokeWidth: 3});
                        text.addChildTo(self).setPosition(stock.ui.x, stock.ui.y - 30)
                        .tweener.by({y:-40, alpha:0}, 1200)
                        .call(function() {
                            text.remove();
                        })
                        .play();
                        // 山札をシャッフル
                        stock.shuffle();
                    });

                })
                .by({y: 50}, 100)
                .wait(700)
                .call(function() {
                    resolve();
                })
                .play();
            })
        }

        // 山札を攻撃力の高い順にソート
        function sortByAttack(targetCard) {
            return Flow(function(resolve) {
                targetCard.ui.tweener
                .wait(100)
                .by({y: -50}, 100)
                .wait(100)
                .call(function() {
                    // 山札ソートアニメーション
                    const text = Label({text:"Sort", fontSize:20, fontWeight:800, fill: "white", stroke:"black", strokeWidth: 3});
                    text.addChildTo(self).setPosition(stock.ui.x, stock.ui.y - 30)
                    .tweener.by({y:-40, alpha:0}, 1200)
                    .call(function() {
                        text.remove();
                    })
                    .play();
                    // 山札をソート
                    stock.sortByAttack();
                })
                .by({y: 50}, 100)
                .wait(700)
                .call(function() {
                    resolve();
                })
                .play();
            })
        }

        // 「Enemy turn」の文字アニメーション
        function enemyTurnStartAnimation() {
            return Flow(function(resolve) {
                // 手札や場札を捨て札の山へ移動するアニメーションが終わるのを待つために
                // setTimeoutする。Flowだと難しい。
                setTimeout(function() {
                    const box = RectangleShape({
                        width: self.width,
                        height: 400,
                        fill: "rgba(0,0,0,0.5)",
                        stroke: 0,
                    }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());
    
                    const label = Label({text:"Enemy Turn", fontSize: 80, fontWeight: 800, fill:"white"});
                    label.addChildTo(box).setPosition(-500, 0);
                    label.tweener
                    .to({x: 0}, 300, "easeInSine")
                    .wait(800)
                    .to({x: 500}, 300, "easeInSine")
                    .call(function() {
                        box.remove();
                        resolve();
                    })
                    .play();
                }, 500);
            });
        }

        // 「Your Turn」の文字アニメーション
        function yourTurnStartAnimation() {
            return Flow(function(resolve) {
                const box = RectangleShape({
                    width: self.width,
                    height: 400,
                    fill: "rgba(255,255,255,0.3)",
                    strokeWidth: 0,
                }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());

                const label = Label({text:"Your Turn", fontSize: 80, fontWeight: 800, fill:"black", stroke: "white", strokeWidth: 2});
                label.addChildTo(box).setPosition(-500, 0);
                label.tweener
                .to({x: 0}, 300, "easeInSine")
                .wait(800)
                .to({x: 500}, 300, "easeInSine")
                .call(function() {
                    box.remove();
                    resolve();
                })
                .play();
            });
        }

        // 山札からカードを配る
        function dealCards() {

            return Flow(function(resolve) {

                // 山札に4枚無いなら、まず捨て札の山から移す
                if (stock.count() < 4) {
                    Flow(function(resolveReturnCardToStock) {
                        returnCardToStockFromDiscard(resolveReturnCardToStock);
                    }).then(function() {
                        dealAll();
                    });
                    return;
                }

                function addTapEvent(card) {
                    card.ui.setInteractive(true);
                    // card.ui.clear("pointstart");
                    // card.ui.clear("pointend");
                    Draggable.unlock();
                    if (card.dragFlg) {
                        return;
                    }
                    // ドラッグ可能にする
                    card.drag = Draggable().attachTo(card.ui);
                    card.dragFlg = true;
                    card.initialPosition = card.drag.initialPosition;

                    // ドラッグ終了時
                    card.ui.on("dragend", function(e) {

                        if (card.status !== "layout" && card.status !== "hand") {
                            return;
                        }

                        // 座標がドラッグ開始時と同じなら、カード移動ではなくカード詳細画面を開く
                        if (card.initialPosition.x === e.target.position.x && card.initialPosition.y === e.target.position.y) {
                            App.pushScene(CardDetailScene({
                                card: card,
                                cardID: card.id,
                                cardRawID: card.rawID,
                            }));
                            return;
                        }

                        // 場の領域に触れていたら、きちんと場に移動
                        if (card.ui.hitTestElement(self.dropArea)) {
                            setLayoutCard(card);
                            self.dropArea.strokeWidth = 1;
                            // 場に２枚出し切ったのなら
                            if (self.layoutCards[0] !== null && self.layoutCards[1] !== null) {

                                Draggable.lock();

                                // 以下をやりたいが、discardをクリックすると
                                // なぜか以下のpointstartが走るようになってしまうのであきらめた
                                // for (let i = 0; i < cards.length; i++) {
                                //     // 詳細画面は表示させたいので
                                //     cards[i].ui.setInteractive(true);
                                //     cards[i].ui.on("pointstart", function() {
                                //         App.pushScene(CardDetailScene({
                                //             card: cards[i],
                                //             cardID: cards[i].id,
                                //         }));
                                //     });
                                // }
                                self.dropArea.hide();

                                const fade = RectangleShape({
                                    width: turnEndButton.ui.width,
                                    height: turnEndButton.ui.height,
                                    fill: "yellow",
                                    strokeWidth: 0,
                                }).hide().addChildTo(turnEndButton.ui);
                                fade.alpha = 0.8;
                                fade.show().tweener
                                .to({alpha: 0, width: turnEndButton.ui.width + 50, height: turnEndButton.ui.height + 50}, 500, "easeOutCirc")
                                .to({alpha: 0.8, width: turnEndButton.ui.width, height: turnEndButton.ui.height}, 100)
                                .to({alpha: 0, width: turnEndButton.ui.width + 50, height: turnEndButton.ui.height + 50}, 500, "easeOutCirc")
                                .call(function() {
                                    fade.remove();
                                })
                                .play();

                            }
                        } else {
                            // 場の領域に触れていないなら、元の場所に戻す
                            card.ui.tweener.to({x: card.initialPosition.x, y: card.initialPosition.y}, 200)
                            .play();
                        }

                    });

                    // ドラッグ中
                    card.ui.on("drag", function(e) {

                        // 場の領域の線の色を制御
                        if (card.ui.hitTestElement(self.dropArea)) {
                            self.dropArea.strokeWidth = 5;
                        } else {
                            self.dropArea.strokeWidth = 1;
                        }
                    });
                }

                function a() {
                    cards[0] = stock.deal();
                    addTapEvent(cards[0]);
                    cards[0].status = "hand";
                    return dealCardAnimation(cards[0], self.gridX.center() - 240);
                }

                function b() {
                    cards[1] = stock.deal();
                    addTapEvent(cards[1]);
                    cards[1].status = "hand";
                    return dealCardAnimation(cards[1], self.gridX.center() - 80);
                }

                function c() {
                    cards[2] = stock.deal();
                    addTapEvent(cards[2]);
                    cards[2].status = "hand";
                    return dealCardAnimation(cards[2], self.gridX.center() + 80);
                }

                function d() {
                    cards[3] = stock.deal();
                    addTapEvent(cards[3]);
                    cards[3].status = "hand";
                    return dealCardAnimation(cards[3], self.gridX.center() + 240);
                }

                function dealCardAnimation(targetHand, targetX) {
                    return new Promise((resolve) => {
                        targetHand.ui.show();
                        targetHand.ui.addChildTo(self).setPosition(stock.ui.x, stock.ui.y).setScale(0.1);
                        targetHand.ui.tweener.to({x: targetX, y: self.gridY.center(4.2), scaleX: 1, scaleY: 1}, 200)
                        .call(function() {
                            resolve();})
                        .play();
                    });
                }

                function dealAll() {
                    (async () => {
                        await a();
                        await b();
                        await c();
                        await d();
                        resolve();
                    })();
                }

                dealAll();

            });


        }

        // 捨て札の山
        const discard = new CardsUI(null, true);
        discard.ui.addChildTo(this).setPosition(this.gridX.center(-10), this.gridY.center(1));

        // カードを捨て札の山に送るアニメーション
        function moveCardToDiscard(targetCard) {
            targetCard.ui.tweener.to({
                x: discard.ui.x,
                y: discard.ui.y,
                scaleX: 0.1,
                scaleY:0.1}, 200)
            .call(() => {
                discard.add(targetCard);
                targetCard.status = "discard";
                // いろいろ初期化
                targetCard.ui.hide();
                targetCard.ui.setScale(1);
                // targetCard.ui.clear("pointstart");
            })
            .play();
        }

        // 手札、場札、捨て札の３か所のカードを山札に戻す
        // アニメーションなし
        function returnAllCards() {

            // 手札のすべてを捨て札の山へ
            for (let i = 0; i < 4; i++) {
                if (cards[i]) {
                    cards[i].status === "hand" && discard.add(cards[i]);
                }
            }

            // 場札を捨て札の山へ
            for (let i = 0; i < 2; i++) {
                if (self.layoutCards[i]) {
                    discard.add(self.layoutCards[i]);
                }
            }

            // 捨て札
            let max = discard.count();
            for (let i = 0; i < max; i++) {
                const card = discard.deal();      
                card.reset();
                stock.add(card);
            }
        }

        // 捨て札の山から山札にカードを戻す
        function returnCardToStockFromDiscard(resolve) {
            function returnCard(isLastCard/* 最後のカード？ */) {
                const targetCard = discard.deal();
                const miniCard = RectangleShape({
                    width: 32,
                    height: 64,
                    fill: "white",
                    stroke: "black",
                    strokeWidth: 3,
                });
                miniCard.addChildTo(self).setPosition(discard.ui.x, discard.ui.y)
                    .tweener.to({
                        x: stock.ui.x,
                    }, 100)
                    .call(function() {
                        miniCard.remove();
                        stock.add(targetCard);
                        if (isLastCard && resolve) {
                            resolve();
                        }
                    })
                    .play();
            }
            const max = discard.count();
            let i = 0;
            function pio() {
                setTimeout(function() {
                    if (i === max - 1) {
                        returnCard(true);
                        return;
                    }
                    returnCard();
                    i += 1;
                    pio();
                }, 50);
            }
            if (max > 0) {
                pio();
            }
            if (max === 0) {
                resolve();
            }
        }

        // カードを場札置き場に移動する
        function moveToLayoutBox(targetCard) {
            let layoutBox;
            if (!self.layoutCards[0]) {
                layoutBox = self.layoutBox1;
                self.layoutCards[0] = targetCard;
            } else if (!self.layoutCards[1]) {
                layoutBox = self.layoutBox2;
                self.layoutCards[1] = targetCard;
            } else {
                throw("この関数に入る前にチェックすること");
            }
            targetCard.status = "layout";
            return Flow(function(resolve) {
                targetCard.ui.tweener.to({
                    x: layoutBox.x,
                    y: layoutBox.y,
                }, 200)
                .call(function() {resolve();})
                .play();
            });
        }

        function setLayoutCard(targetCard) {

            // 場札が一杯なら出せない
            if (self.layoutCards[0] !== null && self.layoutCards[1] !== null) {
                return;
            }
            
            moveToLayoutBox(targetCard).then(function() {

                // 場に出した時に発動するスキルを処理
                if (targetCard.skill === "攻撃力２倍") {
                    for (let i = 0; i < 4; i++) {
                        cards[i].attackUp(cards[i].attack);
                    }
                } else if (targetCard.skill === "防御力２倍") {
                    for (let i = 0; i < 4; i++) {
                        cards[i].defenseUp(cards[i].defense);
                    }
                } else if (targetCard.skill === "攻撃力防御力２倍") {
                    for (let i = 0; i < 4; i++) {
                        cards[i].attackUp(cards[i].attack >= 0 ? cards[i].attack : cards[i].attack * -1);
                        cards[i].defenseUp(cards[i].defense >= 0 ? cards[i].defense : cards[i].defense * -1);
                    }
                } else if (targetCard.skill === "回復") {
                    myLifeUp(targetCard);
                } else if (targetCard.skill === "シャッフル") {
                    shuffle(targetCard);
                } else if (targetCard.skill === "攻撃力ソート") {
                    sortByAttack(targetCard);
                }

                // targetCard.ui.clear("pointstart");
                // const id = targetCard.id;
                // targetCard.ui.on("pointstart", function() {
                //     if (waiting) return;
                //     App.pushScene(CardDetailScene({
                //         cardID: id,
                //     }));
                // });
                targetCard = null;
            });

        }

        // ターン終了ボタン
        const turnEndButton = new BasicButton({text: "TURN END", width: 300, height: 70, dark: true});
        turnEndButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(15))
        .setInteractive(true)
        .on("pointstart", function() {

            if (waiting) return;

            endOfMyTurn();

        })
        .hide();

        // 自分のターン終了
        function endOfMyTurn() {

            waiting = true;

            turnEndButton.ui.hide();

            // 場札の１番目の処理が終わってから
            playLayoutCard(0).then(function () {
                if (isGameWin()) return;
                // 場札の２番目を処理して
                playLayoutCard(1).then(function() {
                    if (isGameWin()) return;
                    // すべてのカードを捨て札の山へ移動
                    moveToDiscardAll();

                    startEnemyTurn();
                });
            });
        }

        // 敵のターン開始
        function startEnemyTurn() {
            self.dropArea.hide();
            self.layoutBox1.hide();
            self.layoutBox2.hide();
            enemyTurnStartAnimation().then(function() {
                // 敵のステータスをリフレッシュして再描画
                param.enemy.turnBegin();
                refreshEnemyStatusBox();
                doEnemyAction(0).then(function() {
                    if (isGameOver()) return;
                    doEnemyAction(1).then(function() {
                        if (isGameOver()) return;
                        doEnemyAction(2).then(function() {
                            if (isGameOver()) return;
                            startMyTurn();
                        });
                    });
                });
            });
        }

        // GameWin確認
        function isGameWin() {
            if (param.enemy.hp === 0) {
                waiting = false;
                enemyImage.tweener
                    .to({alpha:0},10).wait(50).to({alpha:1},10).wait(50)
                    .to({alpha:0},10).wait(50).to({alpha:1},10).wait(50)
                    .to({alpha:0},10).wait(30).to({alpha:1},10).wait(30)
                    .to({alpha:0},10).wait(30).to({alpha:1},10).wait(30)
                    .to({alpha:0},10).wait(10).to({alpha:1},10).wait(10)
                    .to({alpha:0},10).wait(10).to({alpha:1},10).wait(10)
                    .to({alpha:0},10).wait(10).to({alpha:1},10).wait(10)
                    .to({alpha:0},10).wait(10).to({alpha:1},10).wait(10)
                    .to({alpha:0},10).wait(10).to({alpha:1},10).wait(10)
                    .to({alpha:0},10).wait(10).to({alpha:1},10).wait(10)
                    .to({alpha:0},300)
                    .wait(500)
                    .call(function() {
                        const fadeOut = RectangleShape({
                            width: self.width,
                            height: self.height,
                            fill: "black",
                        }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());
                        fadeOut.alpha = 0;
                        fadeOut.tweener.to({alpha:1}, 1000)
                        .call(function() {
                            returnAllCards();
                            self.exit("GetItemScene", {items: param.items});
                        })
                        .play();
                    })
                    .play();
                return true;
            }
            return false;
        }

        // GameOver確認
        function isGameOver() {
            if (param.player.hp === 0) {
                returnAllCards();
                waiting = true;

                const fade = RectangleShape({
                    width: self.width,
                    height: self.height,
                    fill: "darkred",
                }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());
                fade.alpha = 0.1;
                Label({
                    text: "GAME\nOVER",
                    fontSize: 150,
                    fontWeight: 800,
                    fill: "darkred",
                    stroke: "white",
                    strokeWidth: 20,
                }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());
        
                self.on("pointstart", function() {
                    self.exit("ResultScene");
                    waiting = false;
                });
        
                fade.tweener.to({alpha: 0.8}, 5000);

                return true;
            }
            return false;
        }

        // 自分のターン開始
        function startMyTurn() {

            waiting = true;

            // 敵の次のアクションを表示
            param.enemy.turnEnd();
            drawAllEnemyActions(param.enemy.getAction());

            yourTurnStartAnimation().then(function() {
                param.player.turnBegin();
                refreshMyStatusBox();
                dealCards().then(function() {
                    // カードを配り終えた時点で発動するスキルを処理
                    doSkill(cards[0]).then(function() {
                        if (isGameOver()) return;
                        doSkill(cards[1]).then(function() {
                            if (isGameOver()) return;
                            doSkill(cards[2]).then(function() {
                                if (isGameOver()) return;
                                doSkill(cards[3]).then(function() {
                                    if (isGameOver()) return;
                                    self.dropArea.show();
                                    self.layoutBox1.show();
                                    self.layoutBox2.show();
                                    turnEndButton.ui.show();
                                    waiting = false;
                                });
                            });
                        });
                    });
                });

                // カードを配り終えた時点で発動するスキル
                function doSkill(card) {
                    return Flow(function(resolve) {
                        if (card.skill === "ドロー回復") {
                            card.ui.tweener
                            .by({y: -30}, 200)
                            .call(function() {
                                myLifeUp(card);
                            })
                            .by({y: 30}, 200)
                            .call(function() {
                                resolve();
                            })
                            .play();
                        } else if (card.skill === "攻撃力ランダム") {
                            card.attackUp(Math.floor(Math.random() * card.point));
                            resolve();
                        } else if (card.skill === "自ダメージ") {
                            card.ui.tweener
                            .by({y: -30}, 200)
                            .call(function() {
                                attackToPlayerFromCard(card, card.point).then(function() {
                                    resolve();
                                });
                            })
                            .by({y: 30}, 200)
                            .play();
                        } else {
                            resolve();
                        }
                    });
                }
            });
        }

        function moveToDiscardAll() {
            // 手札のすべてを捨て札の山へ
            for (let i = 0; i < 4; i++) {
                // カードのパラメータを元に戻してから
                cards[i].reset();
                cards[i].status === "hand" && moveCardToDiscard(cards[i]);
            }

            // 場札を捨て札の山へ
            for (let i = 0; i < 2; i++) {
                const targetCard = self.layoutCards[i];
                if (targetCard) {
                    targetCard.reset();
                    moveCardToDiscard(targetCard);
                    self.layoutCards[i] = null;
                }
            }
        }

        // 場札１枚ごとの処理
        function playLayoutCard(index) {

            return Flow(function(resolve) {
                const  targetCard = self.layoutCards[index];

                if (targetCard === null) {
                    resolve();
                    return;
                }

                // 敵への攻撃処理
                function attackToEnemyFlow(targetCard) {
                    return new Promise(function(attackResolve) {
                        if (targetCard.attack > 0) {
                            attackToEnemy(targetCard)
                            .then(function() {attackResolve()});
                        } else {
                            attackResolve();
                        }
                    });
                }

                // 自分のシールド追加処理
                function shieldUpToMeFlow(targetCard) {
                    return new Promise(function(shieldResolve) {
                        if (targetCard.defense !== 0) {
                            myShieldUp(targetCard)
                            .then(function() {shieldResolve();});
                        } else {
                            shieldResolve();
                        }
                    });
                }

                Promise.all([
                    attackToEnemyFlow(targetCard),
                    shieldUpToMeFlow(targetCard),
                ])
                .then(function() {
                    resolve();
                });
    
            });
        }

        // ゲーム開始前の準備
        function setup() {
            return Flow(function(resolve) {
                enemyImage.tweener
                .wait(200)
                .to({scaleX:1, scaleY:1, alpha: 1}, 500, "easeInExpo")
                .call(function() {
                    self.myStatusBox.tweener
                    .wait(500)
                    .to({x: self.gridX.span(2)}, 200)
                    .call(function() {
                        stock.ui.tweener.to({x:self.gridX.center(6)}, 200).play();
                        discard.ui.tweener.to({x:self.gridX.center(-6)}, 200).play();
                    })
                    .wait(500)
                    .call(function() {
                        resolve();
                    })
                    .play();
                })
                .play();
            });
        }
    
        // ゲーム開始
        waiting = true;
        param.player.defense = 0;
        setTimeout(function() {
            setup().then(function() {
                startMyTurn();
            });
        }, 10);
        

    },
});
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
phina.define('CardDetailScene', {
    superClass: 'DisplayScene',
    init: function(param /*{card: Card, cardID:String, cardRawID: string, button1:{text:String, callback:func}, button2:{text:String, callback:func}, returnObj: {}}*/) {
        this.superInit(param);

        const self = this;

        this.backgroundColor = "rgba(0,0,0,0.8)";

        let height;
        let cardY;
        let button1Y;
        let closeButtonY;

        if (!param.button1 && !param.button2) {
            height = 600;
            cardY = this.gridY.center(-1);
            closeButtonY = this.gridY.center(3.8);
        } else if (param.button1 && !param.button2) {
            height = 700;
            cardY = this.gridY.center(-2);
            button1Y = this.gridY.center(3);
            closeButtonY = this.gridY.center(5);
        }

        const dialog = RectangleShape({
            width: 500,
            height: height,
            fill: "black",
            stroke: "white",
            strokeWidth: 2,
            cornerRadius: 5,
            shadow: "white",
            shadowBlur: 10,
           }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        const card = new Card(param.cardID, true);

        if (param.card && param.card.rawID) {
            card.rawID = param.card.rawID;
        }

        card.ui.addChildTo(this).setPosition(this.gridX.center(), cardY);

        if (param.button1) {
            // ボタン１
            const button1 = new BasicButton({
                width: 200,
                height: 50,
                text: param.button1.text,
                dark: true,
                primary: true,
            });
            button1.ui.addChildTo(this).setPosition(this.gridX.center(), button1Y);
            button1.ui.setInteractive(true);
            button1.ui.on("pointstart", function() {
                param.returnObj && (param.returnObj.tobeExit = true);
                if (param.button1.callback) {
                    param.button1.callback(card);
                    self.exit();
                }
            });
        }

        // closeボタン
        const closeButton = Sprite("close");
        closeButton.addChildTo(this).setPosition(this.gridX.center(), closeButtonY);
        closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            self.exit();
        });
    },
});
phina.define('CardPlusScene', {
    superClass: 'DisplayScene',
    init: function(param/*{items}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "black";

        //@@@@@@@@@@@
        // const myCards = new Cards();
        // myCards.createNewCards();
        //@@@@@@@@@@@

        const effect = Sprite("effect1").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center()).hide();
        effect.alpha = 0;

        let selectCard1 = null;
        let selectCard2 = null;

        let copyCard1 = null;
        let copyCard2 = null;

        this.on("resume", function() {
            if (selectCard1) {
                if (copyCard1) {copyCard1.ui.remove();}
                copyCard1 = new Card(selectCard1.id, true);
                copyCard1.ui.addChildTo(self).setPosition(this.gridX.center(-4), this.gridY.center(-2));
            }
            if (selectCard2) {
                if (copyCard2) {copyCard2.ui.remove();}
                copyCard2 = new Card(selectCard2.id, true);
                copyCard2.ui.addChildTo(self).setPosition(this.gridX.center(4), this.gridY.center(-2));
            }
        });

        // カード置き場１
        self.layoutBox1 = RectangleShape({
            width: 260 + 10,
            height: 390 + 10,
            fill: "rgba(0, 0, 0, 0.2)",
            stroke: "yellow",
            strokeWidth: 1,
        }).addChildTo(this).setPosition(this.gridX.center(-4), this.gridY.center(-2));
        self.layoutBox1.setInteractive(true);
        self.layoutBox1.on("pointstart", function() {
            App.pushScene(CardsListScene({
                cards: myCards,
                button1: {
                    text: "決定",
                    callback: function(card) {
                        selectCard1 = card;
                    },
                },
                hideFunc: function(card) {
                    const rawID1 = !!selectCard1 ? selectCard1.rawID : "";
                    const rawID2 = !!selectCard2 ? selectCard2.rawID : "";
                    return card.rawID === rawID1 || card.rawID === rawID2;
                },
                selectableFunc: function(card) {
                    // ２枚目が未選択の場合
                    if (selectCard2 === null) {
                        // このカードが材料であるルールを抽出
                        const rules = cardEvolutionRules.filter(function(rule) {
                            return rule.in1 === card.id || rule.in2 === card.id;
                        });
                        // もう一方のカードを持っているならOK
                        return rules.some(function(rule) {
                            let otherCardID = null;
                            if (rule.in1 === card.id) {
                                otherCardID = rule.in2;
                            } else {
                                otherCardID = rule.in1;
                            }
                            if (otherCardID === card.id) {
                                // 同じカード同士の合成の場合、２枚持っていること
                                const sameCards = myCards.list.filter(function(card2) {
                                    return card2.id === card.id;
                                });
                                return sameCards.length >= 2;
                            } else {
                                return myCards.list.some(function(card2) {
                                    return card2.id === otherCardID;
                                });
                            }
                        });
                    }
                    // ２枚目と合成可能なカードだけ
                    return cardEvolutionRules.some(function(rule) {
                        return (rule.in1 === card.id && rule.in2 === selectCard2.id) ||
                        (rule.in1 === selectCard2.id && rule.in2 === card.id);
                    });
                }
            }));
        });
        Label({text:"Card1", fill:"yellow"}).addChildTo(self.layoutBox1).setPosition(0, 0);

        // カード置き場２
        self.layoutBox2 = RectangleShape({
            width: 260 + 10,
            height: 390 + 10,
            fill: "rgba(0, 0, 0, 0.2)",
            stroke: "yellow",
            strokeWidth: 1,
        }).addChildTo(this).setPosition(this.gridX.center(4), this.gridY.center(-2));
        self.layoutBox2.setInteractive(true);
        self.layoutBox2.on("pointstart", function() {
            App.pushScene(CardsListScene({
                cards: myCards,
                button1: {
                    text: "決定",
                    callback: function(card) {
                        selectCard2 = card;
                    },
                },
                hideFunc: function(card) {
                    const rawID1 = !!selectCard1 ? selectCard1.rawID : "";
                    const rawID2 = !!selectCard2 ? selectCard2.rawID : "";
                    return card.rawID === rawID1 || card.rawID === rawID2;
                },
                selectableFunc: function(card) {
                    // １枚目が未選択の場合
                    if (selectCard1 === null) {
                        // このカードが材料であるルールを抽出
                        const rules = cardEvolutionRules.filter(function(rule) {
                            return rule.in1 === card.id || rule.in2 === card.id;
                        });
                        // もう一方のカードを持っているならOK
                        return rules.some(function(rule) {
                            let otherCardID = null;
                            if (rule.in1 === card.id) {
                                otherCardID = rule.in2;
                            } else {
                                otherCardID = rule.in1;
                            }
                            if (otherCardID === card.id) {
                                // 同じカード同士の合成の場合、２枚持っていること
                                const sameCards = myCards.list.filter(function(card2) {
                                    return card2.id === card.id;
                                });
                                return sameCards.length >= 2;
                            } else {
                                return myCards.list.some(function(card2) {
                                    return card2.id === otherCardID;
                                });
                            }
                        });
                    }
                    // １枚目と合成可能なカードだけ
                    return cardEvolutionRules.some(function(rule) {
                        return (rule.in1 === selectCard1.id && rule.in2 === card.id) ||
                        (rule.in1 === card.id && rule.in2 === selectCard1.id);
                    });
                }
            }));
        });
        Label({text:"Card2", fill:"yellow"}).addChildTo(self.layoutBox2).setPosition(0, 0);

        const okButton = new BasicButton({
            width: 200,
            height: 80,
            text: "合成する\n（魔石１消費）",
            dark: true,
            primary: true,
        });
        okButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(4));
        okButton.ui.on("pointstart", function() {
            if (!copyCard1 || !copyCard2) {
                return;
            }

            okButton.ui.hide();
            closeButton.hide();

            self.layoutBox1.remove();
            self.layoutBox2.remove();

            function commonEffect() {
                return Flow(function(resolve) {

                    effect.show().tweener.to({alpha: 1}, 4000)
                    .call(function() {resolve();}).play();

                    copyCard1.ui.tweener
                    .to({x: self.gridX.center(-3), alpha: 0.6}, 800, "easeInOutBack")
                    .to({x: self.gridX.center(-1), alpha: 0.4}, 800, "easeInOutBack")
                    .to({x: self.gridX.center(), alpha: 0.2}, 800, "easeInOutBack")
                    .rotateBy(4, 50).rotateBy(-4, 50).rotateBy(4, 50).rotateBy(-4, 50)
                    .rotateBy(4, 50).rotateBy(-4, 50).rotateBy(4, 50).rotateBy(-4, 50)
                    .rotateBy(3, 50).rotateBy(-3, 50).rotateBy(3, 50).rotateBy(-3, 50)
                    .rotateBy(3, 50).rotateBy(-3, 50).rotateBy(3, 50).rotateBy(-3, 50)
                    .rotateBy(2, 50).rotateBy(-2, 50).rotateBy(2, 50).rotateBy(-2, 50)
                    .rotateBy(2, 50).rotateBy(-2, 50).rotateBy(2, 50).rotateBy(-2, 50)
                    .rotateBy(1, 50).rotateBy(-1, 50).rotateBy(1, 50).rotateBy(-1, 50)
                    .rotateBy(1, 50).rotateBy(-1, 50).rotateBy(1, 50).rotateBy(-1, 50)
                    .play();
        
                    copyCard2.ui.tweener
                    .to({x: self.gridX.center(3), alpha: 0.6}, 800, "easeInOutBack")
                    .to({x: self.gridX.center(1), alpha: 0.4}, 800, "easeInOutBack")
                    .to({x: self.gridX.center(), alpha: 0.2}, 800, "easeInOutBack")
                    .rotateBy(-4, 50).rotateBy(4, 50).rotateBy(-4, 50).rotateBy(4, 50)
                    .rotateBy(-4, 50).rotateBy(4, 50).rotateBy(-4, 50).rotateBy(4, 50)
                    .rotateBy(-3, 50).rotateBy(3, 50).rotateBy(-3, 50).rotateBy(3, 50)
                    .rotateBy(-3, 50).rotateBy(3, 50).rotateBy(-3, 50).rotateBy(3, 50)
                    .rotateBy(-2, 50).rotateBy(2, 50).rotateBy(-2, 50).rotateBy(2, 50)
                    .rotateBy(-2, 50).rotateBy(2, 50).rotateBy(-2, 50).rotateBy(2, 50)
                    .rotateBy(-1, 50).rotateBy(1, 50).rotateBy(-1, 50).rotateBy(1, 50)
                    .rotateBy(-1, 50).rotateBy(1, 50).rotateBy(-1, 50).rotateBy(1, 50)
                    .play();
                });
            }

            commonEffect().then(function() {
                effect.remove();

                const newCardID = getNewCardID(copyCard1.id, copyCard2.id);

                copyCard1.ui.remove();
                copyCard2.ui.remove();
                const newCard = new Card(newCardID, true);
                newCard.ui.addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(-2));
                myCards.add(new Card(newCardID));
                myCards.remove(selectCard1.rawID);
                myCards.remove(selectCard2.rawID);

                player.stone -= 1;

                // closeボタン
                const closeButton = Sprite("close");
                closeButton.addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(5));
                closeButton.clear("pointstart");
                closeButton.setInteractive(true);
                closeButton.on("pointstart", function() {
                    self.exit("MainScene");
                });

            });
        });

        function getNewCardID(cardID1, cardID2) {
            for (let i = 0; i < cardEvolutionRules.length; i++) {
                const rule = cardEvolutionRules[i];
                if ((rule.in1 === cardID1 && rule.in2 === cardID2) || (rule.in1 === cardID2 && rule.in2 === cardID1)) {
                    return rule.out;
                }
            }
            return null;
        }



        const closeButton = Sprite("close");
        closeButton.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(7));
        closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            self.exit("MainScene");
        });

    },
});

const cardEvolutionRules = [
    {
        in1: "02",  // サバキ
        in2: "13",  // 頭を叩く
        out: "20",  // フリカワリ
    },
    {
        in1: "14",  // エグリ
        in2: "00",  // トビ
        out: "21",  // 打ち込み
    },
    {
        in1: "01",  // オシツブシ
        in2: "12",  // 眼を取る
        out: "22",  // 両ニラミ
    },
    {
        in1: "16",  // シボリ
        in2: "17",  // ホウリコミ
        out: "23",  // 石塔シボリ
    },
    {
        in1: "15",  // ハネ
        in2: "15",  // ハネ
        out: "24",  // 二段バネ
    },
    {
        in1: "05",  // ハネ返す
        in2: "06",  // シノギ
        out: "25",  // 捨てる
    },
    {
        in1: "03",  // ハイ
        in2: "10",  // スベリ
        out: "26",  // 根拠を奪う
    },
    {
        in1: "04",  // ブツカリ
        in2: "11",  // キリ
        out: "27",  // 薄みをとがめる
    },
    {
        in1: "26",  // 根拠を奪う
        in2: "27",  // 薄みをとがめる
        out: "30",  // 急所を突く
    },
    {
        in1: "07",  // コスミ
        in2: "22",  // 両ニラミ
        out: "31",  // 秀策のコスミ
    },
    {
        in1: "20",  // フリカワリ
        in2: "54",  // 形勢判断
        out: "34",  // 手抜き
    },
    {
        in1: "53",  // 長考
        in2: "55",  // 捨て石
        out: "35",  // 定石外れ
    },
    {
        in1: "25",  // 捨てる
        in2: "11",  // キリ
        out: "36",  // 石の下
    },
    {
        in1: "35",  // 定石外れ
        in2: "53",  // 長考
        out: "37",  // 鬼手
    },
    {
        in1: "37",  // 鬼手
        in2: "56",  // 魔手
        out: "38",  // 耳赤の一手
    },
    {
        in1: "40",  // 休憩
        in2: "40",  // 休憩
        out: "41",  // 諦めない心
    },
    {
        in1: "21",  // 打ち込み
        in2: "55",  // 捨て石
        out: "50",  // 迫力
    },
    {
        in1: "31",  // 秀策のコスミ
        in2: "32",  // 鉄柱
        out: "51",  // 厚み
    },
    {
        in1: "40",  // 休憩
        in2: "54",  // 形勢判断
        out: "52",  // 流れを変える
    },
    {
        in1: "54",  // 形勢判断
        in2: "52",  // 流れを変える
        out: "56",  // 魔手
    },

];
phina.define('CardPresenterScene', {
    superClass: 'DisplayScene',
    init: function(param/*{card1id:string, card2id:string}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "black";

        //@@@@@@@@@@@
        // const myCards = new Cards();
        // myCards.createNewCards();

        // param.card1id = "01";
        // param.card2id = "02";
        //@@@@@@@@@@@

        const back = Sprite("npc1").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        function step1() {
            const serifuBox = RectangleShape({
                width: 450,
                height: 60,
                fill: "rgba(0,0,0,0.7)",
                strokeWidth: 0,
            }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center())
            Label({
                text: "「好きな方を持っていきなさい」",
                fill: "white",
                fontSize: 30,
            }).addChildTo(serifuBox).setPosition(0, 0);
            self.on("pointstart", function() {
                serifuBox.remove();
                self.clear("pointstart");
                step2();
            })
        }

        function step2() {
            const card1 = new Card(param.card1id, true);
            card1.ui.addChildTo(self).setPosition(self.gridX.center(-4), self.gridY.center());
            card1.ui.setInteractive(true);
            card1.ui.on("pointstart", function() {
                cardSelect(card1, card2).then(function() {
                    step3();
                });
            });
            const card2 = new Card(param.card2id, true);
            card2.ui.addChildTo(self).setPosition(self.gridX.center(4), self.gridY.center());
            card2.ui.setInteractive(true);
            card2.ui.on("pointstart", function() {
                cardSelect(card2, card1).then(function() {
                    step3();
                });
            });
    
        }

        function cardSelect(selected, unselected) {
            return Flow(function(resolve) {
                myCards.add(new Card(selected.id));
                unselected.ui.remove();
                selected.ui.tweener
                    .to({x: self.gridX.center()}, 300)
                    .wait(500)
                    .to({alpha: 0}, 300)
                    .wait(300)
                    .call(function() {
                        selected.ui.remove();
                        resolve();
                    })
                    .play();
            });
        }

        function step3() {
            const serifuBox = RectangleShape({
                width: 300,
                height: 60,
                fill: "rgba(0,0,0,0.7)",
                strokeWidth: 0,
            }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center())
            Label({
                text: "「よい旅を」",
                fill: "white",
                fontSize: 30,
            }).addChildTo(serifuBox).setPosition(0, 0);

            self.on("pointstart", function() {
                self.exit("MainScene");
            });
        }

        step1();


    },
});
function Cards() {
    const self = this;

    const list = [];
    self.list = list;

    self.createNewCards = function() {
        self.add(new Card("00"));
        self.add(new Card("01"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("06"));
        self.add(new Card("07"));

        self.add(new Card("10"));
        self.add(new Card("11"));
        self.add(new Card("12"));
        self.add(new Card("13"));
        self.add(new Card("14"));
        self.add(new Card("15"));
        self.add(new Card("16"));
        self.add(new Card("17"));

        // self.add(new Card("20"));
        // self.add(new Card("21"));
        // self.add(new Card("22"));
        // self.add(new Card("23"));
        // self.add(new Card("24"));
        // self.add(new Card("25"));
        // self.add(new Card("26"));
        // self.add(new Card("27"));

        // self.add(new Card("30"));
        // self.add(new Card("31"));
        // self.add(new Card("32"));
        // self.add(new Card("33"));
        // self.add(new Card("34"));
        // self.add(new Card("35"));
        // self.add(new Card("36"));
        // self.add(new Card("37"));
        // self.add(new Card("38"));

        // self.add(new Card("40"));
        // self.add(new Card("41"));

        self.add(new Card("50"));    // 迫力
        // self.add(new Card("51"));
        // self.add(new Card("52"));
        // self.add(new Card("53"));
        // self.add(new Card("54"));
        // self.add(new Card("55"));
        // self.add(new Card("56"));

        // self.add(new Card("90"));
        // self.add(new Card("91"));
        // self.add(new Card("92"));

    };

    self.add = function(card) {
        list.push(card);
    };

    self.count = function() {
        return list.length;
    };

    self.remove = function(targetCardRawID) {
        const index = list.findIndex(function(card) {
            return card.rawID === targetCardRawID;
        });

        if (index < 0) return;

        list.splice(index, 1);
    };

    self.shuffle = function() {
        list.sort(() => Math.random() - 0.5);
    };

}phina.define('CardsListScene', {
    superClass: 'DisplayScene',
    init: function(param/*{cards: Cards, button1: function, hideFunc:function, selectableFunc:function*/) {
        this.superInit(param);

        const self = this;

        // const cards = param.cards;

        const cards = {list: []};

        param.cards.list.forEach(function(card) {
            cards.list.push(new Card(card.id, false, card.rawID));
        });

        self.backgroundColor = "black";

        const cardListArea = RectangleShape({
            width: this.width,
            // height: this.gridY.unitWidth * 14,
            height: this.height,
            fill: "black",
            strokeWidth: 0,
        }).addChildTo(self).setOrigin(0,0).setPosition(-5,-5);

        const scrollable = Scrollable().attachTo(cardListArea);
        scrollable.setScrollType('y').enableClip();
        scrollable.setMaxY(0);
        if (Math.ceil(cards.list.length / 4) >= 4) {
            scrollable.setMinY(-1 * Math.ceil(cards.list.length / 4) * 250 + cardListArea.height - 120);
        } else {
            scrollable.setMinY(0);
        }

        const layer = DisplayElement().addChildTo(cardListArea).setPosition(0,0);

        let col = 1;
        let row = 0;
        for (let i = 0; i < cards.list.length; i++) {

            if (i % 4 === 0) {
                row += 1;
            }

            col = (i % 4) * 150 + 100;

            cards.list[i].ui.addChildTo(layer).setPosition(col, row * 250 - 100);
            // cards.list[i].ui.clear("pointstart");
            // cards.list[i].ui.clear("pointmove");
            // cards.list[i].ui.clear("pointend");

            if (param.hideFunc && param.hideFunc(cards.list[i])) {
                cards.list[i].ui.hide();
                continue;
            }
            cards.list[i].ui.show();

            if (param.selectableFunc && param.selectableFunc(cards.list[i]) === false) {
                cards.list[i].ui.alpha = 0.3;
                continue;
            }

            cards.list[i].ui.setInteractive(true);

            let pointStartDy;

            cards.list[i].ui.on("pointstart", function(e) {
                pointStartDy = e.pointer.y;
            });

            // cards.list[i].ui.clear("pointend");
            cards.list[i].ui.on("pointend", function(e) {

                if (param.disableCards && param.disableCards.some(function(card) {
                    return cards.list[i] === card;
                })) {
                    return;
                }
    
                // Y座標が同じなら、タップしたと判定
                if (pointStartDy !== e.pointer.y) {
                    return;
                }
                App.pushScene(CardDetailScene({
                    card: cards.list[i],
                    cardID: cards.list[i].id,
                    cardRawId: cards.list[i].rawID,
                    button1: param.button1,
                    returnObj: returnObj,
                }));
            });

        }

        const returnObj = {};

        this.on("resume", function() {
            if (returnObj.tobeExit) {
                clean();
                self.exit();
            }
        });

        const closeButton = Sprite("close");
        closeButton.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(15));
        // closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            clean();
            self.exit();
        });

        function clean() {
            // いろいろ元にもどす
            for (let i = 0; i < cards.list.length; i++) {
                cards.list[i].ui.show();
                cards.list[i].ui.alpha = 1;
                // cards.list[i].ui.clear("pointstart");
                // cards.list[i].ui.clear("pointend");
            }
        }

    },
});
function CardsUI(cards /* Cards */, isDiscard /* bool */) {
    const self = this;

    if (!cards) {
        cards = new Cards();
    }

    const list = [];

    cards.list.forEach(function(card) {
        list.push(new Card(card.id));
    });

    self.list = list;

    self.ui = RectangleShape({
        width: 64 + 20,
        height: 64 + 40,
        fill: "rgba(0,0,0,0.5)",
        stroke: 0,
    });

    let image;
    if (!isDiscard) {
        image = Sprite("stock").addChildTo(self.ui).setPosition(0, 10);
    } else {
        image = Sprite("discard").addChildTo(self.ui).setPosition(0, 10);
    }

    self.ui.setInteractive(true);
    self.ui.on("pointstart", function() {
        if (waiting) return;
        const cards = {};
        cards.list = list;
        App.pushScene(CardsListScene({cards: cards}));
    });

    const cardNumLabel = Label({
        text: "0",
        fill: "white",
        fontSize: 20,
    }).addChildTo(self.ui).setPosition(0, -35);


    self.add = function(card) {
        list.push(new Card(card.id, false, card.rawID));
        refreshCardNumLabel();
    };

    self.addRandom = function(card) {
        const c = new Card(card.id, false, card.rawID);
        list.splice(Math.floor(Math.random() * (list.length + 1)), 0, c);
    }

    self.count = function() {
        return list.length;
    };

    self.deal = function() {
        if (self.count() === 0) {
            return null;
        }
        const ret = list.shift();
        refreshCardNumLabel();
        return new Card(ret.id, false, ret.rawID);
    };

    self.clear = function() {
        const ret = list.map((c) => c);
        list = [];
        return ret;
    };

    self.shuffle = function() {
        for (let i = list.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
    };

    self.sortByAttack = function() {
        list.sort((a, b) => b.attack - a.attack);
    };

    function refreshCardNumLabel() {
        cardNumLabel.text = self.count();
    }

    refreshCardNumLabel();

}function Enemy(id) {
    const self = this;

    let actionIndex = -1;

    // 自分のターンになったら呼ぶ
    self.turnBegin = function() {
        // シールドは毎ターン、基本値にもどる
        self.defense = self.defaultDefense;
    };

    // 自分のターンが終わったら呼ぶ
    self.turnEnd = function() {
        actionIndex += 1;
        if (self.actions.length - 1 < actionIndex) {
            actionIndex = 0;
        }
    };

    self.getAction = function() {
        return self.actions[actionIndex];
    };

    // 敵ステータス決定
    switch (id) {
        case "01":
            self.hp = 4;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster01";
            self.actions = [
                [{
                    name: "attack",
                    point: 1,
                }],
                [{
                    name: "life",
                    point: 1,
                }],
            ];
            break;
        case "02":
            self.hp = 3;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster02";
            self.actions = [
                [{
                    name: "attack",
                    point: 1,
                }],
                [{
                    name: "attack",
                    point: 1,
                },{
                    name: "defense",
                    point: 1,
                }],
                [{
                    name: "life",
                    point: 2,
                }]
            ];
            break;
        case "03":
            self.hp = 3;
            self.defense = 2;
            self.defaultDefense = 0;
            self.img = "monster03";
            self.actions = [
                [{
                    name: "defense",
                    point: 2,
                }],
                [{
                    name: "defense",
                    point: 2,
                }],
                [{
                    name: "attack",
                    point: 3,
                }],
            ];
            break;
        case "04":
            self.hp = 5;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster04";
            self.actions = [
                [{
                    name: "attack",
                    point: 2,
                }],
            ];
            break;
        case "05":
            self.hp = 3;
            self.defense = 2;
            self.defaultDefense = 0;
            self.img = "monster05";
            self.actions = [
                [{
                    name: "defense",
                    point: 2,
                },{
                    name: "card",
                    point: "90",    // アキ三角
                }],[{
                    name: "attack",
                    point: 2,
                },{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "defense",
                    point: 2,
                }],
            ];
            break;
        case "06":
            self.hp = 5;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster06";
            self.actions = [
                [{
                    name: "attack",
                    point: 3,
                }],
            ];
            break;
        case "07":
            self.hp = 5;
            self.defense = 2;
            self.defaultDefense = 0;
            self.img = "monster07";
            self.actions = [
                [{
                    name: "card",
                    point: "91", // ダメ詰まり
                }],[{
                    name: "attack",
                    point: 2,
                },{
                    name: "defense",
                    point: 1,
                }],[{
                    name: "attack",
                    point: 1,
                },{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "attack",
                    point: 2,
                }],

            ];
            break;
        case "08":
            self.hp = 6;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster08";
            self.actions = [
                [{
                    name: "attack",
                    point: 3,
                },{
                    name: "defense",
                    point: 1,
                }],[{
                    name: "defense",
                    point: 1,
                }],
            ];
            break;
        case "09":
            self.hp = 4;
            self.defense = 2;
            self.defaultDefense = 0;
            self.img = "monster09";
            self.actions = [
                [{
                    name: "card",
                    point: "92",    // サカレ形
                },{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "attack",
                    point: 3,
                }],[{
                    name: "defense",
                    point: 2,
                }],
            ];
            break;
        case "10":
            self.hp = 7;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster10";
            self.actions = [
                [{
                    name: "attack",
                    point: 3,
                }],[{
                    name: "defense",
                    point: 3,
                }],
            ];
            break;
        case "11":
            self.hp = 6;
            self.defense = 1;
            self.defaultDefense = 0;
            self.img = "monster11";
            self.actions = [
                [{
                    name: "attack",
                    point: 2,
                },{
                    name: "defense",
                    point: 1,
                }],[{
                    name: "attack",
                    point: 2,
                },{
                    name: "life",
                    point: 1,
                },{
                    name: "card",
                    point: "91", // ダメ詰まり
                }],
            ];
            break;
        case "12":
            self.hp = 5;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster12";
            self.actions = [
                [{
                    name: "attack",
                    point: 4,
                }],[{
                    name: "life",
                    point: 3,
                }],
            ];
            break;
        case "13":
            self.hp = 5;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster13";
            self.actions = [
                [{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "defense",
                    point: 3,
                }],[{
                    name: "defense",
                    point: 4,
                }],[{
                    name: "attack",
                    point: 5,
                }],
            ];
            break;
        case "14":
            self.hp = 7;
            self.defense = 4;
            self.defaultDefense = 0;
            self.img = "monster14";
            self.actions = [
                [{
                    name: "attack",
                    point: 3,
                },{
                    name: "defense",
                    point: 1,
                }],[{
                    name: "life",
                    point: 2,
                },{
                    name: "attack",
                    point: 2,
                }],
            ];
            break;
        case "15":
            self.hp = 8;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster15";
            self.actions = [
                [{
                    name: "attack",
                    point: 3,
                },{
                    name: "card",
                    point: "91", // ダメ詰まり
                }],[{
                    name: "life",
                    point: 2,
                },{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "attack",
                    point: 3,
                }],
            ];
            break;
        case "16":
            self.hp = 9;
            self.defense = 1;
            self.defaultDefense = 0;
            self.img = "monster16";
            self.actions = [
                [{
                    name: "attack",
                    point: 1,
                },{
                    name: "defense",
                    point: 1,
                },{
                    name: "life",
                    point: 1,
                }],[{
                    name: "attack",
                    point: 2,
                }],
            ];
            break;
        case "17":
            self.hp = 8;
            self.defense = 0;
            self.defaultDefense = 0;
            self.img = "monster17";
            self.actions = [
                [{
                    name: "attack",
                    point: 1,
                },{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "attack",
                    point: 1,
                },{
                    name: "card",
                    point: "92",    // サカレ形
                },{
                    name: "defense",
                    point: 2,
                }],[{
                    name: "attack",
                    point: 2,
                }],
            ];
            break;
        case "99":
            self.hp = 20;
            self.defense = 10;
            self.defaultDefense = 0;
            self.img = "monster99";
            self.actions = [
                [{
                    name: "card",
                    point: "92",    // サカレ形
                },{
                    name: "card",
                    point: "92",    // サカレ形
                },{
                    name: "card",
                    point: "92",    // サカレ形
                }],
                [{
                    name: "attack",
                    point: 1,
                },{
                    name: "life",
                    point: 1,
                }],
                [{
                    name: "attack",
                    point: 2,
                },{
                    name: "life",
                    point: 2,
                }],
                [{
                    name: "attack",
                    point: 3,
                },{
                    name: "life",
                    point: 3,
                }],
                [{
                    name: "attack",
                    point: 4,
                }],
                [{
                    name: "attack",
                    point: 5,
                }],
                [{
                    name: "attack",
                    point: 6,
                }],
                [{
                    name: "attack",
                    point: 7,
                }],
                [{
                    name: "attack",
                    point: 8,
                }],
            ];
            break;

    }
}
phina.define('GetItemScene', {
    superClass: 'DisplayScene',
    init: function(param/*{items}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "black";

        // アイテム無しならスルー
        if (!param.items) {
            setTimeout(function() {
                self.exit("MainScene");
            }, 10);
            return;
        }

        Label({
            text: "入手",
            fontSize: 30,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-5));

        if (param.items.stone) {
            Label({
                text: "魔石 " + param.items.stone + " 個",
                fontSize: 50,
                fill: "white",
            }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-3));
            player.stone += param.items.stone;
        }

        if (param.items.card) {
            // Label({
            //     text: "＆",
            //     fontSize: 30,
            //     fill: "white",
            // }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-1.7));

            const card = new Card(param.items.card);
            card.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(param.items.stone ? 0 : -1));
            card.ui.setInteractive(true);
            card.ui.on("pointstart", function() {
                App.pushScene(CardDetailScene({
                    card: card,
                    cardID: card.id,
                }));
            });
            myCards.add(card);

        }

        const closeButton = Sprite("close");
        closeButton.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(13));
        closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            self.exit("MainScene");
        });

    },
});

phina.define('IntroScene', {
    superClass: 'DisplayScene',
    init: function(param/*{callback: function}*/) {
        this.superInit(param);

        const self = this;

        this.backgroundColor = "black";

        Sprite("story").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        const label = Label({
            fill: "white",
            fontSize: 30,
            text: "ここが碁会所というやつか",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-1));
        label.alpha = 0;
        label.tweener.wait(300).to({alpha:1}, 300)
        .wait(300)
        .call(function() {
            const goButton = new BasicButton({
                width: 200,
                height: 50,
                text: "中へ入る",
                dark: true,
            });
            goButton.ui.addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(5));
            goButton.ui.setInteractive(true);
            goButton.ui.on("pointstart", function() {
                self.exit("MainScene");
            });
        })
        .play();


    },
});
phina.define('MainScene', {
    superClass: 'DisplayScene',
    init: function(param/*{}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "black";

        const nowMap = map[mapIndex];

        // まだデッキを生成していないなら生成
        if (myCards.count() < 4) {
            // デッキ生成
            myCards.createNewCards();
        }

        // 戦闘中に最大HPを超えることがあるので
        if (player.hp > player.maxHp) {
            player.hp = player.maxHp;
        }

        // セーブ
        storage.save();

        if (nowMap.type === 3) {
            setTimeout(function() {
                App.replaceScene(CardPresenterScene({card1id: nowMap.items.card1, card2id: nowMap.items.card2}));
                mapIndex += 1;
            }, 10);
            return;
        }

        // 背景を描画
        let backImg;
        if (nowMap.type === 0 || nowMap.type === 1) {
            backImg = "dungeon01";
        } else if (nowMap.type === 2) {
            backImg = "dungeon02";
        } else if (nowMap.type === 9 || nowMap.type === 10) {
            backImg = "dungeon09";
        }
        Sprite(backImg).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        // 情報表示
        LabelArea({
            width: 200,
            height: 80,
            text: nowMap.floor,
            fontSize: 50,
            fill: "white",
            align: "right",
        }).addChildTo(this).setPosition(this.gridX.span(13), this.gridY.span(1));
        LabelArea({
            width: 200,
            height: 80,
            text: "ＨＰ: " + player.hp + " / " + player.maxHp,
            fontSize: 30,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.span(3), this.gridY.span(1));
        LabelArea({
            width: 200,
            height: 80,
            text: "魔石: " + player.stone,
            fontSize: 30,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.span(3), this.gridY.span(1.7));

        // カード合成ボタン
        if (player.stone >= 1 && nowMap.type !== 10) {
            const cardButton = RectangleShape({
                width: 80,
                height: 60,
                fill: "rgba(0,0,0,0.8)",
                stroke: "white",
                strokeWidth: 3,
                cornerRadius: 5,
            }).addChildTo(this).setPosition(this.gridX.span(2), this.gridY.span(4.4));
            Label({
                text: "合成",
                fill: "white",
                fontSize: 23,
            }).addChildTo(cardButton);
            cardButton.setInteractive(true);
            cardButton.on("pointstart", function() {
                self.exit("CardPlusScene");
            });
 
            const cardButtonFade = RectangleShape({
                width: cardButton.width,
                height: cardButton.height,
                fill: "yellow",
                strokeWidth: 0,
                cornerRadius: 5,
            }).hide().addChildTo(cardButton);
            cardButtonFade.alpha = 0;
            cardButtonFade.show().tweener
            .wait(500)
            .to({alpha: 0.7, width: cardButton.width, height: cardButton.height}, 100)
            .to({alpha: 0, width: cardButton.width + 20, height: cardButton.height + 20}, 500, "easeOutCirc")
            .to({alpha: 0.7, width: cardButton.width, height: cardButton.height}, 100)
            .to({alpha: 0, width: cardButton.width + 20, height: cardButton.height + 20}, 500, "easeOutCirc")
            .call(function() {
                cardButtonFade.remove();
            })
            .play();

        }

        if (nowMap.type !== 10) {
            // 山札
            const stock = new CardsUI(myCards);
            stock.ui.addChildTo(this).setPosition(this.gridX.span(2), this.gridY.span(2.7));
        }

        function fade(kind, callback) {
            // フェード用のシェイプ
            const fade = RectangleShape({
                width: self.width,
                height: self.height,
                fill: "black",
            }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());

            if (kind === "fadeIn") {
                // フェードイン
                fade.alpha = 1;
                fade.tweener.to({alpha: 0}, 1000)
                .call(function() {
                    fade.remove();
                    if (callback) {
                        callback();
                    }
                }).play();
            } else {
                // フェードアウト
                fade.alpha = 0;
                fade.tweener.to({alpha: 1}, 500)
                .call(function() {
                    fade.remove();
                    if (callback) {
                        callback();
                    }
                }).play();
            }
        }

        // 通路
        if (nowMap.type === 0 || nowMap.type === 1 || nowMap.type === 9) {

            if (nowMap.type === 0 || nowMap.type === 9) {
                if (nowMap.floor === "１階") {
                    text = "…誰かが来る、席亭か？";
                } else if (nowMap.floor === "２階") {
                    text = "…席亭はどこだろうか";
                } else if (nowMap.floor === "３階") {
                    text = "…碁を打ちたいのだが";
                } else if (nowMap.floor === "４階") {
                    text = "…本当に碁会所なのだろうか";
                } else if (nowMap.floor === "５階") {
                    text = "…碁盤が見当たらないな";
                } else if (nowMap.floor === "６階") {
                    text = "…廊下しかないのだろうか";
                } else if (nowMap.floor === "７階") {
                    text = "…トイレはどこだろうか";
                } else if (nowMap.floor === "８階") {
                    text = "…自販機はないのだろうか";
                } else if (nowMap.floor === "９階") {
                    text = "…行き止まりだ";
                }
                const label = Label({
                    fill: "white",
                    fontSize: 30,
                    text: text,
                }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-1));
                label.alpha = 0;
                label.tweener.wait(300).to({alpha:1}, 300)
                .play();
            }

            // 先へ進むボタン 
            const goButton = new BasicButton({
                width: 200,
                height: 50,
                text: nowMap.floor === "９階" ? "席亭を探す" : "奥へ進む",
                dark: true,
            });
            goButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(5));
            goButton.ui.on("pointstart", function() {
                mapIndex += 1;
                if (nowMap.enemy) {

                    // データ消去
                    storage.remove();

                    const enemy = new Enemy(nowMap.enemy);
                    self.exit("BattleScene", {player: player, enemy: enemy, items: nowMap.items, backImage: backImg});
                    return;
                }
                // フェードアウト
                fade("fadeOut", function() {
                    App.replaceScene(MainScene());
                });
            });
            fade("fadeIn");
        }

        // 階段
        if (nowMap.type === 2) {
            // 先へ進むボタン 
            const goButton = new BasicButton({
                width: 200,
                height: 50,
                text: "階段を上る",
                dark: true,
            });
            goButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(5));
            goButton.ui.on("pointstart", function() {
                mapIndex += 1;
                // フェードアウト
                fade("fadeOut", function() {
                    App.replaceScene(MainScene());
                });
            });
            fade("fadeIn");
        }

        // エンディング
        if (nowMap.type === 10) {

            const label = Label({
                fill: "white",
                fontSize: 150,
                text: "GAME\nCLEAR",
                fontWeight: 800,
                stroke: "black",
                strokeWidth: 2,
            }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-1));

            Label({
                fill: "white",
                fontSize: 30,
                text: "最後まで遊んでいただき\nありがとうございました。",
                fontWeight: 800,
                stroke: "black",
                strokeWidth: 2,
            }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(4));

            this.on("pointstart", function() {
                self.exit("ResultScene");
            })
        }


    },
});

// type 0:通路入り口 1:通路 2:階段 3:カード２択
const map = [
    { floor: "１階", type: 0, enemy: "01", items: null },
    { floor: "１階", type: 1, enemy: "02", items: {card: "11"} },// キリ
    { floor: "１階", type: 1, enemy: "01", items: {card: "07"} },// コスミ
    { floor: "１階", type: 1, enemy: "02", items: {stone:1, card: "15"} },// ハネ
    { floor: "１階", type: 1, enemy: null, items: null },
    { floor: "１階", type: 3, enemy: null, items: {card1: "07", card2: "40"} }, // コスミ or 休憩
    { floor: "１階", type: 1, enemy: "01", items: {stone:1} },
    { floor: "１階", type: 2, enemy: null, items: null },

    { floor: "２階", type: 0, enemy: "03", items: {card: "32"} },// 鉄柱
    { floor: "２階", type: 1, enemy: "04", items: {stone:1} },
    { floor: "２階", type: 1, enemy: "03", items: {stone:1, card: "02"} },// サバキ
    { floor: "２階", type: 1, enemy: "04", items: {stone:1, card: "10"} },// スベリ
    { floor: "２階", type: 1, enemy: null, items: null },
    { floor: "２階", type: 3, enemy: null, items: {card1: "50", card2: "40"} },// 迫力 or 休憩
    { floor: "２階", type: 1, enemy: "03", items: {stone:1, card: "20"} },// フリカワリ
    { floor: "２階", type: 1, enemy: "04", items: {stone:1} },
    { floor: "２階", type: 2, enemy: null, items: null },

    { floor: "３階", type: 0, enemy: null, items: null },
    { floor: "３階", type: 1, enemy: "05", items: {stone:1} },
    { floor: "３階", type: 1, enemy: "06", items: {stone:1, card: "04"} },// ブツカリ
    { floor: "３階", type: 1, enemy: "05", items: {stone:1, card: "07"} },  // コスミ
    { floor: "３階", type: 1, enemy: "06", items: null },//エグリ
    { floor: "３階", type: 1, enemy: "05", items: {card: "55"} },// 捨て石
    { floor: "３階", type: 2, enemy: null, items: null },

    { floor: "４階", type: 0, enemy: null, items: null },
    { floor: "４階", type: 1, enemy: "07", items: {stone:1, card: "05"} },//ハネ返す
    { floor: "４階", type: 1, enemy: null, items: null },
    { floor: "４階", type: 3, enemy: null, items: {card1: "55", card2: "40"} },// 捨て石 or 休憩
    { floor: "４階", type: 1, enemy: "08", items: {stone:1} },
    { floor: "４階", type: 1, enemy: "07", items: {card: "16"} },// シボリ
    { floor: "４階", type: 1, enemy: "08", items: {stone:1} },
    { floor: "４階", type: 1, enemy: null, items: null },
    { floor: "４階", type: 3, enemy: null, items: {card1: "53", card2: "54"} }, // 長考 or 形勢判断
    { floor: "４階", type: 2, enemy: null, items: null },

    { floor: "５階", type: 0, enemy: "09", items: null },
    { floor: "５階", type: 1, enemy: "10", items: {card: "06"} }, // シノギ
    { floor: "５階", type: 1, enemy: "09", items: {stone:1} },
    { floor: "５階", type: 1, enemy: null, items: null },
    { floor: "５階", type: 3, enemy: null, items: {card1: "40", card2: "50"} }, // 休憩 or 迫力
    { floor: "５階", type: 1, enemy: "09", items: null },
    { floor: "５階", type: 1, enemy: "10", items: {stone:1} },
    { floor: "５階", type: 2, enemy: null, items: null },

    { floor: "６階", type: 0, enemy: "11", items: null },
    { floor: "６階", type: 1, enemy: "12", items: {card: "20"} }, // フリカワリ
    { floor: "６階", type: 1, enemy: "11", items: {stone:1} },
    { floor: "６階", type: 1, enemy: null, items: null },
    { floor: "６階", type: 3, enemy: null, items: {card1: "32", card2: "33"} }, // 鉄柱 or 村正の妖刀
    { floor: "６階", type: 1, enemy: "11", items: null },
    { floor: "６階", type: 1, enemy: "12", items: null },
    { floor: "６階", type: 2, enemy: null, items: null },

    { floor: "７階", type: 0, enemy: "13", items: null },
    { floor: "７階", type: 1, enemy: "14", items: {card: "27"} }, // 薄みをとがめる
    { floor: "７階", type: 1, enemy: "13", items: {stone:1} },
    { floor: "７階", type: 1, enemy: null, items: null },
    { floor: "７階", type: 3, enemy: null, items: {card1: "26", card2: "31"} }, // 根拠を奪う or 秀策のコスミ
    { floor: "７階", type: 1, enemy: "13", items: {stone:1} },
    { floor: "７階", type: 1, enemy: "14", items: null },
    { floor: "７階", type: 2, enemy: null, items: null },

    { floor: "８階", type: 0, enemy: "15", items: null },
    { floor: "８階", type: 3, enemy: null, items: {card1: "53", card2: "54"} }, // 長考 or 形勢判断,
    { floor: "８階", type: 1, enemy: "16", items: {stone:1, card: "35"} }, // 定石外れ
    { floor: "８階", type: 1, enemy: "17", items: null },
    { floor: "８階", type: 1, enemy: "16", items: null },
    { floor: "８階", type: 1, enemy: "17", items: {stone:1} },
    { floor: "８階", type: 2, enemy: null, items: null },

    { floor: "９階", type: 9, enemy: "99", items: null },
    { floor: "９階", type: 10, enemy: null, items: null },
];
function Player(param) {
    const self = this;

    self.hp = 10;
    self.maxHp = 10;
    self.defense = 0;
    self.defaultDefense = 0;
    self.stone = 0;

    if (param && param.hp) {
        self.hp = param.hp;
    }
    if (param && param.maxHp) {
        self.maxHp = param.maxHp;
    }
    if (param && param.defense) {
        self.defense = param.defense;
    }
    if (param && param.defaultDefense) {
        self.defaultDefense = param.defaultDefense;
    }
    if (param && param.stone) {
        self.stone = param.stone;
    }

    // 自分のターンになったら呼ぶ
    self.turnBegin = function() {
        // シールドは毎ターン、基本値にもどる
        self.defense = self.defaultDefense;
    };

}phina.define('ResultScene', {
    superClass: 'DisplayScene',
    init: function(param/*{}*/) {
        this.superInit(param);

        const self = this;

        //@@@
        // const myCards = new Cards();
        // myCards.createNewCards();
        //@@@


        this.backgroundColor = "black";

        const bg = Sprite("dungeon01").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        bg.alpha = 0.2;

        const page1 = RectangleShape({
            width: this.width,
            height: this.height,
            fill: "transparent",
            strokeWidth: 0,
        }).addChildTo(this).setPosition(0,0).setOrigin(0,0);
        page1.alpha = 0;

        Label({
            text: "RECORD",
            fontSize: 40,
            fill: "white",
        }).addChildTo(page1).setPosition(this.gridX.center(), this.gridY.center(-7));

        LabelArea({
            width: this.width - 100,
            height: 80,
            text: "到達階",
            fontSize: 30,
            fill: "white",
        }).addChildTo(page1).setPosition(this.gridX.center(), this.gridY.center(-5));

        LabelArea({
            width: 200,
            height: 80,
            text: map[mapIndex].floor,
            fontSize: 30,
            fontWeight: 800,
            fill: "white",
        }).addChildTo(page1).setPosition(this.gridX.center(), this.gridY.center(-5));

        LabelArea({
            width: this.width - 100,
            height: 80,
            text: "所有カード",
            fontSize: 30,
            fill: "white",
        }).addChildTo(page1).setPosition(this.gridX.center(), this.gridY.center(-4));

        myCards.list.toSorted((a, b) => a.title > b.title ? 1 : -1).forEach((card, i) => {

            const x = i % 3 === 0 ? -3 : (i % 3 === 1 ? 2 : 7);
            const y = Math.floor(i/3) * 3;

            LabelArea({
                width: (this.width - 100) / 2,
                height: 80,
                text: card.title.replaceAll("\n", ""),
                fontSize: 25,
                fill: "white",
            }).addChildTo(page1).setPosition(this.gridX.center(x), this.gridY.center(-3 + y * 0.2));
    
        });

        const closeButton = Sprite("close");
        closeButton.addChildTo(page1).setPosition(this.gridX.center(), this.gridY.center(7));
        closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            page1.tweener.to({alpha: 0}, 500)
            .call(function() {
                page1.remove();
                page2.show();
                page2.tweener.to({alpha: 1}, 500).play();
            })
            .play();
        });

        page1.tweener.to({alpha: 1}, 500).play();


        const page2 = RectangleShape({
            width: this.width,
            height: this.height,
            fill: "transparent",
            strokeWidth: 0,
        }).addChildTo(this).setPosition(0,0).setOrigin(0,0);
        page2.alpha = 0;
        page2.hide();

        LabelArea({
            width: 500,
            height: 100,
            text: "今回のカードの中から１枚を選んで\n次回のプレイで使用できます。",
            fontSize: 30,
            fill: "white",
        }).addChildTo(page2).setPosition(this.gridX.center(), this.gridY.center(-2));

        const button = new BasicButton({
            text: "カード選択",
            width: 200,
            height: 60,
            dark: true,
        }).ui.addChildTo(page2).setPosition(this.gridX.center(), this.gridY.center());
        button.on("pointstart", function() {
            App.pushScene(CardsListScene({
                cards: myCards,
                button1: {
                    text: "決定",
                    callback: function(card) {
                        selectCard = card;
                    },
                },
            }));
        });

        let selectCard = null;

        this.on("resume", function() {
            if (selectCard) {
                page2.remove();

                const card = new Card(selectCard.id, true);
                card.ui.addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());

                localStorage.setItem("card", JSON.stringify({takeOver: {cardID: selectCard.id}}));

                card.ui.tweener
                .wait(200)
                .to({scaleX: 0, scaleY:0, alpha:0}, 1000, "easeInExpo")
                .call(function() {
                    self.exit("TitleScene");
                })
                .play();
            }
        });

    },
});
// スクロール可能にするアクセサリ
// https://qiita.com/simiraaaa/items/52de20a30a02600f2486
phina.define('Scrollable', {
    superClass: 'phina.accessory.Accessory',
    scrollType: 'normal',
    vx: 0,
    vy: 0,
    minX: -Infinity,
    minY: -Infinity,
    maxX: Infinity,
    maxY: Infinity,
    _locked: false,
    init: function(target) {
        this.superInit(target);
        this.friction = 0.8;
        this.on('attached', this._attached);
    },
    lock: function() {
        this._locked = true;
        this.vx = this.vy = 0;
        return this;
    },
    unlock: function() {
        this._locked = false;
        return this;
    },
    // 摩擦をセット
    setFriction: function(v) {
        this.friction = v;
        return this;
    },
    
    setScrollType: function(type) {
        this.scrollType = type;
        return this;
    },
    
    setMaxX: function(x) {
        this.maxX = x;
        return this;
    },
    
    setMinX: function(x) {
        this.minX = x;
        return this;
    },
    
    setMaxY: function(y) {
        this.maxY = y;
        return this;
    },
    
    setMinY: function(y) {
        this.minY = y;
        return this;
    },
    
    setMaxPosition: function(x, y) {
        this.maxX = x;
        this.maxY = y;
        return this;
    },
    
    setMinPosition: function(x, y) {
        this.minX = x;
        this.minY = y;
        return this;
    },
    
    // 枠外を描画しないようにする
    enableClip: function() {
        this.target.clip = function(canvas) {
            var w = this.width;
            var h = this.height;
            canvas.beginPath().rect(-w * this.originX, -h * this.originY, w, h);
        };
        return this;
    },
    
    // 枠外も描画するようにする
    disableClip: function() {
        this.target.clip = null;
        return this;
    },
    
    _attached: function(e) {
        var target = this.target;
        target.setInteractive(true);
        this._setPointstart();
        this._setPointmove();
        this._setPointend();
        this._setEnterframe();
    },
    
    _setPointstart: function() {
        var self = this;
        this.target.on('pointstart', function(e) {
            self.pointing = true;
        });
    },
    _setPointmove: function() {
        var self = this;
        this.target.on('pointmove', function(e) {
            if (self._locked) return;
            self.getScrollMethod().move.call(this, e, self);
        });
    },
    _setPointend: function() {
        var self = this;
        this.target.on('pointend', function(e) {
            self.pointing = false;
            if (self._locked) return;
            self.vx = e.pointer.fx;
            self.vy = e.pointer.fy;
        });
    },
    
    _setEnterframe: function() {
        var self = this;
        this.target.on('enterframe', function(e) {
            if (self._locked) return;
            if(self.pointing === false){
                self.getScrollMethod().update(self);
            }
        }, this);
    },
    
    getScrollMethod: function() {
        return Scrollable.SCROLL_METHOD_MAP[this.scrollType] || Scrollable.SCROLL_METHOD_MAP.normal;
    },
    
    _static: {
        SCROLL_METHOD_MAP: {
            x: {
                move: function(e, self) {
                    var dx = e.pointer.dx;
                    var maxX = self.maxX;
                    var minX = self.minX;
                    this.children.forEach(function(child) {
                        child.x += dx;
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        if (child.x < minX) {
                            child.x = minX;
                        }
                    });
                },
                
                update: function(self) {
                    var target = self.target;
                    self.vx *= self.friction;
                    if(Math.abs(self.vx) < 1){
                        self.vx = 0;
                    }
                    var vx = self.vx;
                    var maxX = self.maxX;
                    var minX = self.minX;
                    target.children.forEach(function(child) {
                        child.x += vx;
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        if (child.x < minX) {
                            child.x = minX;
                        }
                    });
                },
            },
            
            y: {
                move: function(e, self) {
                    var dy = e.pointer.dy;
                    var maxY = self.maxY;
                    var minY = self.minY;
                    this.children.forEach(function(child) {
                        child.y += dy;
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
                update: function(self) {
                    var target = self.target;
                    self.vy *= self.friction;
                    if(Math.abs(self.vy) < 1){
                        self.vy= 0;
                    }
                    var vy = self.vy;
                    var maxY = self.maxY;
                    var minY = self.minY;
                    target.children.forEach(function(child) {
                        child.y += vy;
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
            },
            
            normal: {
                move: function(e, self) {
                    var p = e.pointer;
                    var key = Math.abs(p.dx) < Math.abs(p.dy) ? 'y' : 'x';
                    var v = p['d' + key];
                    var max = self['max' + key.toUpperCase()];
                    var min = self['min' + key.toUpperCase()];
                    this.children.forEach(function(child) {
                        child[key] += v;
                        if (child[key] > max) {
                            child[key] = max;
                        }
                        if (child[key] < min) {
                            child[key] = min;
                        }
                    });
                },
                
                update: function(self) {
                    // 移動量が大きい方のみ処理する
                    var key = Math.abs(self.vx) < Math.abs(self.vy) ? 'y' : 'x';
                    var vkey = 'v' + key;
                    var target = self.target;
                    self[vkey] *= self.friction;
                    if(Math.abs(self[vkey]) < 1){
                        self[vkey] = 0;
                    }
                    
                    var v = self[vkey];
                    var max = self['max' + key.toUpperCase()];
                    var min = self['min' + key.toUpperCase()];
                    target.children.forEach(function(child) {
                        child[key] += v;
                        if (child[key] > max) {
                            child[key] = max;
                        }
                        if (child[key] < min) {
                            child[key] = min;
                        }
                    });
                    
                    // 階段状に移動してしまう対策
                    self.vx = self.vy = 0;
                    self[vkey] = v;
                },
            },
            
            flick: {
                move: function(e, self) {
                    var pos = {
                        x: e.pointer.dx,
                        y: e.pointer.dy,
                    };
                    var maxX = self.maxX;
                    var maxY = self.maxY;
                    var minX = self.minX;
                    var minY = self.minY;
                    this.children.forEach(function(child) {
                        child.position.add(pos);
                        
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        
                        if (child.x < minX) {
                            child.x = minX;
                        }
                        
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
                
                update: function(self) {
                    var target = self.target;
                    self.vx *= self.friction;
                    self.vy *= self.friction;
                    
                    if(Math.abs(self.vx) < 1){
                        self.vx = 0;
                    }
                    
                    if(Math.abs(self.vy) < 1){
                        self.vy = 0;
                    }
                    
                    var pos = {
                        x: self.vx,
                        y: self.vy,
                    };
                    var maxX = self.maxX;
                    var maxY = self.maxY;
                    var minX = self.minX;
                    var minY = self.minY;
                    target.children.forEach(function(child) {
                        child.position.add(pos);
                        
                        if (child.x > maxX) {
                            child.x = maxX;
                        }
                        
                        if (child.x < minX) {
                            child.x = minX;
                        }
                        
                        if (child.y > maxY) {
                            child.y = maxY;
                        }
                        
                        if (child.y < minY) {
                            child.y = minY;
                        }
                    });
                },
            },
            
        }
    }
});
const storage = new Storage();

function Storage() {
    const self = this;

    self._export = function() {
        return JSON.stringify({
            version: version,
            player: player,
            mapIndex: mapIndex,
            cards: myCards.list.map(card => card.id),
        });
    };

    self.save = function() {
        const data = self._export();
        if (!data) return;
        localStorage.setItem("card", data);
    };

    self.load = function() {
        const rawData = localStorage.getItem("card");

        if (!rawData) return;

        const data = JSON.parse(rawData);

        // 引き継ぎあり
        if (data.takeOver && data.takeOver.cardID) {
            myCards.add(new Card(data.takeOver.cardID));
            return;
        }

        player = new Player(data.player);
        mapIndex = data.mapIndex;
        myCards = new Cards();
        data.cards.forEach(id => myCards.add(new Card(id)));

    };

    self.remove = function() {
        localStorage.clear("card");
    };

}phina.define('TitleScene', {
    superClass: 'DisplayScene',
    init: function(param/*{callback: function}*/) {
        this.superInit(param);

        const self = this;

        this.backgroundColor = "black";

        // 初期化
        player = new Player();
        myCards = new Cards();
        mapIndex = 0;

        Label({
            text: "囲碁を知らなくても遊べるカードゲーム",
            fontSize: 20,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-2));

        Label({
            text: "格闘囲碁",
            fontSize: 100,
            fontWeight: 800,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-3));

        Label({
            text: "ver. " + version,
            fontSize: 18,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(3.8), this.gridY.center(-1.5));

        Label({
            text: "TAP TO START",
            fontSize: 30,
            fontWeight: 800,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(3));

        this.on("pointstart", function() {
            if (mapIndex === 0) {
                self.exit("IntroScene");
            } else {
                self.exit("MainScene");
            }
        });

        storage.load();

    },
});
