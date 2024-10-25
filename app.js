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
        "stock": "img/stock.png",
        "fire": "img/fire.png",
        "card-kiri": "img/card-kiri.png",
        "card-bear": "img/card-bear.png",
        "card-gake": "img/card-gake.png",
        "card-snake": "img/card-snake.png",
        "card-hane": "img/card-hane.png",
        "card-nikenbiraki": "img/card-nikenbiraki.png",
        "card-elephant": "img/card-elephant.png",
        "card-kanashimi": "img/card-kanashimi.png",
        "card-sityo": "img/card-sityo.png",
        "card-simari": "img/card-simari.png",
        "card-nidanbane": "img/card-nidanbane.png",
        "attack": "img/attack.png",
        "defense": "img/defense.png",
        "life": "img/life.png",
        "monster01": "img/monster01.png",
        "monster02": "img/monster02.png",
        "monster03": "img/monster03.png",
        "monster04": "img/monster04.png",
        "monster05": "img/monster05.png",
        "monster06": "img/monster06.png",
        "back01": "img/back01.png",
        "dungeon01": "img/dungeon01.png",
        "dungeon02": "img/dungeon02.png",
        "effect1": "img/effect1.png",
        "close": "img/close.png",
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

// window.onerror = function(message) {
//     alert("予期しないエラー：" + message);
//     return true;
// };
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
    init: function(param/*{player:Player, enemy:Enemy, items:map.items}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "gray";

        // 背景画像
        Sprite("dungeon01").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

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
            if (param.player.defense < 0) param.player.defense = 0;
            myDefenseLabel.text = param.player.defense;

            if (param.player.hp < 0) param.player.hp = 0;
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
        const enemyDefenseLabel = Label({fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(enemyDefenseImg);
        enemyDefenseLabel.text = "0";
        const enemyLifeImg = Sprite("life").addChildTo(self.enemyStatusBox).setPosition(70, 0);
        const enemyLifeLabel = Label({fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(enemyLifeImg);
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
                } else {
                    continue;
                }

                if (actions[i].name === "life") {
                    self.enemyActions[i] = HeartShape({radius:50, fill:color, strokeWidth:5, stroke: "black"});
                } else {
                    self.enemyActions[i] = CircleShape({radius:50, fill:color, strokeWidth:5, stroke: "black"});
                }
                self.enemyActions[i].addChildTo(self)
                    .setPosition(self.enemyStatusBox.x - 150 + i * 52, self.enemyStatusBox.y + 40).setScale(0.5);
                Label({text:actions[i].point, fontSize:70, fontWeight:800, fill:"white", stroke:"black", strokeWidth:5}).addChildTo(self.enemyActions[i]);
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
            });
        }
        
        // これから場に出そうとしているカード
        self.moveToLayoutCard = null;

        // 場札
        self.layoutCards = [null, null];

        // 場札置き場１
        self.layoutBox1 = RectangleShape({
            width: 130 + 10,
            height: 195 + 10,
            fill: "rgba(0, 0, 0, 0.2)",
            stroke: "yellow",
            strokeWidth: 1,
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
            fill: "rgba(0, 0, 0, 0.2)",
            stroke: "yellow",
            strokeWidth: 1,
        }).addChildTo(this).setPosition(400, this.gridY.center()).hide();
        // Label({
        //     text: "2",
        //     fontSize: 20,
        //     fill: "yellow",
        // }).addChildTo(self.layoutBox2).setPosition(0, 0);

        self.handsLayer = DisplayElement().addChildTo(self).setPosition(this.gridX.center(), this.gridY.center(4.2));

        // 山札の山
        myCards.shuffle();
        const stock = new CardsUI(myCards);
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

        // 敵に攻撃
        function attackToEnemy(targetCard) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "firebrick", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:targetCard.attack, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(self.handsLayer.x + targetCard.ui.x + targetCard.ui.attackBox.x, self.handsLayer.y + targetCard.ui.y + targetCard.ui.attackBox.y)
                .tweener
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.enemyStatusBox.x, y: self.enemyStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    self.enemyStatusBox.tweener.by({y:-20}, 30).by({y:20}, 50)
                    .call(function() {

                        let attackPoint = targetCard.attack;

                        // まずシールドが減る
                        if (param.enemy.defense > 0) {
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
                ball.setPosition(self.handsLayer.x + targetCard.ui.x + targetCard.ui.defenseBox.x, self.handsLayer.y + targetCard.ui.y + targetCard.ui.defenseBox.y)
                .tweener
                .to({scaleX: 0.4, scaleY: 0.4}, 200)
                .wait(200)
                .to({x: self.myStatusBox.x, y: self.myStatusBox.y, scaleX: 0.01, scaleY: 0.01}, 200, "easeInQuart")
                .call(function() {
                    // ステータス変化アニメーション
                    const upNum = Label({text:"+" + targetCard.defense, fontSize:30, fontWeight:800, fill: "blue", stroke:"white", strokeWidth: 3});
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
                    card.ui.clear("pointstart");
                    card.ui.on("pointstart", function() {
                        if (waiting) return;
                        App.pushScene(CardDetailScene({
                            cardID: card.id,
                            button1: {
                                text: "場に出す",
                                callback: function() {
                                    self.moveToLayoutCard = card;
                                },
                            }
                        }));
                    });
                }

                function a() {
                    cards[0] = stock.deal();
                    addTapEvent(cards[0]);
                    cards[0].status = "hand";
                    return dealCardAnimation(cards[0], -240);
                }

                function b() {
                    cards[1] = stock.deal();
                    addTapEvent(cards[1]);
                    cards[1].status = "hand";
                    return dealCardAnimation(cards[1], -80);
                }

                function c() {
                    cards[2] = stock.deal();
                    addTapEvent(cards[2]);
                    cards[2].status = "hand";
                    return dealCardAnimation(cards[2], 80);
                }

                function d() {
                    cards[3] = stock.deal();
                    addTapEvent(cards[3]);
                    cards[3].status = "hand";
                    return dealCardAnimation(cards[3], 240);
                }

                function dealCardAnimation(targetHand, targetX) {
                    return new Promise((resolve) => {
                        targetHand.ui.show();
                        targetHand.ui.addChildTo(self.handsLayer).setPosition(stock.ui.x - self.handsLayer.x, stock.ui.y - self.handsLayer.y).setScale(0.1);
                        targetHand.ui.tweener.to({x: targetX, y: 0, scaleX: 1, scaleY: 1}, 200)
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
        const discard = new CardsUI();
        discard.ui.addChildTo(this).setPosition(this.gridX.center(-10), this.gridY.center(1));

        // カードを捨て札の山に送るアニメーション
        function moveCardToDiscard(targetCard) {
            targetCard.ui.tweener.to({
                x: discard.ui.x - self.handsLayer.x,
                y: discard.ui.y - self.handsLayer.y,
                scaleX: 0.1,
                scaleY:0.1}, 200)
            .call(() => {
                discard.add(targetCard);
                targetCard.status = "discard";
                // いろいろ初期化
                targetCard.ui.hide();
                targetCard.ui.setScale(1);
                targetCard.ui.clear("pointstart");
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
                    x: layoutBox.x - self.handsLayer.x,
                    y: layoutBox.y - self.handsLayer.y,
                }, 200)
                .call(function() {resolve();})
                .play();
            });
        }

        this.on("resume", function() {
            if (self.moveToLayoutCard) {
                
                // gard
                // 場札が一杯なら出せない
                if (self.layoutCards[0] !== null && self.layoutCards[1] !== null) {
                    return;
                }
                
                moveToLayoutBox(self.moveToLayoutCard).then(function() {

                    // 場に出した時に発動するスキルを処理
                    if (self.moveToLayoutCard.skill === "攻撃力２倍") {
                        for (let i = 0; i < 4; i++) {
                            cards[i].attackUp(cards[i].attack);
                        }
                    } else if (self.moveToLayoutCard.skill === "防御力２倍") {
                        for (let i = 0; i < 4; i++) {
                            cards[i].defenseUp(cards[i].defense);
                        }
                    } else if (self.moveToLayoutCard.skill === "攻撃力防御力２倍") {
                        for (let i = 0; i < 4; i++) {
                            cards[i].attackUp(cards[i].attack);
                            cards[i].defenseUp(cards[i].defense);
                        }
                    }

                    self.moveToLayoutCard.ui.clear("pointstart");
                    const id = self.moveToLayoutCard.id;
                    self.moveToLayoutCard.ui.on("pointstart", function() {
                        if (waiting) return;
                        App.pushScene(CardDetailScene({
                            cardID: id,
                        }));
                    });
                    self.moveToLayoutCard = null;
                });
            }

        });

        // RectangleShape({
        //     fill: "red",
        // }).addChildTo(self)
        // .setPosition(self.handsLayer.x + card1.ui.x, self.handsLayer.y + card1.ui.y);


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
                    self.exit("TitleScene");
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
                    self.layoutBox1.show();
                    self.layoutBox2.show();
                    turnEndButton.ui.show();
                    waiting = false;
                });
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
                    return Flow(function(attackResolve) {
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
                    return Flow(function(shieldResolve) {
                        if (targetCard.defense > 0) {
                            myShieldUp(targetCard)
                            .then(function() {shieldResolve();});
                        } else {
                            shieldResolve();
                        }
                    });
                }

                attackToEnemyFlow(targetCard)
                .then(function() {
                    shieldUpToMeFlow(targetCard)
                    .then(function() {resolve();});
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
        setTimeout(function() {
            setup().then(function() {
                startMyTurn();
            });
        }, 10);
        

    },
});
function Card(cardID, isLarge) {
    const self = this;

    self.status = "stock";// "stock" or "hand" or "layout" or "discard"

    self.id = cardID;
    self.title = "";
    self.img = "";
    self.description = "";

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

    self.ui = RectangleShape({
        width: cardWidth,
        height: cardHeight,
        fill: "white",
        stroke: "black",
        strokeWidth: 5,
        cornerRadius: 5,
        shadow: "black",
        shadowBlur: 15,
    });

    createFromCardID(self.id);
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
    }).addChildTo(self.ui).setPosition(0, descriptionY);

    // 攻撃力
    if (self.attack > 0) {
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
    if (self.defense > 0) {
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
        if (id === "01") {
            self.title = "二間ビラキ";
            self.img = "card-nikenbiraki";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "02") {
            self.title = "ハネ";
            self.img = "card-hane";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "03") {
            self.title = "シチョウ";
            self.img = "card-sityo";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "04") {
            self.title = "シマリ";
            self.img = "card-simari";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "05") {
            self.title = "キリ";
            self.img = "card-kiri";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "06") {
            self.title = "厚みの力";
            self.img = "card-elephant";
            self.description = "このターンに限り、すべてのカードの攻撃力と防御力が２倍。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "攻撃力防御力２倍";
        } else if (id === "07") {
            self.title = "アキ三角";
            self.img = "card-kanashimi";
            self.description = "攻撃力も防御力もない。";
            self.attack = 0;
            self.defense = 0;
            self.skill = null;
        } else if (id === "08") {
            self.title = "気合の一手";
            self.img = "card-bear";
            self.description = "このターンに限り、すべてのカードの攻撃力が２倍。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "攻撃力２倍";
        } else if (id === "09") {
            self.title = "二段バネ";
            self.img = "card-nidanbane";
            self.description = "";
            self.attack = 3;
            self.defense = 0;
            self.skill = "";
        }
    }
}
phina.define('CardDetailScene', {
    superClass: 'DisplayScene',
    init: function(param /*{cardID:String, button1:{text:String, callback:func}, button2:{text:String, callback:func}, returnObj: {}}*/) {
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
            closeButtonY = this.gridY.center(4.5);
        }

        const dialog = RectangleShape({
            width: 500,
            height: height,
            fill: "black",
            stroke: "black",
            strokeWidth: 5,
            cornerRadius: 5,
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        const card = new Card(param.cardID, true);

        card.ui.addChildTo(this).setPosition(this.gridX.center(), cardY);

        if (param.button1) {
            // ボタン１
            const button1 = new BasicButton({
                width: 200,
                height: 50,
                text: param.button1.text,
                dark: true,
            });
            button1.ui.addChildTo(this).setPosition(this.gridX.center(), button1Y);
            button1.ui.setInteractive(true);
            button1.ui.on("pointstart", function() {
                param.returnObj && (param.returnObj.tobeExit = true);
                if (param.button1.callback) {
                    param.button1.callback(param.card);
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
                disableCards: [selectCard1, selectCard2],
            }));
        });

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
                disableCards: [selectCard1, selectCard2],
            }));
        });

        const okButton = new BasicButton({
            width: 200,
            height: 80,
            text: "合成する\n（魔石２消費）",
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

                    effect.show().tweener.to({alpha: 1}, 5000)
                    .call(function() {resolve();}).play();

                    copyCard1.ui.tweener
                    .to({x: self.gridX.center(-3), alpha: 0.6}, 1000, "easeInOutBack")
                    .to({x: self.gridX.center(-1), alpha: 0.4}, 1000, "easeInOutBack")
                    .to({x: self.gridX.center(), alpha: 0.2}, 1000, "easeInOutBack")
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
                    .to({x: self.gridX.center(3), alpha: 0.6}, 1000, "easeInOutBack")
                    .to({x: self.gridX.center(1), alpha: 0.4}, 1000, "easeInOutBack")
                    .to({x: self.gridX.center(), alpha: 0.2}, 1000, "easeInOutBack")
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

                if (!newCardID) {
                    copyCard1.ui.tweener.to({alpha:1, x:self.gridX.center(-4)}, 100).play();
                    copyCard2.ui.tweener.to({alpha:1, x:self.gridX.center(+4)}, 100).play();
                    Label({text:"「ダメか」", fontSize: 30, fill:"white"})
                    .addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(5));
                } else {
                    copyCard1.ui.remove();
                    copyCard2.ui.remove();
                    const newCard = new Card(newCardID, true);
                    newCard.ui.addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(-2));
                    Label({text:"「よし、成功だ」", fontSize: 30, fill:"white"})
                    .addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(5));

                    myCards.add(new Card(newCardID));
                    myCards.remove(selectCard1);
                    myCards.remove(selectCard2);
                }

                player.stone -= 2;

                self.on("pointstart", function() {
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
        closeButton.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(6));
        closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            self.exit("MainScene");
        });

    },
});

