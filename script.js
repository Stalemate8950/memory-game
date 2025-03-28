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
        // Set the iframe source to "multiplayer.gg/physics"
        embeddedPage.querySelector('iframe').src = 'https://bonk.io/';
    });

    const iframe = document.getElementById('multiplayerIframe');

    iframe.addEventListener('load', () => {
        injectGreasyForkScript(iframe);
    });
});

function injectGreasyForkScript(iframe) {
    // Create a script element
    const script = document.createElement('script');
    
    // Set the type and content of the script
    script.type = 'text/javascript';
    script.textContent = `
        (function () {
            'use strict';

            const pd_func = document.getElementById('maingameframe').contentWindow.Event.prototype.preventDefault;

            document.getElementById('maingameframe').contentWindow.Event.prototype.preventDefault = function() {
                const ev = this;
                if (ev.ctrlKey || ev.shiftKey || (ev.key?.[0] === 'F' && ev.key?.length > 1)) return;
                const bound_pd = pd_func.bind(ev);
                bound_pd();
            };

            let style1 = `
            <style>
                body { overflow: hidden; }
                #bonkioheader { display: none; }
                #adboxverticalleftCurse { display: none; }
                #adboxverticalCurse { display: none; }
                #descriptioncontainer { display: none; }
                #maingameframe { margin: 0 !important; }
            </style>
            `;
            document.head.insertAdjacentHTML("beforeend", style1);

            window.addEventListener('load', () => {
                let frame = document.getElementById('maingameframe');
                let frameDoc = document.getElementById('maingameframe').contentDocument;

                let setup;
                let observer = new MutationObserver((mutations, me) => {
                    if (frameDoc.getElementById('roomlisttopbar')) {
                        me.disconnect(); // stop observing
                        setup();
                        return;
                    }
                });
                observer.observe(frameDoc, {
                    childList: true,
                    subtree: true
                });

                setup = () => {
                    let placeholderStyler = `
                    <style>
                        [contenteditable=true]:empty:before {
                            content: attr(placeholder);
                            pointer-events: none;
                            display: block; /* For Firefox */
                            color: #757575;
                        }
                    </style>
                    `;
                    frameDoc.head.insertAdjacentHTML("beforeend", placeholderStyler);

                    console.log(document.head);

                    let $ = frame.contentWindow.$;

                    function filterRooms(s) {
                        s = s.toLowerCase();
                        let matches = el => el.children[0].textContent.toLowerCase().includes(s);
                        $('#roomlisttable tr').each((i, el) => {
                            el.hidden = !matches(el);
                        });
                    }

                    let inp = `<span contentEditable="true" type="text" id="roomSearchInputBox" placeholder="Search Rooms.." style="
                        float: right;
                        padding: 2px 8px;
                        margin: 5px 20px;
                        border: 2px solid #006157;
                        border-radius: 5px;
                        font: large futurept_b1;
                        width: 20%;
                        background: white;
                    "></span>`;

                    $('#roomlisttopbar').append(inp);

                    function debounce (fn) {
                        let timeout;

                        return function () {
                            let context = this;
                            let args = arguments;

                            if (timeout) {
                                window.cancelAnimationFrame(timeout);
                            }

                            timeout = window.requestAnimationFrame(function () {
                                fn.apply(context, args);
                            });
                        };
                    }

                    $('#roomSearchInputBox').keyup(debounce(ev => filterRooms(ev.target.textContent)));

                    $('body').keydown(debounce(ev => {
                        if (ev.altKey) {
                            if (ev.key === 'q' && $('#roomListContainer')[0].offsetParent === null) {
                                $('#pretty_top_exit').click(); $('#leaveconfirmwindow_okbutton').click();
                            }
                            else if (ev.key === 'r') {$('#roomlistrefreshbutton').click();}
                        }
                        if (ev.key === '/') $('#roomSearchInputBox').focus();
                    }));

                /****** Implemented by Chaz *******
                // Can double click room to trigger join
                let room_join_dblclick_handler = (ev) => $("#roomlistjoinbutton").click();
                $("#roomlisttable").on("dblclick", "tr", room_join_dblclick_handler);

                // Press enter to submit password for joining room
                let room_pass_enter_handler = (ev) => {
                    ev.key === "Enter" && $("#roomlistpassjoinbutton").click();
                };
                $("#roomlistjoinpasswordtext").on("keydown", room_pass_enter_handler);
        *******/
                };
            });
        })();
    `;

    // Append the script to the iframe's document
    iframe.contentDocument.head.appendChild(script);
}
