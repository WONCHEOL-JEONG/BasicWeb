function getMessage(name) {
    return `Hello, ${name}.`;
}

function introduction1() {
    return `나는 제주대를 다니고 있어.`;
}

function introduction2() {
    return `취미는 게임이랑 독서야.`;
}

function introduction3() {
    return `싫어하는 음식은 없고 햄버거를 좋아해.  `;
}

const introductions = [introduction1, introduction2, introduction3];
let currentIndex = 0;

function updateMessage() {
    const message = introductions[currentIndex]();
    document.body.innerHTML = `<p>${message}</p>`;
    currentIndex = (currentIndex + 1) % introductions.length;
}

setInterval(updateMessage, 3000);

document.write(getMessage('I am Woncheol'));