const cardEvolutionRules = [
    {
        in1: "02",
        in2: "02",
        out: "09",
    }
];
function Cards() {
    const self = this;

    const list = [];
    self.list = list;

    self.createNewCards = function() {
        self.add(new Card("01"));
        self.add(new Card("06"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("06"));
        self.add(new Card("07"));
        self.add(new Card("08"));
        self.add(new Card("01"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("06"));
        self.add(new Card("07"));
        self.add(new Card("08"));
        self.add(new Card("01"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("06"));

        self.shuffle();
    };

    self.add = function(card) {
        list.push(card);
    };

    self.count = function() {
        return list.length;
    };

    self.remove = function(targetCard) {
        const index = list.findIndex(function(card) {
            return card === targetCard;
        });

        if (index < 0) return;

        list.splice(index, 1);
    };

    self.shuffle = function() {
        list.sort(() => Math.random() - 0.5);
    };

}phina.define('CardsListScene', {
    superClass: 'DisplayScene',
    init: function(param/*{cards: Cards, button1: function, disableCards:[card]}*/) {
        this.superInit(param);

        const self = this;

        const cards = param.cards;

        self.backgroundColor = "black";

        for (let i = 0; i < cards.list.length; i++) {
            if (param.disableCards && param.disableCards.some(function(card) {
                return cards.list[i] === card;
            })) {
                cards.list[i].ui.hide();
            } else {
                cards.list[i].ui.show();
            }
        }
    
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
            scrollable.setMinY(-1 * Math.ceil(cards.list.length / 4) * 250 + cardListArea.height - 40);
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

            cards.list[i].ui.setInteractive(true);

            let pointStartDy;

            cards.list[i].ui.clear("pointstart");
            cards.list[i].ui.on("pointstart", function(e) {
                pointStartDy = e.pointer.y;
            });

            cards.list[i].ui.clear("pointend");
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
                App.pushScene(CardDetailScene({card: cards.list[i], cardID: cards.list[i].id, button1: param.button1, returnObj: returnObj}));
            });

        }

        const returnObj = {};

        this.on("resume", function() {
            if (returnObj.tobeExit) {
                self.exit();
            }
        });

        const closeButton = Sprite("close");
        closeButton.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(15));
        closeButton.clear("pointstart");
        closeButton.setInteractive(true);
        closeButton.on("pointstart", function() {
            // いろいろ元にもどす
            for (let i = 0; i < cards.list.length; i++) {
                cards.list[i].ui.hide();
                cards.list[i].ui.clear("pointstart");
                cards.list[i].ui.clear("pointend");
            }
            self.exit();
        });

    },
});
function CardsUI(cards /* Cards */) {
    const self = this;

    if (!cards) {
        cards = new Cards();
    }

    const list = cards.list;
    self.list = list;

    self.ui = RectangleShape({
        width: 64 + 20,
        height: 64 + 40,
        fill: "rgba(0,0,0,0.5)",
        stroke: 0,
    });

    const image = Sprite("stock").addChildTo(self.ui).setPosition(0, 10);

    self.ui.setInteractive(true);
    self.ui.on("pointstart", function() {
        if (waiting) return;
        App.pushScene(CardsListScene({cards: cards}));
    });

    const cardNumLabel = Label({
        text: "0",
        fill: "white",
        fontSize: 20,
    }).addChildTo(self.ui).setPosition(0, -35);


    self.add = function(card) {
        list.push(card);
        refreshCardNumLabel();
    };

    self.count = function() {
        return list.length;
    };

    self.deal = function() {
        if (self.count() === 0) {
            return null;
        }
        const ret = list.shift();
        refreshCardNumLabel();
        return ret;
    };

    self.clear = function() {
        const ret = list.map((c) => c);
        list = [];
        return ret;
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
                [{
                    name: "attack",
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
            self.hp = 2;
            self.defense = 5;
            self.defaultDefense = 0;
            self.img = "monster03";
            self.actions = [
                [{
                    name: "defense",
                    point: 2,
                }],
                [{
                    name: "attack",
                    point: 1,
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
            text: "アイテムを拾った",
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
            Label({
                text: "＆",
                fontSize: 30,
                fill: "white",
            }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-1.7));

            const card = new Card(param.items.card);
            card.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(1));
            card.ui.setInteractive(true);
            card.ui.on("pointstart", function() {
                App.pushScene(CardDetailScene({
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

        LabelArea({
            width: this.width - 100,
            text: "ダンジョンの入り口まで来た。\n\n武器は持ってこなかった。碁盤と碁石だけ持ってきた。\n\n生きて戻れるだろうか？",
            fontSize: 30,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        this.on("pointstart", function() {
            self.exit("MainScene");
        });

    },
});
phina.define('MainScene', {
    superClass: 'DisplayScene',
    init: function(param/*{}*/) {
        this.superInit(param);

        const self = this;

        const nowMap = map[mapIndex];

        // まだデッキを生成していないなら生成
        if (myCards.count() === 0) {
            // デッキ生成
            myCards.createNewCards();
        }

        // 背景を描画
        let backImg;
        if (nowMap.type === 1) {
            backImg = "dungeon01";
        } else if (nowMap.type === 2) {
            backImg = "dungeon02";
        }
        Sprite(backImg).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        // 情報表示
        LabelArea({
            width: 200,
            height: 80,
            text: nowMap.floor,
            fontSize: 30,
            fill: "white",
            align: "right",
        }).addChildTo(this).setPosition(this.gridX.span(13), this.gridY.span(1));
        LabelArea({
            width: 200,
            height: 80,
            text: "ＨＰ: " + player.hp,
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
        if (player.stone >= 2) {
            const cardButton = RectangleShape({
                width: 80,
                height: 60,
                fill: "rgba(0,0,0,0.8)",
                stroke: "white",
                strokeWidth: 1,
                cornerRadius: 5,
            }).addChildTo(this).setPosition(this.gridX.span(2), this.gridY.span(4.4));
            Label({
                text: "カード\n合成",
                fill: "white",
                fontSize: 18,
            }).addChildTo(cardButton);
            cardButton.setInteractive(true);
            cardButton.on("pointstart", function() {
                self.exit("CardPlusScene");
            });
        }

        // 山札
        const stock = new CardsUI(myCards);
        stock.ui.addChildTo(this).setPosition(this.gridX.span(2), this.gridY.span(2.7));

        // フェード用のシェイプ
        const fade = RectangleShape({
            width: this.width,
            height: this.height,
            fill: "black",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        // フェードイン
        fade.tweener.to({alpha: 0}, 500).play();

        // 通路
        if (nowMap.type === 1) {
            // 先へ進むボタン 
            const goButton = new BasicButton({
                width: 200,
                height: 50,
                text: "奥へ進む",
                dark: true,
            });
            goButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(5));
            goButton.ui.on("pointstart", function() {
                mapIndex += 1;
                if (nowMap.enemy) {
                    const enemy = new Enemy(nowMap.enemy);
                    self.exit("BattleScene", {player: player, enemy: enemy, items: nowMap.items});
                    return;
                }
                // フェードアウト
                fade.tweener.to({alpha: 1}, 1000)
                .call(function() {
                    App.replaceScene(MainScene());
                }).play();
            });
        }

        // 階段
        if (nowMap.type === 2) {
            // 先へ進むボタン 
            const goButton = new BasicButton({
                width: 200,
                height: 50,
                text: "階段を下りる",
                dark: true,
            });
            goButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(5));
            goButton.ui.on("pointstart", function() {
                mapIndex += 1;
                // フェードアウト
                fade.tweener.to({alpha: 1}, 1000)
                .call(function() {
                    App.replaceScene(MainScene());
                }).play();
            });
        }

    },
});

// type 1:通路 2:階段
const map = [
    {
        floor: "地下１階",
        type: 1,
        enemy: "01",
        items: {stone:1},
    },{
        floor: "地下１階",
        type: 1,
        enemy: "02",
        items: {stone:1, card: "01"},
    },{
        floor: "地下１階",
        type: 1,
        enemy: "01",
        items: {stone:1},
    },{
        floor: "地下１階",
        type: 1,
        enemy: null,
    },{
        floor: "地下１階",
        type: 2,
        enemy: null,
    },{
        floor: "地下２階",
        type: 1,
        enemy: "03",
        items: {stone:1},
    }
];
function Player() {
    const self = this;

    self.hp = 10;
    self.defense = 0;
    self.defaultDefense = 0;
    self.stone = 2;

    // 自分のターンになったら呼ぶ
    self.turnBegin = function() {
        // シールドは毎ターン、基本値にもどる
        self.defense = self.defaultDefense;
    };

}// スクロール可能にするアクセサリ
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
phina.define('TitleScene', {
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
            text: "囲碁用語ダンジョン",
            fontSize: 60,
            fontWeight: 800,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-3));

        Label({
            text: "TAP TO START",
            fontSize: 30,
            fontWeight: 800,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(3));

        this.on("pointstart", function() {
            self.exit("");
            // self.exit("GetItemScene", {items:{stone:2, card:"06"}});
        });

    },
});
