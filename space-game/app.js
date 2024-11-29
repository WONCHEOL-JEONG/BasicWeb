// let gameLoopId = setInterval(() => {
//     // 화면 초기화
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     // 게임 객체 그리기
//     createHero(); // 플레이어 캐릭터
//     createEnemies(); // 적들
//     drawStaticObjects(); // 배경과 같은 정적인 요소
// }, 200); // 200ms마다 실행


// let onKeyDown = function (e) {
//     console.log(e.keyCode);
//     switch (e.keyCode) {
//         case 37: // 왼쪽 화살표
//         case 39: // 오른쪽 화살표
//         case 38: // 위쪽 화살표
//         case 40: // 아래쪽 화살표
//         case 32: // 스페이스바
//             e.preventDefault();
//             break;
//         default:
//             break;
//     }
// };
// window.addEventListener('keydown', onKeyDown);








// class EventEmitter {
//     constructor() {
//         this.listeners = {};
//     }
//     on(message, listener) {
//         if (!this.listeners[message]) {
//             this.listeners[message] = [];
//         }
//         this.listeners[message].push(listener);
//     }
//     emit(message, payload = null) {
//         if (this.listeners[message]) {
//             this.listeners[message].forEach((l) => l(message, payload));
//         }
//     }
// }



// let heroImg,
//     enemyImg,
//     laserImg,
//     canvas, ctx,
//     gameObjects = [],
//     hero,
//     eventEmitter = new EventEmitter();



// window.onload = async () => {
//     canvas = document.getElementById("myCanvas");
//     ctx = canvas.getContext("2d");
//     heroImg = await loadTexture("assets/player.png");
//     enemyImg = await loadTexture("assets/enemyShip.png");
//     laserImg = await loadTexture("assets/laserRed.png");
//     initGame();
//     let gameLoopId = setInterval(() => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.fillStyle = "black";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         drawGameObjects(ctx);
//         updateGameObjects();
//     }, 100);
// };


// function loadTexture(path) {
//     return new Promise((resolve) => {
//         const img = new Image();
//         img.src = path;
//         img.onload = () => {
//             resolve(img);
//         };
//     });
// }


// function createEnemies() {
//     const MONSTER_TOTAL = 5;
//     const MONSTER_WIDTH = MONSTER_TOTAL * 98;
//     const START_X = (canvas.width - MONSTER_WIDTH) / 2;
//     const STOP_X = START_X + MONSTER_WIDTH;
//     for (let x = START_X; x < STOP_X; x += 98) {
//         for (let y = 0; y < 50 * 5; y += 50) {
//             const enemy = new Enemy(x, y);
//             enemy.img = enemyImg;
//             gameObjects.push(enemy);
//         }
//     }
// }

// function createHero() {
//     hero = new Hero(
//         canvas.width / 2 - 45,
//         canvas.height - canvas.height / 4
//     );
//     hero.img = heroImg;
//     gameObjects.push(hero);
// };

// window.addEventListener("keyup", (evt) => {
//     if (evt.key === "ArrowUp") {
//         eventEmitter.emit(Messages.KEY_EVENT_UP);
//     } else if (evt.key === "ArrowDown") {
//         eventEmitter.emit(Messages.KEY_EVENT_DOWN);
//     } else if (evt.key === "ArrowLeft") {
//         eventEmitter.emit(Messages.KEY_EVENT_LEFT);
//     } else if (evt.key === "ArrowRight") {
//         eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
//     } else if (evt.keyCode === 32) {
//         eventEmitter.emit(Messages.KEY_EVENT_SPACE);
//     }
// });


// function initGame() {
//     gameObjects = [];
//     createEnemies();
//     createHero();
//     eventEmitter.on(Messages.KEY_EVENT_UP, () => {
//         hero.y -= 5;
//     })
//     eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
//         hero.y += 5;
//     });
//     eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
//         hero.x -= 5;
//     });
//     eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
//         hero.x += 5;
//     });
//     eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
//         if (hero.canFire()) {
//             hero.fire();
//         }
//     });
//     eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
//         first.dead = true;
//         second.dead = true;
//     });
// }


