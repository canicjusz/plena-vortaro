"use strict";

(() => {
  let turnedOnLocally = true;
  chrome.runtime.onMessage.addListener(
    ({ URLaddress }, sender, sendResponse) => {
      fetch(URLaddress)
        .then((res) => res.json())
        .then((json) => sendResponse(json))
        .catch(() => {
          sendResponse();
        });
      return true;
    }
  );
  const updateIcons = () => {
    if (turnedOnLocally) {
      chrome.action.setIcon({
        path: {
          16: "icons/on_16.png",
          32: "icons/on_32.png",
          128: "icons/on_128.png",
        },
      });
      chrome.action.setTitle({ title: "Aldono ŝaltita" });
    } else {
      chrome.action.setIcon({
        path: {
          16: "icons/off_16.png",
          32: "icons/off_32.png",
          128: "icons/off_128.png",
        },
      });
      chrome.action.setTitle({ title: "Aldono malŝaltita" });
    }
  };
  chrome.storage.sync.get("turnedOn", ({ turnedOn }) => {
    if (turnedOn === undefined) turnedOn = true;
    turnedOnLocally = turnedOn;
    updateIcons();
  });
  chrome.storage.onChanged.addListener(({ turnedOn }) => {
    if (turnedOn) {
      turnedOnLocally = turnedOn.newValue;
      updateIcons();
    }
  });
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("install/index.html"),
    });
  });
})();
