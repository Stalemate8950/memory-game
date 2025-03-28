// ==UserScript==
// @name         Bonk.io Custom Mods
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Some custom enhancements to bonk.io
// @author       You
// @match        https://multiplayer.gg/physics/
// @grant        none
// ==/UserScript==

/* jshint esversion:6 */

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
        let frameDoc = frame.contentDocument;

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
                    if (timeout) window.cancelAnimationFrame(timeout);
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
        };
    });
})();
