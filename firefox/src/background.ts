(() => {
  let turnedOnLocally = true;

  browser.runtime.onMessage.addListener(
    ({ URLaddress }, sender, sendResponse) => {
      fetch(URLaddress)
        .then((res) => res.json())
        .then((json: akiritaJSONo) => sendResponse(json))
        .catch(() => {
          sendResponse();
        });
      return true;
    }
  );

  const updateIcons = () => {
    if (turnedOnLocally) {
      browser.browserAction.setIcon({
        path: {
          "16": "icons/on_16.png",
          "32": "icons/on_32.png",
          "128": "icons/on_128.png",
        },
      });
      browser.browserAction.setTitle({ title: "Aldono ŝaltita" });
    } else {
      browser.browserAction.setIcon({
        path: {
          "16": "icons/off_16.png",
          "32": "icons/off_32.png",
          "128": "icons/off_128.png",
        },
      });
      browser.browserAction.setTitle({ title: "Aldono malŝaltita" });
    }
  };

  browser.storage.sync.get("turnedOn").then(({ turnedOn }) => {
    if (turnedOn === undefined) turnedOn = true;
    turnedOnLocally = turnedOn;
    updateIcons();
  });
  browser.storage.onChanged.addListener(({ turnedOn }) => {
    turnedOnLocally = turnedOn.newValue;
    updateIcons();
  });
  browser.runtime.onInstalled.addListener(() => {
    browser.tabs.create({
      url: browser.runtime.getURL("install/index.html"),
    });
  });
  browser.contextMenus.create(
    {
      id: "log-selection",
      title: "Montri la difinojn",
      contexts: ["selection"],
    },
    function () {}
  );
  browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.tabs.sendMessage(tab.id, info);
  });
})();
