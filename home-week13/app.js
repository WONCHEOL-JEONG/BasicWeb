class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }

    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }

    clear() {
        this.listeners = {};
    }
}

const Messages = {
    KEYUP_EVENT_UP: "KEYUP_EVENT_UP",
    KEYUP_EVENT_DOWN: "KEYUP_EVENT_DOWN",
    KEYUP_EVENT_LEFT: "KEYUP_EVENT_LEFT",
    KEYUP_EVENT_RIGHT: "KEYUP_EVENT_RIGHT",
    KEYDOWN_EVENT_UP: "KEYDOWN_EVENT_UP",
    KEYDOWN_EVENT_DOWN: "KEYDOWN_EVENT_DOWN",
    KEYDOWN_EVENT_LEFT: "KEYDOWN_EVENT_LEFT",
    KEYDOWN_EVENT_RIGHT: "KEYDOWN_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_STAGE_END: "GAME_STAGE_END",
};

let heroImg, enemyImg, laserImg, explosionImg, lifeImg, bossImg,
    heroLeftRollImg, heroRightRollImg,
    canvas, ctx, gameLoopId,
    gameObjects = [],
    hero, buddy1, buddy2,
    eventEmitter = new EventEmitter(),
    stageIdx, points,
    enemySpawnFunctions = [createEnemies, createEnemies2, createEnemies3, createEnemies4, createEnemies5];

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = "";
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }

    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    onHit() { }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 99), (this.height = 75);
        this.type = 'Hero';
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
        this.life = 3;
    }

    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 45, this.y - 10));
            this.cooldown = 500;
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100; 
                } else {
                    clearInterval(id);
                }
            }, 300);
        }
    }

    canFire() {
        return this.cooldown === 0;
    }

    onHit() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    }

    setSpeed(axle, speedValue) {
        this.speed[axle] = speedValue;
    }

    draw(ctx) {
        this.x += this.speed.x;
        this.y += this.speed.y;
        if (this.speed.x < 0) this.img = heroLeftRollImg;
        else if (this.speed.x > 0) this.img = heroRightRollImg;
        else this.img = heroImg;
        super.draw(ctx);
    }
}

class Buddy extends GameObject {
    constructor(hero, d) {
        super(hero.x, hero.y);
        (this.width = 99 / 2), (this.height = 75 / 2);
        this.type = 'Buddy';
        this.delta = d;
        this.img = hero.img;
        this.id = setInterval(() => {
            gameObjects.push(new Laser(this.x + this.buddyPosAdjust() + 21, this.y - 10));
        }, 3000);
    }

    draw(ctx) {
        this.x = hero.x;
        this.y = hero.y;
        this.img = hero.img;
        ctx.drawImage(this.img, this.x + this.buddyPosAdjust(), this.y + this.height * 0.5, this.width, this.height);
    }

    buddyPosAdjust() {
        if (this.delta < 0) return this.delta * this.width;
        else return (this.delta + 1) * this.width;
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        this.id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                this.dead = true;
            }
        }, 300);
    }

    onHit() {
        this.img = explosionImg;
        this.type = "Effect"
        setTimeout(() => {
            this.dead = true;
        }, 100);
    }
}

class Boss extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 91;
        this.height = 91;
        this.type = "Enemy";
        this.life = 30;
        this.id = setInterval(() => {
            if (this.life < 30) this.life += 3;
            if (this.life > 30) this.life = 30;
            placeEnemies([[1,1,0,1,0,1,1]]);
        }, 5000);
        this.movementDirection = 1;
        this.movementInterval = setInterval(() => {
            this.x += 10 * this.movementDirection;
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.movementDirection *= -1;
            }
        }, 500);
    }

    onHit() {
        this.life -= 1;
        if (this.life === 0) {
            this.img = explosionImg;
            this.type = "Effect"
            clearInterval(this.id);
            clearInterval(this.movementInterval);
            setTimeout(() => {
                this.dead = true;
            }, 300);
        }
    }
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id);
            }
        }, 100)
    }

    onHit() {
        this.dead = true;
    }
}

