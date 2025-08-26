import React, { createRef } from "react"
import { createRoot } from "react-dom/client"
import Bubble from "./components/Bubble"
import Popup from "components/Popup"
import { createServiceFinder } from "utils/urlMatcher"
import remoteServices from "./remoteServices"
import { sendMessage, onMessage } from "webext-bridge/content-script"
import { getSettings } from "./utils/browser"
import "../css/content.scss"

const popupRef = createRef()

let bubbleRoot, popupRoot

let findService
getSettings().then((settings) => {
  findService = createServiceFinder(remoteServices, settings.hostOverrides)(document)
})

function clickHandler(event) {
  if (event.target.closest(".moco-bx-bubble")) {
    event.stopPropagation()
    sendMessage("togglePopup", null, "background")
  }
}

function updateBubble({ service, bookedSeconds, settingTimeTrackingHHMM, timedActivity } = {}) {
  if (!document.getElementById("moco-bx-root")) {
    window.removeEventListener("click", clickHandler, true)

    const domRoot = document.createElement("div")
    domRoot.setAttribute("id", "moco-bx-root")
    document.body.appendChild(domRoot)

    window.addEventListener("click", clickHandler, true)
  }

  if (!bubbleRoot) {
    const container = document.getElementById("moco-bx-root")
    bubbleRoot = createRoot(container)
  }

  if (service) {
    bubbleRoot.render(
      <div className="moco-bx-bubble" style={{ ...service.position }}>
        <Bubble
          key={service.url}
          bookedSeconds={bookedSeconds}
          settingTimeTrackingHHMM={settingTimeTrackingHHMM}
          timedActivity={timedActivity}
        />
      </div>,
    )
  } else {
    bubbleRoot.render(null)
  }
}

function findRootNode() {
  const el = document.querySelector('[aria-modal="true"]')

  // check if the element exists and is visible
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  if (!el || el.offsetParent === null) {
    return document.body
  }

  return el
}

function openPopup(payload) {
  if (!document.getElementById("moco-bx-popup-root")) {
    const popupNode = document.createElement("div")
    popupNode.setAttribute("id", "moco-bx-popup-root")

    findRootNode().appendChild(popupNode)
  }

  const container = document.getElementById("moco-bx-popup-root")
  if (!popupRoot) {
    popupRoot = createRoot(container)
  }
  popupRoot.render(<Popup ref={popupRef} data={payload} onRequestClose={closePopup} />)
}

function closePopup() {
  if (popupRoot) {
    popupRoot.unmount()
    popupRoot = null
  }
}

onMessage("requestService", (_message) => {
  const service = findService(window.location.href)
  return { isPopupOpen: !!popupRef.current, service }
})

onMessage("showBubble", (message) => {
  updateBubble(message.data)
})

onMessage("hideBubble", () => {
  updateBubble()
})

onMessage("openPopup", (message) => {
  openPopup(message.data)
})

onMessage("closePopup", (_message) => {
  closePopup()
})