// function drawGameObjects(ctx) {
//     gameObjects.forEach(go => go.draw(ctx));
// }



// function intersectRect(r1, r2) {
//     return !(
//         r2.left > r1.right ||
//         r2.right < r1.left ||
//         r2.top > r1.bottom ||
//         r2.bottom < r1.top
//     );
// }

// class Laser extends GameObject {
//     constructor(x, y) {
//         super(x, y);
//         (this.width = 9), (this.height = 33);
//         this.type = 'Laser';
//         this.img = laserImg;
//         let id = setInterval(() => {
//             if (this.y > 0) {
//                 this.y -= 15;
//             } else {
//                 this.dead = true;
//                 clearInterval(id);
//             }
//         }, 100)
//     }
// }

// window.addEventListener("keyup", (evt) => {
//     if (evt.keyCode === 32) { // 스페이스바
//         eventEmitter.emit(Messages.KEY_EVENT_SPACE);
//     }
// });

// eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
//     first.dead = true; // 레이저 제거
//     second.dead = true; // 적 제거
// });

// function updateGameObjects() {
//     const enemies = gameObjects.filter(go => go.type === 'Enemy');
//     const lasers = gameObjects.filter((go) => go.type === "Laser");
//     lasers.forEach((l) => {
//         enemies.forEach((m) => {
//             if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
//                 eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
//                     first: l,
//                     second: m,
//                 });
//             }
//         });
//     });
//     // 죽은 객체 제거
//     gameObjects = gameObjects.filter(go => !go.dead);
// }

// class Hero extends GameObject {
//     constructor(x, y) {
//         super(x, y);
//         (this.width = 99), (this.height = 75);
//         this.type = "Hero";
//         this.speed = { x: 0, y: 0 };
//         this.cooldown = 0;
//     }
//     fire() {
//         if (this.canFire()) {
//             gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 발사
//             this.cooldown = 500; // 쿨다운 500ms
//             let id = setInterval(() => {
//                 if (this.cooldown > 0) {
//                     this.cooldown -= 100;
//                 } else {
//                     clearInterval(id);
//                 }
//             }, 100);
//         }
//     }
//     canFire() {
//         return this.cooldown === 0; // 쿨다운이 끝났는지 확인
//     }
// }

// eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
//     if (hero.canFire()) {
//         hero.fire();
//     }
// });

// setInterval(() => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     drawGameObjects(ctx);
//     updateGameObjects(); // 충돌 감지
// }, 100);



// function intersectRect(r1, r2) {
//     return !(
//         r2.left > r1.right || // r2가 r1의 오른쪽에 있음
//         r2.right < r1.left || // r2가 r1의 왼쪽에 있음
//         r2.top > r1.bottom || // r2가 r1의 아래에 있음
//         r2.bottom < r1.top // r2가 r1의 위에 있음
//     );
// }



// // window.onload = async () => {
// //     const canvas = document.getElementById("myCanvas");
// //     const ctx = canvas.getContext("2d");

// //     const heroImg = await loadTexture('assets/player.png');
// //     const enemyImg = await loadTexture('assets/enemyShip.png');
// //     const backgroundImg = await loadTexture('assets/starBackground.png'); // 별 배경 이미지 로드

// //     // 별이 있는 우주 배경 패턴 생성
// //     const pattern = ctx.createPattern(backgroundImg, 'repeat');
// //     ctx.fillStyle = pattern;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 패턴으로 채우기

// //     // 플레이어 우주선
// //     const mainShipX = canvas.width / 2 - heroImg.width / 2;
// //     const mainShipY = canvas.height - (canvas.height / 4);
// //     ctx.drawImage(heroImg, mainShipX, mainShipY);

