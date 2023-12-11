document.addEventListener('DOMContentLoaded', () => {
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

    let shuffledCards = shuffle(cards);
    let flippedCards = [];
    let matchedCards = [];

    const gameContainer = document.getElementById('game-container');

    // Create and display cards
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.textContent = card;
        cardElement.addEventListener('click', flipCard);
        gameContainer.appendChild(cardElement);
    });

    function flipCard() {
        const selectedCard = this;

        // Prevent flipping more than 2 cards
        if (flippedCards.length < 2 && !flippedCards.includes(selectedCard)) {
            // Display the card
            selectedCard.classList.add('flipped');
            flippedCards.push(selectedCard);

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.textContent === card2.textContent) {
            // Cards match
            matchedCards.push(card1, card2);
            if (matchedCards.length === cards.length) {
                alert('Congratulations! You have matched all the cards.');
            }
        } else {
            // Cards do not match, flip back
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
    }

    function shuffle(array) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
});