let onKeyDown = function (e) {
    switch (e.key) {
        case "ArrowUp":
        case "w":
            e.preventDefault();
            eventEmitter.emit(Messages.KEYDOWN_EVENT_UP);
            break;
        case "ArrowDown":
        case "s":
            e.preventDefault();
            eventEmitter.emit(Messages.KEYDOWN_EVENT_DOWN);
            break;
        case "ArrowLeft":
        case "a":
            e.preventDefault();
            eventEmitter.emit(Messages.KEYDOWN_EVENT_LEFT);
            break;
        case "ArrowRight":
        case "d":
            e.preventDefault();
            eventEmitter.emit(Messages.KEYDOWN_EVENT_RIGHT);
            break;
        case "SPACE":
            e.preventDefault();
            eventEmitter.emit(Messages.KEY_EVENT_SPACE);
            break;
        case " ":
            e.preventDefault();
            break;
        default:
            break;
    }
};

window.addEventListener('keydown', onKeyDown);

window.addEventListener("keyup", (evt) => {
    switch (evt.key) {
        case "ArrowUp":
        case "w":
            eventEmitter.emit(Messages.KEYUP_EVENT_UP);
            break;
        case "ArrowDown":
        case "s":
            eventEmitter.emit(Messages.KEYUP_EVENT_DOWN);
            break;
        case "ArrowLeft":
        case "a":
            eventEmitter.emit(Messages.KEYUP_EVENT_LEFT);
            break;
        case "ArrowRight":
        case "d":
            eventEmitter.emit(Messages.KEYUP_EVENT_RIGHT);
            break;
        case " ":
            eventEmitter.emit(Messages.KEY_EVENT_SPACE);
            break;
        case "SPACE":
            eventEmitter.emit(Messages.KEY_EVENT_SPACE);
            break;
        default:
            break;
    }
});

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
}

function initGame(enemyIdx) {
    gameObjects = [];
    enemySpawnFunctions[enemyIdx]();
    createHero();
    createBuddy();
    if (enemyIdx == 0) points = 0;
    eventEmitter.on(Messages.KEYDOWN_EVENT_UP, () => {
        hero.setSpeed("y", -5);
    });
    eventEmitter.on(Messages.KEYDOWN_EVENT_DOWN, () => {
        hero.setSpeed("y", 5);
    });
    eventEmitter.on(Messages.KEYDOWN_EVENT_LEFT, () => {
        hero.setSpeed("x", -5);
    });
    eventEmitter.on(Messages.KEYDOWN_EVENT_RIGHT, () => {
        hero.setSpeed("x", 5);
    });
    eventEmitter.on(Messages.KEYUP_EVENT_UP, () => {
        hero.setSpeed("y", 0);
    });
    eventEmitter.on(Messages.KEYUP_EVENT_DOWN, () => {
        hero.setSpeed("y", 0);
    });
    eventEmitter.on(Messages.KEYUP_EVENT_LEFT, () => {
        hero.setSpeed("x", 0);
    });
    eventEmitter.on(Messages.KEYUP_EVENT_RIGHT, () => {
        hero.setSpeed("x", 0);
    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        hero.fire();
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.onHit();
        second.onHit();
        points += 100;
        if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_STAGE_END);
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.onHit();
        hero.onHit();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return;
        }
        if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_STAGE_END);
        }
    });
    eventEmitter.on(Messages.GAME_STAGE_END, () => {
        nextStage();
    });
    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false);
    });
}

window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    heroLeftRollImg = await loadTexture("assets/playerLeft.png");
    heroRightRollImg = await loadTexture("assets/playerRight.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    explosionImg = await loadTexture("assets/laserGreenShot.png");
    lifeImg = await loadTexture("assets/life.png");
    bossImg = await loadTexture("assets/enemyUFO.png")
    pattern = ctx.createPattern(await loadTexture("assets/starBackground.png"), "repeat");

    stageIdx = 0;
    points = 0;

    initGame(stageIdx);
    gameLoopId = setInterval(standardGameloop, 100);
};

function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                });
            }
        });
    });

    enemies.forEach(enemy => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }
    })
    gameObjects = gameObjects.filter((go) => !go.dead);
}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );
    hero.img = heroImg;
    gameObjects.push(hero);
}

function createBuddy() {
    buddy1 = new Buddy(hero, -1);
    buddy2 = new Buddy(hero, 1);
    gameObjects.push(buddy1);
    gameObjects.push(buddy2);
}

