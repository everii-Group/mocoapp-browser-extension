import browser from "webextension-polyfill"
import ApiClient from "api/Client"
import { isChrome, getCurrentTab, getSettings, isBrowserTab } from "utils/browser"
import { sendMessage, onMessage } from "webext-bridge/background"
import { tabUpdated, settingsChanged, togglePopup, openPopup } from "utils/messageHandlers"
import { isNil } from "lodash"

// This is the main entry point for the background script
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!isBrowserTab(tab) && changeInfo.status === "complete") {
    tabUpdated(tab)
  }
})

function timerStoppedForCurrentService(service, timedActivity) {
  return timedActivity.service_id && timedActivity.service_id === service?.id
}

function resetBubble({ tab, settings, service, timedActivity }) {
  const apiClient = new ApiClient(settings)
  apiClient
    .activitiesStatus(service)
    .then(({ data }) => {
      sendMessage(
        "showBubble",
        {
          bookedSeconds: data.seconds,
          timedActivity: data.timed_activity,
          settingTimeTrackingHHMM: settings.settingTimeTrackingHHMM,
          service,
        },
        `content-script@${tab.id}`,
      )
    })
    .then(() => {
      if (isNil(timedActivity) || timerStoppedForCurrentService(service, timedActivity)) {
        sendMessage("closePopup", null, `content-script@${tab.id}`)
      } else {
        openPopup(tab, { service })
      }
    })
}

onMessage("togglePopup", (_message) => {
  getCurrentTab().then((tab) => {
    if (tab && !isBrowserTab(tab)) {
      sendMessage("requestService", null, `content-script@${tab.id}`).then((data) => {
        if (data) {
          togglePopup(tab)(data)
        }
      })
    }
  })
})

onMessage("closePopup", (_message) => {
  getCurrentTab().then((tab) => {
    sendMessage("closePopup", null, `content-script@${tab.id}`)
  })
})

onMessage("createActivity", (message) => {
  const { activity, service } = message.data
  getCurrentTab().then((tab) => {
    getSettings().then((settings) => {
      const apiClient = new ApiClient(settings)
      apiClient
        .createActivity(activity)
        .then(() => {
          resetBubble({ tab, settings, service })
        })
        .catch((error) => {
          if (error.response?.status === 422) {
            sendMessage("setFormErrors", error.response.data, `popup@${tab.id}`)
          }
        })
    })
  })
})

onMessage("stopTimer", (message) => {
  const { timedActivity, service } = message.data
  getCurrentTab().then((tab) => {
    getSettings().then((settings) => {
      const apiClient = new ApiClient(settings)
      apiClient
        .stopTimer(timedActivity)
        .then(() => resetBubble({ tab, settings, service, timedActivity }))
        .catch(() => null)
    })
  })
})

onMessage("openOptions", () => {
  let url
  if (isChrome()) {
    url = `chrome://extensions/?options=${browser.runtime.id}`
  } else {
    url = browser.runtime.getURL("options.html")
  }
  return browser.tabs.create({ url })
})

onMessage("openExtensions", () => {
  if (isChrome()) {
    browser.tabs.create({ url: "chrome://extensions" })
  }
})

browser.runtime.onInstalled.addListener(() => {
  browser.storage.onChanged.addListener(({ apiKey, subdomain }, areaName) => {
    if (areaName === "sync" && (apiKey || subdomain)) {
      getSettings().then((settings) => settingsChanged(settings))
    }
  })
})

browser.storage.onChanged.addListener(({ apiKey, subdomain }, areaName) => {
  if (areaName === "sync" && (apiKey || subdomain)) {
    getSettings().then((settings) => settingsChanged(settings))
  }
})

// Manifest V3 uses chrome.action, v2 uses chrome.browserAction
browser.action ??= browser.browserAction
browser.action.onClicked.addListener((tab) => {
  if (!isBrowserTab(tab)) {
    sendMessage("requestService", {}, `content-script@${tab.id}`).then((data) => {
      if (data) {
        togglePopup(tab)(data)
      }
    })
  }
})
