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

// 게임 시작 함수
function startGame() {
    // 무작위 인용문 선택
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;

    // 인용문 표시
    const spanWords = words.map(word => `<span>${word} </span>`);
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';

    // 입력창 및 메시지 초기화
    typedValueElement.value = '';
    messageElement.innerText = '';
    typedValueElement.disabled = false;  // 입력 활성화
    startButton.disabled = true; // 게임 중 버튼 비활성화
    typedValueElement.focus();
    startTime = new Date().getTime();

    // 타이핑 이벤트 리스너 추가
    typedValueElement.addEventListener('input', handleTyping);
}

// 타이핑 입력 처리 함수
function handleTyping() {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value.trim();

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // 게임 완료
        const elapsedTime = new Date().getTime() - startTime;
        messageElement.innerText = `CONGRATULATIONS! You finished in ${(elapsedTime / 1000).toFixed(2)} seconds.`;
        typedValueElement.disabled = true;  // 입력 비활성화
        startButton.disabled = false;  // 버튼 활성화
        typedValueElement.removeEventListener('input', handleTyping);  // 입력 리스너 제거
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
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';  // 현재까지 올바르게 입력
    } else {
        typedValueElement.className = 'error';  // 잘못된 입력
    }
}

// 시작 버튼 클릭 이벤트
startButton.addEventListener('click', startGame);