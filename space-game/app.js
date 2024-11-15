function loadTexture(path)
{
    return new Promise
    ((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () =>
        {
            resolve(img);
        };
    })
}

window.onload = async() =>
{
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const heroImg = await loadTexture('assets/player.png');
    const enemyImg = await loadTexture('assets/enemyShip.png');
    const Background = await loadTexture('assets/starBackGround.png');
    ctx.fillStyle = ctx.createPattern(Background, 'repeat');
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(heroImg, canvas.width/2 - 45, canvas.height - (canvas.height / 4));
    ctx.drawImage(heroImg, canvas.width/2 + 75, canvas.height - (canvas.height / 4) + 30, heroImg.width / 3, heroImg.height / 3);
    ctx.drawImage(heroImg, canvas.width/2 - 100, canvas.height - (canvas.height / 4) + 30, heroImg.width / 3, heroImg.height / 3);

    function createEnemies(ctx, canvas, enemyImg)
    {
        const MONSTER_TOTAL = 5;
        const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2;
        const STOP_X = START_X + MONSTER_WIDTH;
        for (let x = START_X; x < STOP_X; x += enemyImg.width)
        {
            for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height)
            {
                ctx.drawImage(enemyImg, x, y);
            }
        }
    }

    function createEnemies2(ctx, canvas, enemyImg)
    {
        let y = 0;
        for (let MONSTER_TOTAL = 5; MONSTER_TOTAL > 0; MONSTER_TOTAL--)
        {
            const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
            const START_X = (canvas.width - MONSTER_WIDTH) / 2;
            const STOP_X = START_X + MONSTER_WIDTH;

            for (let x = START_X; x < STOP_X; x += enemyImg.width)
            {
                ctx.drawImage(enemyImg, x, y);
            }
            y += enemyImg.height;
        }
    }

    createEnemies2(ctx, canvas, enemyImg);
};