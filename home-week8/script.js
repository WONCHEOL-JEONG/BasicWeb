const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

const startButton = document.getElementById('start');
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

let words = [];
let wordIndex = 0;
let startTime;

// 시작 버튼 클릭 이벤트
startButton.addEventListener('click', startGame);

// 모달 구성요소 (결과를 더 돋보이게 할 모달창)
const resultModal = document.getElementById("resultModal");
const modalMessage = document.getElementById("modalMessage");
const highScoreMessage = document.getElementById("highScoreMessage");
const closeButton = document.querySelector(".close");

let highScore = localStorage.getItem("highScore") || null;
let bestTime = localStorage.getItem("bestTime") || null;

let score = 10000;
let scoreInterval;

// 모달 닫힘
closeButton.onclick = function () {
    resultModal.style.display = "none";
};

// 바깥을 클릭하여 모달 닫기
window.onclick = function (event) {
    if (event.target == resultModal) {
        resultModal.style.display = "none";
    }
};

// 최고 기록 갱신, localStorage를 사용하여 저장
function updateHighScore(time, score) {
    if (!highScore || score > highScore) {
        highScore = score;
        bestTime = time;
        localStorage.setItem("highScore", score);
        localStorage.setItem("bestTime", time);
        return true;
    }
    return false;
}

// 모달로 결과 보여주기
function showModalMessage(time, score) {
    modalMessage.innerText = `Congratulations! You finished in ${time} seconds with a score of ${score}.`;
    if (updateHighScore(time, score)) {
        highScoreMessage.innerText = `New High Score! Fastest Time: ${time} seconds, Highest Score: ${score}`;
    } else {
        highScoreMessage.innerText = `High Score: ${highScore} points, Best Time: ${bestTime} seconds`;
    }
    resultModal.style.display = "block";
}

// 게임 시작 함수
function startGame() {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(word => `<span>${word} </span>`);
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';

    typedValueElement.value = '';
    messageElement.innerText = '';
    typedValueElement.disabled = false;
    startButton.disabled = true;
    typedValueElement.focus();
    startTime = new Date().getTime();

    // 다시 10000점 시작, 0.01초마다 1점씩 갂임
    score = 10000;
    scoreInterval = setInterval(() => {
        score--;
    }, 10);

    typedValueElement.addEventListener('input', handleTyping);
}

// 타이핑 입력 처리 함수
function handleTyping() {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value.trim();

    // 타이핑 중 효과 적용
    typedValueElement.classList.add('typing-effect');

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // 게임 완료
        const elapsedTime = ((new Date().getTime() - startTime) / 1000).toFixed(2);
        clearInterval(scoreInterval); // 점수 감소 중지
        typedValueElement.disabled = true;
        startButton.disabled = false;
        typedValueElement.removeEventListener('input', handleTyping);

        // 효과 적용
        typedValueElement.classList.remove('typing-effect', 'error-effect');
        typedValueElement.classList.add('completed');

        showModalMessage(elapsedTime, score); // 결과 모달 표시

    } else if (typedValue === currentWord) {
        // 올바른 단어 입력 시 다음 단어로 이동
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        if (quoteElement.childNodes[wordIndex]) {
            quoteElement.childNodes[wordIndex].className = 'highlight';
        }

        // 효과 업데이트
        typedValueElement.classList.remove('typing-effect', 'error-effect');
        typedValueElement.classList.add('completed');
    } else if (currentWord.startsWith(typedValue)) {
        // 올바르게 입력 중
        typedValueElement.classList.remove('error-effect');
    } else {
        // 잘못된 입력 효과 적용
        typedValueElement.classList.add('error-effect');
    }
}