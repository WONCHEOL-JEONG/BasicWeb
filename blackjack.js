// blackjack.js
let playerCardOne = 7;
let playerCardTwo = 5;
let playerSum = playerCardOne + playerCardTwo;

let dealerCardOne = 7;
let dealerCardTwo = 5;
let dealerSum = dealerCardOne + dealerCardTwo;

let playerCardThree = 7;
playerSum += playerCardThree;

if (playerSum > 21) {
    console.log('Bust! You lost');
} else if (playerSum === 21) {
    console.log('Blackjack! You win!');
} else {
    console.log(`You have ${playerSum} points`);
}


let dealerCardThree = 6;
dealerSum += dealerCardThree;

while (dealerSum < 17) {
    let additionalCard = 3;
    dealerSum += additionalCard;
    console.log(`Dealer draws a card, new total: ${dealerSum}`);
}

if (dealerSum > 21) {
    console.log('Dealer busts! You win!'); // player win
} else if (playerSum > 21) {
    console.log('You bust! Dealer wins!'); // dealer win
} else if (playerSum > dealerSum) {
    console.log('You win!'); // Player win
} else if (dealerSum > playerSum) {
    console.log('Dealer wins!'); // Dealer win
} else {
    console.log('It\'s a draw!');
}