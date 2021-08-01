'use strict';

(() => {
    let relativeDiv;
    const body = document.body;
    const head = document.head;
    let turnedOnLocally = true;
    let backgroundLocal = { color: "#f8ebe8" };
    let textLocal = { color: "#000", size: 15 };
    let borderLocal = { color: "#000", width: 1 };
    const createStyle = () => {
        const style = document.createElement("style");
        style.textContent = `
    .PIValdonajxo {
      z-index: 2147483647 !important;
      box-sizing: border-box !important;
      font-family: "Open Sans", sans-serif !important;
      line-height: 1.25em !important;
      vertical-align: initial !important;
      position: absolute !important;
      overflow-y: auto !important;
      border-style: solid !important;
      width: 300px !important;
      height: 300px !important;
      padding: 10px !important;
    }
    .PIValdonajxo * {
      font: revert !important;
    }
    .PIValdonajxo-w-definitions *:not(sub, sup) {
      opacity: 1 !important;
      display: inline !important;
      visibility: visible !important;
      position: relative !important;
      line-height: 1.25em !important;
      vertical-align: initial !important;
    }
    .PIValdonajxo-w-definitions sup, .PIValdonajxo sub {
      opacity: 1 !important;
      display: inline !important;
      visibility: visible !important;
      position: relative !important;
      font-size: smaller !important;
      line-height: 1.25em !important;
      vertical-align: baseline !important;
    }
    .PIValdonajxo-w-definitions sup {
      top: -0.5em !important;
    }  
    .PIValdonajxo-w-definitions sub {
      bottom: -0.5em !important;
    }
    .PIValdonajxo__link {
      user-select: non !important;
      text-decoration: underline !important;
      cursor: pointer !important;
    }
    .PIValdonajxo__strong {
      display: block !important;
    }
    .PIValdonajxo__list {
      list-style: initial !important;
    }
  `;
        head.appendChild(style);
    };
    createStyle();
    const createRelativeDiv = () => {
        relativeDiv = document.createElement("div");
        Object.assign(relativeDiv.style, {
            position: "absolute",
            top: "0",
            left: "0",
        });
        body.appendChild(relativeDiv);
    };
    createRelativeDiv();
    const addDerivationsLinks = (div, results) => {
        addOtherMessage(div, "Jen vortoj kun tiu ĉi radiko:", "PIValdonajxo__strong");
        let ul;
        results.forEach(({ vortoj: words, word }, index) => {
            if (words[0]) {
                if (index === 0) {
                    ul = document.createElement("ul");
                    ul.classList.add("PIValdonajxo__list");
                    div.appendChild(ul);
                }
                const li = document.createElement("li");
                const span = document.createElement("span");
                span.classList.add("PIValdonajxo__link");
                span.textContent = word;
                li.appendChild(span);
                ul.appendChild(li);
            }
        });
    };
    const findDerivations = (div, word) => {
        addOtherMessage(div, "Ĉi tiu vorto ne troveblas en PIV.", "PIValdonajxo__strong");
        const searchingWarning = addOtherMessage(div, "Vortoj kun tiu ĉi radiko estas serĉataj.", "sercxataj PIValdonajxo__strong");
        const aPromise = makeRequest(word + "a");
        const oPromise = makeRequest(word + "o");
        const ePromise = makeRequest(word + "e");
        const iPromise = makeRequest(word + "i");
        const promiseArray = [oPromise, aPromise, ePromise, iPromise];
        Promise.all(promiseArray).then((results) => {
            searchingWarning.remove();
            const derivationsExist = results.every(({ vortoj: words }) => words.length === 0);
            if (derivationsExist) {
                addOtherMessage(div, "Vortoj kun tiu ĉi radiko ne troveblas en PIV.", "PIValdonajxo__strong");
            }
            else {
                addDerivationsLinks(div, results);
            }
        });
    };
    const addContentToDiv = ({ vortoj: words, pivdok, word }, div) => {
        const parser = new DOMParser();
        const pivdokHTML = parser.parseFromString(pivdok, "text/html");
        div.firstChild.remove();
        if (words[0] === undefined) {
            findDerivations(div, word);
        }
        else {
            addDefinitions(div, pivdokHTML, words);
        }
    };
    const addConnectionMessage = (div) => {
        addOtherMessage(div, "Ne povis konekti al PIV. Bonvolu kontroli vian konekton.", "PIValdonajxo__strong");
    };
    const makeRequest = (word) => {
        const requestObject = {
            s: word,
            fakoj: "",
            kap: true,
            der: true,
            cet: false,
            uskle: false,
            artikoloj_jamaj: 0,
        };
        const query = encodeURIComponent(JSON.stringify(requestObject));
        const URLaddress = "https://vortaro.net/py/serchi.py?m=" + query;
        return browser.runtime
            .sendMessage({ URLaddress })
            .then((response) => (Object.assign(Object.assign({}, response), { word })));
    };
    const addWaitingMessage = (div) => {
        const strong = document.createElement("strong");
        strong.textContent =
            "La vorto estas serĉata. Se vi estas devigita longe atendi, bonvolu kontroli vian konekton.";
        div.appendChild(strong);
    };
    const addOtherMessage = (div, message, className) => {
        const strong = document.createElement("strong");
        strong.textContent = message;
        strong.className = className;
        div.appendChild(strong);
        return strong;
    };
    const addRootDefinitions = (children, div) => children.forEach((child) => {
        div.appendChild(child);
    });
    const addDerivationsDefinitons = (children, div) => children.forEach((child) => {
        if ((child.nodeType === 1 && !child.classList.contains("derivajho")) ||
            child.nodeType === 3) {
            div.appendChild(child);
        }
    });
    const addDefinitions = (div, pivdok, words) => {
        div.classList.add("PIValdonajxo-w-definitions");
        words.forEach(([word]) => {
            const dword = pivdok.querySelector("#d" + word);
            const kword = pivdok.querySelector("#k" + word);
            if (dword && dword.parentElement) {
                addRootDefinitions([...dword.parentElement.childNodes], div);
            }
            else if (kword && kword.parentElement) {
                addDerivationsDefinitons([...kword.parentElement.childNodes], div);
            }
        });
    };
    const getTop = (divRect, rangeRect) => rangeRect.bottom - divRect.top > document.documentElement.scrollHeight - 300
        ? rangeRect.top - divRect.bottom - 300
        : rangeRect.bottom - divRect.top;
    const getLeft = (divRect, rangeRect) => rangeRect.left - divRect.left > document.documentElement.scrollWidth - 300
        ? rangeRect.left - divRect.left - 300 + rangeRect.width
        : rangeRect.left - divRect.left;
    const createDiv = (range, number, word) => {
        const divRect = relativeDiv.getBoundingClientRect();
        const rangeRect = range.getBoundingClientRect();
        const div = document.createElement("div");
        const top = getTop(divRect, rangeRect);
        const left = getLeft(divRect, rangeRect);
        Object.assign(div.style, {
            left: left + "px",
            top: top + "px",
            background: backgroundLocal.color,
            "border-width": borderLocal.width + "px",
            "border-color": borderLocal.color,
            fontSize: textLocal.size + "px",
            color: textLocal.color,
        });
        div.className = "PIValdonajxo";
        div.setAttribute("number", String(number));
        addWaitingMessage(div);
        body.appendChild(div);
        const responsePromise = makeRequest(word);
        responsePromise.then((response) => response ? addContentToDiv(response, div) : addConnectionMessage(div));
    };
    const generateNumber = (target) => {
        var _a;
        const addonElements = [
            ...document.querySelectorAll(".PIValdonajxo"),
        ];
        return (Number((_a = addonElements
            .find((element) => element.contains(target))) === null || _a === void 0 ? void 0 : _a.getAttribute("number")) + 1 || 1);
    };
    document.addEventListener("mouseup", (e) => {
        const selection = window.getSelection();
        const element = e.target;
        if (element.classList.contains("PIValdonajxo__link")) {
            selection.removeAllRanges();
            let range = document.createRange();
            range.selectNode(element);
            selection.addRange(range);
            const number = generateNumber(element);
            createDiv(range, number, element.innerText);
            selection.removeRange(range);
        }
        else {
            const contElements = [...document.querySelectorAll("[contenteditable]")];
            const word = selection.toString().trim().toLowerCase();
            const isInCont = contElements.some((contElement) => contElement.contains(element));
            if (e.button === 0 &&
                !selection.isCollapsed &&
                turnedOnLocally &&
                /^[À-ž\w\d\s.,\-;]+$/.test(word) &&
                !isInCont) {
                const number = generateNumber(element);
                if (!document.querySelector('.PIValdonajxo[number="' + number + '"]')) {
                    createDiv(selection.getRangeAt(0), number, word);
                }
            }
        }
    });
    const deleteSubelements = (elements, bound) => elements.forEach((element) => {
        const number = Number(element.getAttribute("number"));
        if (number > bound) {
            element.remove();
        }
    });
    const deleteAllElements = (elements) => elements.forEach((element) => {
        element.remove();
    });
    const removeSelection = () => {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    };
    const getNumber = (elements, target) => {
        var _a;
        return Number((_a = elements
            .find((element) => element.contains(target))) === null || _a === void 0 ? void 0 : _a.getAttribute("number")) || 0;
    };
    document.addEventListener("mousedown", (e) => {
        const contElements = [...document.querySelectorAll("[contenteditable]")];
        const element = e.target;
        const isInCont = contElements.some((contElement) => contElement.contains(element));
        if (e.button === 0 && turnedOnLocally && !isInCont) {
            const addonElements = [...document.querySelectorAll(".PIValdonajxo")];
            const bound = getNumber(addonElements, element);
            if (bound > 0) {
                deleteSubelements(addonElements, bound);
            }
            else {
                deleteAllElements(addonElements);
            }
            removeSelection();
        }
    });
    browser.storage.sync
        .get(["turnedOn", "background", "text", "border"])
        .then(({ turnedOn, background, text, border }) => {
        if (turnedOn === undefined)
            turnedOn = true;
        turnedOnLocally = turnedOn;
        if (background && text && border) {
            backgroundLocal = background;
            textLocal = text;
            borderLocal = border;
        }
    });
    browser.storage.onChanged.addListener(({ turnedOn }) => {
        turnedOnLocally = turnedOn.newValue;
        if (turnedOnLocally === false) {
            const addonElements = document.querySelectorAll(".PIValdonajxo");
            deleteAllElements(addonElements);
        }
    });
    browser.storage.onChanged.addListener(({ background, text, border }) => {
        backgroundLocal = background.newValue;
        textLocal = text.newValue;
        borderLocal = border.newValue;
        const addonElements = document.querySelectorAll(".PIValdonajxo");
        addonElements.forEach((element) => {
            Object.assign(element.style, {
                background: backgroundLocal.color,
                "border-width": borderLocal.width + "px",
                "border-color": borderLocal.color,
                "border-style": "solid",
                fontSize: textLocal.size + "px",
                color: textLocal.color,
            });
        });
    });
})();