function drawLife() {
    const START_POS = canvas.width;
    for (let i = hero.life; i > 0; i--) {
        ctx.drawImage(lifeImg, START_POS - (45 * (i)), canvas.height - 37);
    }
}

function drawBossLife(boss) {
    const START_X = canvas.width / 2 - (45 * 1.5);
    const START_Y = 10;

    const lifeSegments = Math.ceil(boss.life / 10);
    for (let i = 0; i < lifeSegments; i++) {
        ctx.drawImage(bossImg, START_X + (45 * i), START_Y, 40, 40);
    }
}

function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + points, 10, canvas.height - 20);
}

function drawText(message, x, y) {
    ctx.fillText(message, x, y);
}

function isHeroDead() {
    return hero.life <= 0;
}

function isEnemiesDead() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
    return enemies.length === 0;
}

function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame(win) {
    clearInterval(gameLoopId);
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        stageIdx = 0;
        resetGame();
    });
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win) {
            displayMessage(
                "Victory!!! Pew Pew... - Press [Space] to start a new game Captain Pew Pew",
                "green"
            );
        }
        else {
            displayMessage(
                "You died !!! Press [Space] to start a new game Captain Pew Pew"
            );
        }
    }, 200)
}

function nextStage() {
    if (enemySpawnFunctions.length <= ++stageIdx) {
        endGame(true);
    } else {
        clearInterval(gameLoopId);
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            displayMessage(
                "Stage Clear! Press [Space] to start next stage",
                "green"
            );
            drawText(`Score: ${points}`, canvas.width / 2, canvas.height / 2 + 40);
            eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
                resetGame(stageIdx);
            });
        }, 200);
    }
}

function resetGame(enemyFunc = 0) {
    if (gameLoopId) {
        clearInterval(gameLoopId);
        eventEmitter.clear();
        gameObjects.filter((o) => o.type === "Buddy" || o.type == "Enemy").forEach((o) => clearInterval(o.id));
        initGame(enemyFunc);
        gameLoopId = setInterval(standardGameloop, 100);
    }
}

function standardGameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    drawPoints();
    drawLife();

    const boss = gameObjects.find((go) => go.type === "Enemy" && go instanceof Boss);
    if (boss) {
        drawBossLife(boss);
    }
    
    if (isEnemiesDead()) eventEmitter.emit(Messages.GAME_STAGE_END);
}

function placeEnemies(matrix) {
    let longest = matrix.reduce((acc, cur) => {
        return acc < cur.length ? cur.length : acc;
    }, 0)
    let scaler = 1;
    if (longest > 10) {
        scaler = 10 / longest;
    }

    let itemH = enemyImg.height * scaler;
    let itemW = enemyImg.width * scaler;

    for (let y = 0; y < matrix.length; y++) {
        const line = matrix[y];
        const startX = (canvas.width - itemW * line.length) / 2
        for (let x = 0; x < line.length; x++) {
            if (line[x] === 1) {
                const enemy = new Enemy(startX + x * itemW, y * itemH);
                enemy.height = itemH;
                enemy.width = itemW;
                enemy.img = enemyImg;
                gameObjects.push(enemy);
            }
        }
    }
}

function createEnemies() {
    const matrix = [
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1,],
        [1, 1, 1,],
        [1, 1,],
        [1,],
    ]
    placeEnemies(matrix);
}

function createEnemies2() {
    const matrix = [
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 1, 1, 0,],
        [0, 1, 1, 0, 0, 0, 0, 1, 0,],
        [0, 0, 1, 0, 0, 1, 1, 0, 0, 0,],
        [0, 0, 0, 0, 0, 1, 0, 0, 0,],
    ]
    placeEnemies(matrix);
}

function createEnemies3() {
    const matrix = [
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
    ]
    placeEnemies(matrix);
}

function createEnemies4() {
    const matrix = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ]
    placeEnemies(matrix);
}

function createEnemies5() {
    const matrix = [
        [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
        [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    placeEnemies(matrix);

    const boss = new Boss((canvas.width - bossImg.width) / 2, 0);
    boss.img = bossImg;
    gameObjects.push(boss);
}