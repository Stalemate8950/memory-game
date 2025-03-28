document.addEventListener('DOMContentLoaded', () => {
    const cards = ['Apple', 'Apple', 'Banana', 'Banana', 'Citrus', 'Citrus', 'Daniel', 'Daniel', 'Epricot', 'Epricot', 'Fudge', 'Fudge', 'Gwen', 'Gwen', 'Hi', 'Hi'];

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
    const hiddenButton = document.getElementById('hiddenButton');
    const embeddedPage = document.getElementById('embeddedPage');

    hiddenButton.addEventListener('click', () => {
    // Show the embedded page when the button is clicked
    embeddedPage.style.display = 'block';
    const iframe = embeddedPage.querySelector('iframe');
    // Set the iframe source to "multiplayer.gg/physics"
    iframe.src = 'https://multiplayer.gg/physics';

    // When the iframe loads, inject your external script
    iframe.addEventListener('load', () => {
        // Access the iframe's document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Create a new script element
        const script = iframeDoc.createElement('script');
        // Set the src to your external GreasyFork script file's URL (adjust path as needed)
        script.src = '/path/to/your/greasyforkScript.js';
        
        // Append the script to the head (or body) of the iframe's document
        iframeDoc.head.appendChild(script);
    });
});

