(() => {
  let rootContainer: HTMLElement;
  let root: ShadowRoot;
  const body = document.body;

  createRootContainer();

  const local = {
    background: {
      color: "#f8ebe8",
    },
    text: {
      color: "#000",
      size: 15,
    },
    border: {
      color: "#000",
      width: 1,
    },
    turnedOn: true,
  };

  function createStyle() {
    const style = document.createElement("style");
    // css reset - https://meyerweb.com/eric/tools/css/reset/
    style.textContent = `
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    .PIValdonajxo * {
      all: revert;
    }
    .PIValdonajxo {
      z-index: 2147483647 !important;
      box-sizing: border-box !important;
      position: absolute !important;
      overflow-y: auto !important;
      border-style: solid !important;
      width: 300px !important;
      height: 300px !important;
      padding: 10px !important;
      font-family: 'Open-sans', sans-serif !important;
      line-height: 1.5 !important;
    }
    .PIValdonajxo__link {
      text-decoration: underline;
      cursor: pointer;
    }
    .PIValdonajxo__list {
      margin: 0;
    }
  `;

    root.appendChild(style);
  }

  function createRootContainer() {
    rootContainer = document.createElement("div");
    // this is needed, because the rootContainer's position will be used to calculate the position of definition's container
    Object.assign(rootContainer.style, {
      position: "absolute",
      top: "0",
      left: "0",
    });
    rootContainer.classList.add("PIValdonajxo-root");

    body.appendChild(rootContainer);

    rootContainer.attachShadow({ mode: "open" });
    root = rootContainer.shadowRoot;

    createStyle();
  }

  function addDerivationsLinks(
    definitionContainer: HTMLElement,
    results: akiritaJSONo[]
  ) {
    createStrongElement(
      definitionContainer,
      " Jen vortoj kun tiu ĉi radiko:",
      "PIValdonajxo__strong"
    );

    const ul = document.createElement("ul");
    ul.classList.add("PIValdonajxo__list");
    definitionContainer.appendChild(ul);

    results.forEach(({ word }: akiritaJSONo) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.classList.add("PIValdonajxo__link");
      span.textContent = word;

      li.appendChild(span);
      ul.appendChild(li);
    });
  }

  function findDerivations(definitionContainer: HTMLElement, word: string) {
    createStrongElement(
      definitionContainer,
      "Ĉi tiu vorto ne troveblas en PIV.",
      "PIValdonajxo__strong"
    );

    const searchingWarning = createStrongElement(
      definitionContainer,
      " Vortoj kun tiu ĉi radiko estas serĉataj.",
      "sercxataj PIValdonajxo__strong"
    );

    const suffixes = ["a", "o", "e", "i"];
    const promiseArray = suffixes.map((suffix) => makeRequest(word + suffix));

    Promise.all(promiseArray).then((results: akiritaJSONo[]) => {
      searchingWarning.remove();

      const derivationsExist = results.every(
        ({ artikoloj: articles_number }) => articles_number
      );

      if (derivationsExist) {
        addDerivationsLinks(definitionContainer, results);
      } else {
        createStrongElement(
          definitionContainer,
          " Vortoj kun tiu ĉi radiko ne troveblas en PIV.",
          "PIValdonajxo__strong"
        );
      }
    });
  }

  function parseHTML(html: string) {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  function addContent(
    { vortoj: words, pivdok, word }: akiritaJSONo,
    definitionContainer: HTMLElement
  ) {
    const pivdokHTML = parseHTML(pivdok);

    definitionContainer.firstChild.remove();

    if (words.length) {
      addDefinitions(definitionContainer, pivdokHTML, words);
    } else {
      findDerivations(definitionContainer, word);
    }
  }

  function makeRequest(word: string) {
    // After reading https://vortaro.net/klarigoj.html I came to the conclusion that:
    // s - search query
    // fakoj - only of certain subject
    // kap - headword
    // der - derivation
    // cet - occuring in other definitions
    // uskle - case-sensitive
    // artikoloj_jamaj - has to do something with the number of already shown articles,
    // I think it's only used for vortaro.net front-end's sake
    const queryObject = {
      s: word,
      fakoj: "",
      kap: true,
      der: true,
      cet: false,
      uskle: false,
      artikoloj_jamaj: 0,
    };

    const queryString = encodeURIComponent(JSON.stringify(queryObject));
    const URLaddress = "https://vortaro.net/py/serchi.py?m=" + queryString;

    return new Promise((res) =>
      chrome.runtime.sendMessage({ URLaddress }, (response?: akiritaJSONo) =>
        res({ ...response, word })
      )
    );
  }

  function createStrongElement(
    definitionContainer: HTMLElement,
    message: string,
    className?: string
  ) {
    const strong = document.createElement("strong");
    strong.textContent = message;
    strong.className = className;
    definitionContainer.appendChild(strong);
    return strong;
  }

  function addDefinitions(
    definitionContainer: HTMLElement,
    pivdok: Document,
    words: akiritaJSONo["vortoj"]
  ) {
    definitionContainer.classList.add("PIValdonajxo-w-definitions");
    words.forEach(([word]: number[]) => {
      // you can search for a derivative or a headword,
      // it's impossible to determine what kind of word you searched,
      // therefore we have to look for the word using it's id in the HTML from PIV
      const derivation = pivdok.querySelector("#d" + word);
      const headword = pivdok.querySelector("#k" + word);

      let elements: ChildNode[];

      if (derivation) {
        elements = [...derivation.parentElement.childNodes];
      } else if (headword) {
        elements = [...headword.parentElement.childNodes].filter(
          // strip off unnecesary derivations (we only want the definition of the headword)
          (el: HTMLElement) =>
            !(el.nodeType === 1 && el.classList.contains("derivajho"))
        );
      }
      elements.forEach((element) => {
        definitionContainer.appendChild(element);
      });
    });
  }

  // some math, don't touch
  const getTop = (elementRect: DOMRect, rangeRect: DOMRect) =>
    rangeRect.bottom - elementRect.top >
    document.documentElement.scrollHeight - 300
      ? rangeRect.top - elementRect.bottom - 300
      : rangeRect.bottom - elementRect.top;

  const getLeft = (elementRect: DOMRect, rangeRect: DOMRect) =>
    rangeRect.left - elementRect.left >
    document.documentElement.scrollWidth - 300
      ? rangeRect.left - elementRect.left - 300 + rangeRect.width
      : rangeRect.left - elementRect.left;

  function createDefinitionContainer(
    range: Range,
    number: number,
    word: string
  ) {
    // just in case, if some script decides to clear the body element
    if (!document.querySelector(".PIValdonajxo-root")) {
      createRootContainer();
    }

    const rootContainerRect = rootContainer.getBoundingClientRect();
    const rangeRect = range.getBoundingClientRect();
    const top = getTop(rootContainerRect, rangeRect);
    const left = getLeft(rootContainerRect, rangeRect);

    const definitionContainer = document.createElement("div");

    Object.assign(definitionContainer.style, {
      left: left + "px",
      top: top + "px",
      background: local.background.color,
      "border-width": local.border.width + "px",
      "border-color": local.border.color,
      fontSize: local.text.size + "px",
      color: local.text.color,
    });

    definitionContainer.className = "PIValdonajxo";
    definitionContainer.setAttribute("number", String(number));

    createStrongElement(
      definitionContainer,
      "La vorto estas serĉata. Se vi estas devigita longe atendi, bonvolu kontroli vian konekton.",
      "PIValdonajxo__strong"
    );

    root.appendChild(definitionContainer);

    const responsePromise = makeRequest(word);
    responsePromise.then((response: akiritaJSONo | false) =>
      response
        ? addContent(response, definitionContainer)
        : createStrongElement(
            definitionContainer,
            "Ne povis konekti al PIV. Bonvolu kontroli vian konekton.",
            "PIValdonajxo__strong"
          )
    );
  }

  function isInContentEditable(element) {
    const contElements = [...document.querySelectorAll("[contenteditable]")];
    return contElements.some((contElement) => contElement.contains(element));
  }

  function isInLatinScript(word) {
    return /^[À-ž\w\d\s.,\-;]+$/.test(word);
  }

  function hasOccuredInRoot() {
    const selection = window.getSelection();
    return selection.type === "Range" && selection.isCollapsed;
  }

  function selectTextArtificially(element) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNode(element);
    selection.addRange(range);
    return range;
  }

  document.addEventListener("mouseup", (e) => {
    let selection = window.getSelection();
    const originalTarget = <HTMLElement>e.composedPath()[0];

    if (originalTarget.classList.contains("PIValdonajxo__link")) {
      const number = getNumber(originalTarget) + 1;
      // when clicked on a derivation's link, create a range incorporating the link's text
      const range = selectTextArtificially(originalTarget);
      deleteDefinitionContainer(number);
      createDefinitionContainer(range, number, originalTarget.innerText);
      selection.removeAllRanges();
    } else {
      const number = hasOccuredInRoot() ? getNumber(originalTarget) + 1 : 1;
      const word = selection.toString().trim().toLowerCase();
      if (
        e.button === 0 &&
        // check if anything is selected
        selection.type === "Range" &&
        local.turnedOn &&
        isInLatinScript(word) &&
        !isInContentEditable(originalTarget)
      ) {
        if (hasOccuredInRoot()) {
          selection = root.getSelection();
        }
        createDefinitionContainer(selection.getRangeAt(0), number, word);
      }
    }
  });

  function deleteDefinitionContainer(bound: number) {
    const addonElements = root.querySelectorAll(".PIValdonajxo");
    addonElements.forEach((element) => {
      const number = Number(element.getAttribute("number"));
      if (number > bound) {
        element.remove();
      }
    });
  }

  function deleteAllDefinitionContainers() {
    const addonElements = root.querySelectorAll(".PIValdonajxo");
    addonElements.forEach((element) => {
      element.remove();
    });
  }

  function getNumber(target: EventTarget) {
    let element = <HTMLElement>target;
    while (!element.classList.contains("PIValdonajxo")) {
      element = element.parentElement;
    }
    return +element.getAttribute("number");
  }

  document.addEventListener("mousedown", (e) => {
    const originalTarget = e.composedPath()[0];
    const element = <HTMLElement>e.target;
    if (
      e.button === 0 &&
      local.turnedOn &&
      !isInContentEditable(originalTarget)
    ) {
      if (element === root.host) {
        const bound = getNumber(originalTarget);
        deleteDefinitionContainer(bound);
      } else {
        deleteAllDefinitionContainers();
      }
      // prevents mouseup and mousedown events from retriggering
      const selection = window.getSelection();
      selection.removeAllRanges();
    }
  });

  // context menu event
  chrome.runtime.onMessage.addListener(() => {
    let selection = window.getSelection();
    // the node in which the selection ends
    let focusNode = selection.focusNode;
    if (hasOccuredInRoot()) {
      selection = root.getSelection();
      focusNode = selection.focusNode;
    }
    const word = selection.toString().trim().toLowerCase();
    if (
      local.turnedOn &&
      isInLatinScript(word) &&
      !isInContentEditable(focusNode)
    ) {
      let number = 1;
      if (hasOccuredInRoot()) {
        const bound = getNumber(focusNode.parentElement);
        number = bound + 1;
        deleteDefinitionContainer(bound);
      } else {
        deleteAllDefinitionContainers();
      }
      createDefinitionContainer(selection.getRangeAt(0), number, word);
    }
  });

  function setInitSettings({ turnedOn, background, text, border }) {
    if (turnedOn === undefined) turnedOn = true;
    local.turnedOn = turnedOn;
    if (background && text && border) {
      local.background = background;
      local.text = text;
      local.border = border;
    }
  }

  chrome.storage.sync.get(
    ["turnedOn", "background", "text", "border"],
    setInitSettings
  );

  function updateDefinitionContainers() {
    const addonElements = root.querySelectorAll<HTMLElement>(".PIValdonajxo");
    addonElements.forEach((element) => {
      Object.assign(element.style, {
        background: local.background.color,
        "border-width": local.border.width + "px",
        "border-color": local.border.color,
        fontSize: local.text.size + "px",
        color: local.text.color,
      });
    });
  }

  function updateSettings({
    turnedOn,
    background,
    text,
    border,
  }: {
    [key: string]: chrome.storage.StorageChange;
  }) {
    if (turnedOn) {
      local.turnedOn = turnedOn.newValue;
      if (!local.turnedOn) {
        deleteAllDefinitionContainers();
      }
    }
    if (background) local.background = background.newValue;
    if (text) local.text = text.newValue;
    if (border) local.border = border.newValue;
    if (background || text || border) {
      updateDefinitionContainers();
    }
  }

  chrome.storage.onChanged.addListener(updateSettings);
})();
