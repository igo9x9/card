phina.globalize();

const version = "1.0";

// 山札（stock）
// 手札（hand）
// 場札（layout）
// 捨て札（discard）

const ASSETS = {
    image: {
        "stock": "img/stock.png",
        "monster-01": "img/monster-01.png",
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
        "attack": "img/attack.png",
        "defense": "img/defense.png",
        "life": "img/life.png",
    }
};

phina.main(function() {
    App = GameApp({
        assets: ASSETS,
        startLabel: 'BattleScene',
        scenes: [
            {
                label: 'BattleScene',
                className: 'BattleScene',
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
function BasicButton(param/* {text:string, width: int, height: int, primary: boolean, disable: boolean, callback: function} */) {

    const self = this;

    self.ui = RectangleShape({
        width: param.width,
        height: param.height,
        fill: "white",
        stroke: "black",
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
    }).addChildTo(self.ui);

}phina.define('BattleScene', {
    superClass: 'DisplayScene',
    waiting: false,
    init: function(param/*{player:Player, enemy:Enemy}*/) {
        this.superInit(param);

        const self = this;

        self.backgroundColor = "gray";

        //@@@@@
        param.player = new Player();
        param.enemy = new Enemy("01");
        //@@@@@


        // 敵画像
        Sprite(param.enemy.img).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        // 自ステータス
        self.myStatusBox = RectangleShape({
            width: 100,
            height: 200,
            fill: "rgba(0, 0, 0, 0.6)",
            stroke: 0,
        }).addChildTo(this).setPosition(this.gridX.span(2), this.gridY.center(-2));
        Label({text: "You", fontSize: 20, fontWeight:800, fill: "white"}).addChildTo(self.myStatusBox).setPosition(0, -80);
        const myDefenseImg = Sprite("defense").addChildTo(self.myStatusBox).setPosition(0, -25);
        const myDefenseLabel = Label({fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(myDefenseImg);
        const myLifeImg = Sprite("life").addChildTo(self.myStatusBox).setPosition(0, 50);
        const myLifeLabel = Label({fontSize:40, fontWeight:800, fill:"white", stroke:"black", strokeWidth:2}).addChildTo(myLifeImg);

        // 自ステータス再描画
        function refreshMyStatusBox() {
            myDefenseLabel.text = param.player.defense;
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
        const stock = new Cards();
        stock.ui.addChildTo(this).setPosition(this.gridX.center(6), this.gridY.center(1));
        stock.createNewCards();

        let cards = [];

        // 敵の攻撃
        function attackToPlayer(enemyAction, damage) {
            return Flow(function(resolve) {
                const ball = CircleShape({radius: 150, fill: "firebrick", stroke:"black", strokeWidth: 20,}).setScale(0.1).addChildTo(self);
                Label({text:damage, fontSize:200, fill:"white", fontWeight:800, stroke: "black", strokeWidth: 20}).addChildTo(ball);
                ball.setPosition(enemyAction.x, enemyAction.y)
                .tweener
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
                        if (self.waiting) return;
                        App.pushScene(CardDetailScene({
                            cardID: card.id,
                            button1: {
                                text: "場に出す",
                                callback: function() {
                                    self.moveToLayoutCard = card;
                                },
                            }
                        }));
                    })
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
        const discard = new Cards();
        discard.ui.addChildTo(this).setPosition(this.gridX.center(-6), this.gridY.center(1));

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
            })
            .play();
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
                        if (self.waiting) return;
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
        const turnEndButton = new BasicButton({text: "自ターン終了", width: 300, height: 70, primary: true});
        turnEndButton.ui.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(15))
        .setInteractive(true)
        .on("pointstart", function() {

            if (self.waiting) return;

            endOfMyTurn();

        });

        // 自分のターン終了
        function endOfMyTurn() {

            self.waiting = true;

            // 場札の１番目の処理が終わってから
            playLayoutCard(0).then(function () {
                // 場札の２番目を処理して
                playLayoutCard(1).then(function() {
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
                    doEnemyAction(1).then(function() {
                        doEnemyAction(2).then(function() {
                            startMyTurn();
                        });
                    });
                });
            });
        }

        // 自分のターン開始
        function startMyTurn() {

            self.waiting = true;

            // 敵の次のアクションを表示
            param.enemy.turnEnd();
            drawAllEnemyActions(param.enemy.getAction());

            yourTurnStartAnimation().then(function() {
                param.player.turnBegin();
                refreshMyStatusBox();
                dealCards().then(function() {
                    self.layoutBox1.show();
                    self.layoutBox2.show();
                    self.waiting = false;
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
    

        // const test1Button = new BasicButton({text: "none", width:150, height:50});
        // test1Button.ui.addChildTo(this).setPosition(this.gridX.span(3), this.gridY.span(3))
        //     .setInteractive(true)
        //     .on("pointstart", function() {
    
        //         if (self.wait) return;

        //     });

        // const test2Button = new BasicButton({text: "Deal", width:150, height:50});
        // test2Button.ui.addChildTo(this).setPosition(this.gridX.span(7), this.gridY.span(3))
        //     .setInteractive(true)
        //     .on("pointstart", function() {
        //         if (self.wait) return;
        //         dealCards();
        //     });

        // const test3Button = new BasicButton({text: "Return", width:150, height:50});
        // test3Button.ui.addChildTo(this).setPosition(this.gridX.span(11), this.gridY.span(3))
        //     .setInteractive(true)
        //     .on("pointstart", function() {
        //         if (self.wait) return;
        //         returnCardToStockFromDiscard();
        //     });

        // const test4Button = new BasicButton({text: "AT to E", width:150, height:50});
        // test4Button.ui.addChildTo(this).setPosition(this.gridX.span(3), this.gridY.span(1))
        //     .setInteractive(true)
        //     .on("pointstart", function() {
        //         if (self.wait) return;

        //     });


        // ゲーム開始
        startMyTurn();
        

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

    // let attackBoxSize = 32;
    let attackBoxSize = 0.5;
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
        attackBoxSize *= 2;
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
            .setScale(attackBoxSize).addChildTo(self.ui)
            .setPosition((-1) * cardWidth/2 + attackBoxSize/2 + 20, cardHeight/2 - attackBoxSize/2 - 20);
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
            .setScale(attackBoxSize).addChildTo(self.ui)
            .setPosition(cardWidth/2 - attackBoxSize/2 - 20, cardHeight/2 - attackBoxSize/2 - 20);
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
            self.title = "気合の一手";
            self.img = "card-bear";
            self.description = "このターンに限り、すべてのカードの攻撃力が２倍。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "攻撃力２倍";
        } else if (id === "02") {
            self.title = "ハネ";
            self.img = "card-hane";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "03") {
            self.title = "ツケ";
            self.img = "card-kiri";
            self.description = "";
            self.attack = 1;
            self.defense = 0;
            self.skill = null;
        } else if (id === "04") {
            self.title = "シチョウ";
            self.img = "card-sityo";
            self.description = "";
            self.attack = 2;
            self.defense = 0;
            self.skill = null;
        } else if (id === "05") {
            self.title = "厚みの力";
            self.img = "card-elephant";
            self.description = "このターンに限り、すべてのカードの攻撃力と防御力が２倍。";
            self.attack = 0;
            self.defense = 0;
            self.skill = "攻撃力防御力２倍";
        } else if (id === "06") {
            self.title = "二間ビラキ";
            self.img = "card-nikenbiraki";
            self.description = "";
            self.attack = 0;
            self.defense = 1;
            self.skill = null;
        } else if (id === "07") {
            self.title = "アキ三角";
            self.img = "card-kanashimi";
            self.description = "攻撃力も防御力もない。";
            self.attack = 0;
            self.defense = 0;
            self.skill = null;
        }
    }
}
phina.define('CardDetailScene', {
    superClass: 'DisplayScene',
    init: function(param /*{cardID:String, button1:{text:String, callback:func}, button2:{text:String, callback:func}}*/) {
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
            fill: "DimGray",
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
                primary: true,
            });
            button1.ui.addChildTo(this).setPosition(this.gridX.center(), button1Y);
            button1.ui.setInteractive(true);
            button1.ui.on("pointstart", function() {
                if (param.button1.callback) {
                    param.button1.callback();
                    self.exit();
                }
            });
        }

        // closeボタン
        const closeButton = new BasicButton({
            width: 200,
            height: 50,
            text: "閉じる",
        });
        closeButton.ui.addChildTo(this).setPosition(this.gridX.center(), closeButtonY);
        closeButton.ui.setInteractive(true);
        closeButton.ui.on("pointstart", function() {
            self.exit();
        });
    },
});
function Cards() {
    const self = this;

    const list = [];
    self.list = list;

    self.createNewCards = function() {
        self.add(new Card("01"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("06"));
        self.add(new Card("07"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("01"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        self.add(new Card("01"));
        self.add(new Card("02"));
        self.add(new Card("03"));
        self.add(new Card("04"));
        self.add(new Card("05"));
        refreshCardNumLabel();
    };

    self.ui = RectangleShape({
        width: 64 + 20,
        height: 64 + 40,
        fill: "rgba(0,0,0,0.5)",
        stroke: 0,
    });

    const image = Sprite("stock").addChildTo(self.ui).setPosition(0, 10);

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
            self.hp = 3;
            self.defense = 1;
            self.defaultDefense = 0;
            self.img = "monster-01";
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
                },{
                    name: "life",
                    point: 1,
                }],
                [{
                    name: "life",
                    point: 2,
                }]
            ];
            break;
    }
}
function Player() {
    const self = this;

    self.hp = 10;
    self.defense = 0;
    self.defaultDefense = 0;

    // 自分のターンになったら呼ぶ
    self.turnBegin = function() {
        // シールドは毎ターン、基本値にもどる
        self.defense = self.defaultDefense;
    };

}