// //     // 보조 우주선
// //     const smallWidth = heroImg.width * 0.5;
// //     const smallHeight = heroImg.height * 0.5;
// //     const offset = 70;
// //     const leftShipX = mainShipX - smallWidth - offset;
// //     const rightShipX = mainShipX + heroImg.width + offset;
// //     const subShipY = mainShipY + heroImg.height / 4;

// //     ctx.drawImage(heroImg, leftShipX, subShipY, smallWidth, smallHeight);
// //     ctx.drawImage(heroImg, rightShipX, subShipY, smallWidth, smallHeight);

// //     createEnemies(ctx, canvas, enemyImg);
// //     // createEnemies2(ctx, canvas, enemyImg);
// // };


// 이벤트 처리 클래스
class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) this.listeners[message] = [];
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach(listener => listener(message, payload));
        }
    }
}

// 이벤트 메시지 정의
const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER"
};

let canvas, ctx, heroImg, enemyImg, laserImg, explosionImg, gameObjects = [], hero, eventEmitter = new EventEmitter();

window.onload = async () => {
    try {
        // 캔버스 초기화
        canvas = document.getElementById("myCanvas");
        if (!canvas) {
            throw new Error("캔버스 요소를 찾을 수 없습니다.");
        }
        ctx = canvas.getContext("2d");

        // 이미지 로드
        heroImg = await loadTexture("assets/player.png");
        enemyImg = await loadTexture("assets/enemyShip.png");
        laserImg = await loadTexture("assets/laserRed.png");
        explosionImg = await loadTexture("assets/lasergreenshot.png");

        // 게임 초기화
        initGame();

        // 메인 게임 루프 시작
        setInterval(gameLoop, 100);
    } catch (error) {
        console.error("게임 초기화 중 오류가 발생했습니다:", error.message);
    }
};

// 이미지 로드 함수
function loadTexture(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`이미지를 로드할 수 없습니다: ${path}`));
    });
}

// 게임 초기화 함수
function initGame() {
    console.log("게임 초기화 중...");
    gameObjects = [];
    createHero();
    createEnemies();

    // 키보드 이벤트 리스너 설정
    window.addEventListener("keyup", handleKeyUp);

    // 이벤트 설정
    eventEmitter.on(Messages.KEY_EVENT_UP, () => hero.y = Math.max(0, hero.y - 10));
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => hero.y = Math.min(canvas.height - hero.height, hero.y + 10));
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => hero.x = Math.max(0, hero.x - 10));
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => hero.x = Math.min(canvas.width - hero.width, hero.x + 10));
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => hero.fire());
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        second.dead = true;
    });

    console.log("게임 초기화 완료");
}

// 키보드 입력 처리 함수
function handleKeyUp(evt) {
    switch (evt.key) {
        case "ArrowUp":
            eventEmitter.emit(Messages.KEY_EVENT_UP);
            break;
        case "ArrowDown":
            eventEmitter.emit(Messages.KEY_EVENT_DOWN);
            break;
        case "ArrowLeft":
            eventEmitter.emit(Messages.KEY_EVENT_LEFT);
            break;
        case "ArrowRight":
            eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
            break;
        case " ":
            eventEmitter.emit(Messages.KEY_EVENT_SPACE);
            break;
    }
}

// 메인 게임 루프
function gameLoop() {
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 게임 객체 업데이트 및 렌더링
    updateGameObjects();
    drawGameObjects();
}

// 게임 객체 업데이트 함수
function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser" || go.type === "SmallLaser");

    // 적과 모든 레이저 충돌 감지
    lasers.forEach((laser) => {
        enemies.forEach((enemy) => {
            if (intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: laser,
                    second: enemy,
                });
            }
        });
    });

    // 제거된 객체 필터링
    gameObjects = gameObjects.filter((go) => !go.dead);

    // 모든 게임 객체 업데이트
    gameObjects.forEach(go => {
        if (go.update) go.update();
    });
}


// 게임 객체 렌더링 함수
function drawGameObjects() {
    gameObjects.forEach(go => go.draw(ctx));
}

