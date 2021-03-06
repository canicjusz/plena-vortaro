(() => {
  let relativeDiv: HTMLElement;
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

  const addDerivationsLinks = (div: HTMLElement, results: akiritaJSONo[]) => {
    addOtherMessage(
      div,
      "Jen vortoj kun tiu ??i radiko:",
      "PIValdonajxo__strong"
    );
    let ul: HTMLElement;
    results.forEach(({ vortoj: words, word }: akiritaJSONo, index) => {
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

  const findDerivations = (div: HTMLElement, word: string) => {
    addOtherMessage(
      div,
      "??i tiu vorto ne troveblas en PIV.",
      "PIValdonajxo__strong"
    );
    const searchingWarning = addOtherMessage(
      div,
      "Vortoj kun tiu ??i radiko estas ser??ataj.",
      "sercxataj PIValdonajxo__strong"
    );
    const aPromise = makeRequest(word + "a");
    const oPromise = makeRequest(word + "o");
    const ePromise = makeRequest(word + "e");
    const iPromise = makeRequest(word + "i");
    const promiseArray = [oPromise, aPromise, ePromise, iPromise];
    Promise.all(promiseArray).then((results) => {
      searchingWarning.remove();
      const derivationsExist = results.every(
        ({ vortoj: words }: akiritaJSONo) => words.length === 0
      );
      if (derivationsExist) {
        addOtherMessage(
          div,
          "Vortoj kun tiu ??i radiko ne troveblas en PIV.",
          "PIValdonajxo__strong"
        );
      } else {
        addDerivationsLinks(div, results);
      }
    });
  };

  const addContentToDiv = (
    { vortoj: words, pivdok, word }: akiritaJSONo,
    div: HTMLElement
  ) => {
    const parser = new DOMParser();
    const pivdokHTML = parser.parseFromString(pivdok, "text/html");
    div.firstChild.remove();
    if (words[0] === undefined) {
      findDerivations(div, word);
    } else {
      addDefinitions(div, pivdokHTML, words);
    }
  };

  const addConnectionMessage = (div: HTMLElement) => {
    addOtherMessage(
      div,
      "Ne povis konekti al PIV. Bonvolu kontroli vian konekton.",
      "PIValdonajxo__strong"
    );
  };

  const makeRequest = (word: string): Promise<akiritaJSONo> => {
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
    return new Promise((res) =>
      chrome.runtime.sendMessage({ URLaddress }, (response?: akiritaJSONo) =>
        res({ ...response, word })
      )
    );
  };

  const addWaitingMessage = (div: HTMLElement) => {
    const strong = document.createElement("strong");
    strong.textContent =
      "La vorto estas ser??ata. Se vi estas devigita longe atendi, bonvolu kontroli vian konekton.";
    div.appendChild(strong);
  };

  const addOtherMessage = (
    div: HTMLElement,
    message: string,
    className?: string
  ) => {
    const strong = document.createElement("strong");
    strong.textContent = message;
    strong.className = className;
    div.appendChild(strong);
    return strong;
  };
  const addRootDefinitions = (children: ChildNode[], div: HTMLElement) =>
    children.forEach((child) => {
      div.appendChild(child);
    });

  const addDerivationsDefinitons = (
    children: HTMLElement[],
    div: HTMLElement
  ) =>
    children.forEach((child) => {
      if (
        (child.nodeType === 1 && !child.classList.contains("derivajho")) ||
        child.nodeType === 3
      ) {
        div.appendChild(child);
      }
    });

  const addDefinitions = (
    div: HTMLElement,
    pivdok: HTMLDocument,
    words: akiritaJSONo["vortoj"]
  ) => {
    div.classList.add("PIValdonajxo-w-definitions");
    words.forEach(([word]: number[]) => {
      const dword = pivdok.querySelector("#d" + word);
      const kword = pivdok.querySelector("#k" + word);
      if (dword && dword.parentElement) {
        addRootDefinitions([...dword.parentElement.childNodes], div);
      } else if (kword && kword.parentElement) {
        addDerivationsDefinitons(
          [...(<NodeListOf<HTMLElement>>kword.parentElement.childNodes)],
          div
        );
      }
    });
  };

  const getTop = (divRect: DOMRect, rangeRect: DOMRect) =>
    rangeRect.bottom - divRect.top > document.documentElement.scrollHeight - 300
      ? rangeRect.top - divRect.bottom - 300
      : rangeRect.bottom - divRect.top;

  const getLeft = (divRect: DOMRect, rangeRect: DOMRect) =>
    rangeRect.left - divRect.left > document.documentElement.scrollWidth - 300
      ? rangeRect.left - divRect.left - 300 + rangeRect.width
      : rangeRect.left - divRect.left;

  const createDiv = (range: Range, number: number, word: string) => {
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
    responsePromise.then((response: akiritaJSONo | false) =>
      response ? addContentToDiv(response, div) : addConnectionMessage(div)
    );
  };

  const generateNumber = (target: HTMLElement) => {
    const addonElements = [
      ...document.querySelectorAll<HTMLElement>(".PIValdonajxo"),
    ];
    return (
      Number(
        addonElements
          .find((element) => element.contains(target))
          ?.getAttribute("number")
      ) + 1 || 1
    );
  };

  document.addEventListener("mouseup", (e) => {
    const element = <HTMLElement>e.target;
    const selection = window.getSelection();
    if (element.classList.contains("PIValdonajxo__link")) {
      selection.removeAllRanges();
      let range = document.createRange();
      range.selectNode(element);
      selection.addRange(range);
      const number = generateNumber(element);
      createDiv(range, number, element.innerText);
      selection.removeRange(range);
    } else {
      const word = selection.toString().trim().toLowerCase();
      const contElements = [...document.querySelectorAll("[contenteditable]")];
      const isInCont = contElements.some((contElement) =>
        contElement.contains(element)
      );
      if (
        e.button === 0 &&
        !selection.isCollapsed &&
        turnedOnLocally &&
        /^[??-??\w\d\s.,\-;]+$/.test(word) &&
        !isInCont
      ) {
        const number = generateNumber(element);
        if (!document.querySelector('.PIValdonajxo[number="' + number + '"]')) {
          createDiv(selection.getRangeAt(0), number, word);
        }
      }
    }
  });

  const deleteSubelements = (elements: Element[], bound: number) =>
    elements.forEach((element) => {
      const number = Number(element.getAttribute("number"));
      if (number > bound) {
        element.remove();
      }
    });
  const deleteAllElements = (elements: Element[] | NodeListOf<Element>) =>
    elements.forEach((element) => {
      element.remove();
    });
  const removeSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };
  const getNumber = (elements: Element[], target: HTMLElement) =>
    Number(
      elements
        .find((element) => element.contains(target))
        ?.getAttribute("number")
    ) || 0;

  document.addEventListener("mousedown", (e) => {
    const contElements = [...document.querySelectorAll("[contenteditable]")];
    const element = <HTMLElement>e.target;
    const isInCont = contElements.some((contElement) =>
      contElement.contains(element)
    );
    if (e.button === 0 && turnedOnLocally && !isInCont) {
      const addonElements = [...document.querySelectorAll(".PIValdonajxo")];
      const bound = getNumber(addonElements, element);
      if (bound > 0) {
        deleteSubelements(addonElements, bound);
      } else {
        deleteAllElements(addonElements);
      }
      removeSelection();
    }
  });

  chrome.storage.sync.get(
    ["turnedOn", "background", "text", "border"],
    ({ turnedOn, background, text, border }) => {
      if (turnedOn === undefined) turnedOn = true;
      turnedOnLocally = turnedOn;
      if (background && text && border) {
        backgroundLocal = background;
        textLocal = text;
        borderLocal = border;
      }
    }
  );
  chrome.storage.onChanged.addListener(
    ({ turnedOn, background, text, border }) => {
      if (turnedOn) {
        turnedOnLocally = turnedOn.newValue;
        if (turnedOnLocally === false) {
          const addonElements = document.querySelectorAll(".PIValdonajxo");
          deleteAllElements(addonElements);
        }
      }
      if (background) backgroundLocal = background.newValue;
      if (text) textLocal = text.newValue;
      if (border) borderLocal = border.newValue;
      const addonElements =
        document.querySelectorAll<HTMLElement>(".PIValdonajxo");
      addonElements.forEach((element) => {
        Object.assign(element.style, {
          background: backgroundLocal.color,
          "border-width": borderLocal.width + "px",
          "border-color": borderLocal.color,
          fontSize: textLocal.size + "px",
          color: textLocal.color,
        });
      });
    }
  );
})();
