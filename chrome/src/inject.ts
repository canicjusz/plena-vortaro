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
  .PIValdonajxo * {
    font-family: "Open Sans", sans-serif !important;
    opacity: 1 !important;
    display: inline !important;
    visibility: visible !important;
    position: relative !important;
    font-size: 1em !important;
    line-height: initial !important;
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

  const addContentToDiv = (
    { vortoj: words, pivdok }: akiritaJSONo,
    div: HTMLElement
  ) => {
    const parser = new DOMParser();
    const pivdokHTML = parser.parseFromString(pivdok, "text/html");
    if (words[0] === undefined) {
      addOtherMessage(div, "Ĉi tiu vorto ne troveblas en PIV");
    } else {
      addDefinitions(div, pivdokHTML, words);
    }
    body.appendChild(div);
  };
  const addConnectionMessage = (div: HTMLElement) => {
    addOtherMessage(
      div,
      "Ne povis konekti al PIV. Bonvolu kontroli vian konekton."
    );
    body.appendChild(div);
  };
  const makeRequest = (word: string, div: HTMLElement) => {
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
    chrome.runtime.sendMessage({ URLaddress }, (response?: akiritaJSONo) => {
      if (response) {
        addContentToDiv(response, div);
      } else {
        addConnectionMessage(div);
      }
    });
  };

  const addOtherMessage = (div: HTMLElement, message: string) => {
    const strong = document.createElement("strong");
    strong.textContent = message;
    div.appendChild(strong);
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
      position: "absolute",
      background: backgroundLocal.color,
      "border-width": borderLocal.width + "px",
      "border-color": borderLocal.color,
      "border-style": "solid",
      width: "300px",
      height: "300px",
      padding: "10px",
      overflowY: "auto",
      fontSize: textLocal.size + "px",
      color: textLocal.color,
      zIndex: "2147483647",
      "box-sizing": "border-box",
      "font-family": '"Open Sans", sans-serif',
      "line-height": "initial",
    });
    div.className = "PIValdonajxo";
    div.setAttribute("number", String(number));
    makeRequest(word, div);
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
    const selection = window.getSelection();
    const word = selection.toString().trim().toLowerCase();
    const contElements = [...document.querySelectorAll("[contenteditable]")];
    const element = <HTMLElement>e.target;
    const isInCont = contElements.some((contElement) =>
      contElement.contains(element)
    );
    if (
      e.button === 0 &&
      !selection.isCollapsed &&
      turnedOnLocally &&
      /^[À-ž\w\d\s.,\-;]+$/.test(word) &&
      !isInCont
    ) {
      const number = generateNumber(element);
      if (!document.querySelector('.PIValdonajxo[number="' + number + '"]')) {
        createDiv(selection.getRangeAt(0), number, word);
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

  // window.addEventListener(
  //   "scroll",
  //   (e) => {
  //     if (turnedOnLocally && document.querySelector(".PIValdonajxo")) {
  //       const addonElements = [...document.querySelectorAll(".PIValdonajxo")];
  //       const bound = getNumber(addonElements, e.target as HTMLElement);
  //       if (bound > 0) {
  //         deleteSubelements(addonElements, bound);
  //       } else {
  //         deleteAllElements(addonElements);
  //       }
  //       removeSelection();
  //     }
  //   },
  //   true
  // );

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
          "border-style": "solid",
          fontSize: textLocal.size + "px",
          color: textLocal.color,
        });
      });
    }
  );
})();