// 플레이어 생성
function createHero() {
    hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
    hero.img = heroImg;
    gameObjects.push(hero);
}


// 적 생성
function createEnemies() {
    const rows = 5, cols = 6, gap = 20;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * (enemyImg.width + gap) + 50;
            const y = row * (enemyImg.height + gap) + 30;
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

// 충돌 감지 함수
function intersectRect(r1, r2) {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

// 게임 객체 클래스
class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.width = 0;
        this.height = 0;
        this.img = null;
        this.type = "";
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
}

// 플레이어 클래스
class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = 'Hero';
        this.cooldown = 0;

        // 보조 우주선 초기화
        this.leftSubShip = new SubShip(this.x - 70 - 50, this.y + this.height / 4, heroImg);
        this.rightSubShip = new SubShip(this.x + this.width + 70, this.y + this.height / 4, heroImg);
        gameObjects.push(this.leftSubShip);
        gameObjects.push(this.rightSubShip);
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
            }, 100);
        }
    }

    canFire() {
        return this.cooldown === 0;
    }

    // 메인 우주선 업데이트 메서드 (보조 우주선도 함께 이동)
    update() {
        // 보조 우주선의 위치를 메인 우주선의 현재 위치를 기준으로 갱신
        const offset = 70;
        const smallWidth = this.width * 0.5;
        const subShipY = this.y + this.height / 4;

        this.leftSubShip.x = this.x - smallWidth - offset;
        this.leftSubShip.y = subShipY;

        this.rightSubShip.x = this.x + this.width + offset;
        this.rightSubShip.y = subShipY;

        // 보조 우주선도 업데이트 (자동 발사)
        this.leftSubShip.update();
        this.rightSubShip.update();
    }
}


// 적 클래스
class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        this.speed = 1; // 적의 이동 속도
    }

    // 적의 업데이트 메서드 (아래로 이동)
    update() {
        this.y += this.speed;

        // 적이 화면 밖으로 나가면 제거
        if (this.y > canvas.height) {
            this.dead = true;
        }
    }
}


// 레이저 클래스
class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 9;
        this.height = 33;
        this.type = "Laser";
        this.img = laserImg;
        const id = setInterval(() => {
            this.y -= 15;
            if (this.y < 0) {
                this.dead = true;
                clearInterval(id);
            }
        }, 100);
    }
}


// 보조
class SubShip extends GameObject {
    constructor(x, y, img) {
        super(x, y);
        this.width = heroImg.width * 0.5; // 보조 우주선 크기
        this.height = heroImg.height * 0.5;
        this.type = "SubShip";
        this.cooldown = 0; // 발사 간격 관리
        this.img = img; // 보조 우주선 이미지 설정
    }

    // 보조 우주선 자동 발사
    update() {
        if (this.canFire()) {
            gameObjects.push(new SmallLaser(this.x + this.width / 2, this.y));
            this.cooldown = 800; // 800ms 간격으로 발사
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);
                }
            }, 100);
        }
    }

    canFire() {
        return this.cooldown === 0;
    }
}


// 작은 레이저 클래스
class SmallLaser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 5; // 작은 레이저 크기
        this.height = 20;
        this.type = "SmallLaser";
        this.img = laserImg; // 기존 레이저 이미지 재사용
        const id = setInterval(() => {
            this.y -= 10; // 레이저 이동 속도
            if (this.y < 0) {
                this.dead = true;
                clearInterval(id);
            }
        }, 100);
    }
}

class Explosion extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 50; // 폭발 이미지 크기
        this.height = 50;
        this.type = "Explosion";
        this.img = explosionImg;

        // 일정 시간 후 제거
        setTimeout(() => {
            this.dead = true;
        }, 300); // 300ms 동안 폭발 이미지 표시
    }
}

eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;  // 레이저 제거
    second.dead = true; // 적 제거

    // 폭발 효과 추가
    const explosion = new Explosion(second.x, second.y);
    gameObjects.push(explosion);
});



