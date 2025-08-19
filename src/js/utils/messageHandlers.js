import ApiClient from "api/Client"
import {
  ERROR_UNAUTHORIZED,
  ERROR_UPGRADE_REQUIRED,
  ERROR_UNKNOWN,
  groupedProjectOptions,
  getStartOfWeek,
  getEndOfWeek,
} from "utils"
import { get, forEach, reject, isNil } from "lodash/fp"
import { createMatcher } from "utils/urlMatcher"
import remoteServices from "remoteServices"
import { sendMessage } from "webext-bridge/background"
import { queryTabs, isBrowserTab, getSettings, setStorage } from "utils/browser"

let matcher
const initMatcher = (settings) => {
  matcher = createMatcher(remoteServices, settings.hostOverrides)
}

export async function tabUpdated(tab) {
  const settings = await getSettings()
  initMatcher(settings)
  const hasService = matcher(tab.url)?.match?.id
  const apiClient = new ApiClient(settings)

  if (hasService) {
    const { service } = await sendMessage("requestService", null, `content-script@${tab.id}`)
    try {
      const { data } = await apiClient.activitiesStatus(service)
      sendMessage(
        "showBubble",
        {
          bookedSeconds: data.seconds,
          settingTimeTrackingHHMM: settings.settingTimeTrackingHHMM,
          timedActivity: data.timed_activity,
          service,
        },
        `content-script@${tab.id}`,
      )
    } catch {
      sendMessage(
        "showBubble",
        {
          bookedSeconds: 0,
          settingTimeTrackingHHMM: settings.settingTimeTrackingHHMM,
          service,
        },
        `content-script@${tab.id}`,
      )
    }
  } else {
    sendMessage("hideBubble", null, `content-script@${tab.id}`)
  }
}

export function settingsChanged(settings) {
  initMatcher(settings)

  queryTabs({ currentWindow: true })
    .then(reject(isBrowserTab))
    .then(
      forEach((tab) => {
        sendMessage("closePopup", null, `content-script@${tab.id}`)
        tabUpdated(tab, { settings })
      }),
    )
}

export function togglePopup(tab) {
  return function ({ isPopupOpen, service } = {}) {
    if (isNil(isPopupOpen)) {
      return
    }

    if (isPopupOpen) {
      sendMessage("closePopup", null, `content-script@${tab.id}`)
    } else {
      openPopup(tab, { service })
    }
  }
}

export async function openPopup(tab, { service }) {
  sendMessage("openPopup", { loading: true }, `content-script@${tab.id}`)

  const fromDate = getStartOfWeek()
  const toDate = getEndOfWeek()
  const settings = await getSettings()
  const apiClient = new ApiClient(settings)
  const responses = []
  try {
    responses.push(await apiClient.login(service))
    // we can forgo the following calls if a timed activity exists
    if (!responses[0].data.timed_activity) {
      responses.push(
        ...(await Promise.all([
          apiClient.projects(),
          apiClient.activities(fromDate, toDate),
          apiClient.schedules(fromDate, toDate),
        ])),
      )
    }

    const settingTimeTrackingHHMM = get("[0].data.setting_time_tracking_hh_mm", responses) ?? false
    const settingTimeTrackingDescriptionMandatory =
      get("[0].data.setting_time_tracking_description_mandatory", responses) ?? false
    setStorage({ settingTimeTrackingHHMM })

    const data = {
      service,
      subdomain: settings.subdomain,
      timedActivity: get("[0].data.timed_activity", responses),
      serviceLastProjectId: get("[0].data.service_last_project_id", responses),
      userLastProjectId: get("[0].data.user_last_project_id", responses),
      serviceLastTaskId: get("[0].data.service_last_task_id", responses),
      userLastTaskId: get("[0].data.user_last_task_id", responses),
      roundTimeEntries: get("[0].data.round_time_entries", responses),
      projects: groupedProjectOptions(get("[1].data.projects", responses)),
      activities: get("[2].data", responses),
      schedules: get("[3].data", responses),
      fromDate,
      toDate,
      settingTimeTrackingHHMM,
      settingTimeTrackingDescriptionMandatory,
      loading: false,
    }
    sendMessage("openPopup", data, `content-script@${tab.id}`)
  } catch (error) {
    let errorType, errorMessage
    if (error.response?.status === 401) {
      errorType = ERROR_UNAUTHORIZED
    } else if (error.response?.status === 426) {
      errorType = ERROR_UPGRADE_REQUIRED
    } else {
      errorType = ERROR_UNKNOWN
      errorMessage = error.message
    }
    sendMessage("openPopup", { errorType, errorMessage }, `content-script@${tab.id}`)
  }
}
