import React, { Component, createRef } from "react"
import { sendMessage } from "webext-bridge/content-script"
import { onMessage } from "webext-bridge/popup"
import Spinner from "components/Spinner"
import Form from "components/Form"
import Calendar from "components/Calendar"
import TimerView from "components/App/TimerView"
import {
  ERROR_UNKNOWN,
  ERROR_UNAUTHORIZED,
  ERROR_UPGRADE_REQUIRED,
  extractAndSetTag,
  findProjectByValue,
  findProjectByLabel,
  findProjectByIdentifier,
  findTask,
  defaultTask,
  formatDate,
} from "utils"
import { parseISO } from "date-fns"
import InvalidConfigurationError from "components/Errors/InvalidConfigurationError"
import UpgradeRequiredError from "components/Errors/UpgradeRequiredError"
import UnknownError from "components/Errors/UnknownError"
import Header from "./shared/Header"
import { head } from "lodash"
import TimeInputParser from "utils/TimeInputParser"
import { get } from "lodash/fp"
import { createFocusTrap } from "focus-trap"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      activities: [],
      schedules: [],
      projects: [],
      changeset: {},
      formErrors: {},
    }
    this.containerRef = createRef()
  }

  get project() {
    const { service, projects, serviceLastProjectId, userLastProjectId } = this.state

    return (
      findProjectByValue(this.state.changeset.assignment_id)(projects) ||
      findProjectByValue(Number(serviceLastProjectId))(projects) ||
      findProjectByIdentifier(service?.projectId)(projects) ||
      findProjectByLabel(String(service?.projectLabel || ""))(projects) || // extern project
      findProjectByLabel("(" + String(service?.projectLabel || "") + ")")(projects) || // intern project
      findProjectByValue(Number(userLastProjectId))(projects) ||
      head(projects.flatMap(get("options")))
    )
  }

  get task() {
    const { service, serviceLastTaskId, userLastTaskId } = this.state
    return (
      findTask(
        this.state.changeset.task_id || serviceLastTaskId || service?.taskId || userLastTaskId,
      )(this.project) || defaultTask(this.project?.tasks)
    )
  }

  get billable() {
    return /\(.+\)/.test(this.state.changeset.hours) === true ? false : !!this.task?.billable
  }

  get changesetWithDefaults() {
    const { service } = this.state

    const defaults = {
      remote_service: service?.name,
      remote_id: service?.id,
      remote_url: service?.url,
      date: formatDate(new Date()),
      assignment_id: this.project?.value,
      task_id: this.task?.value,
      billable: this.billable,
      hours: "",
      seconds: new TimeInputParser(this.state.changeset.hours).parseSeconds(),
      description: service?.description || "",
      tag: "",
    }

    return { ...defaults, ...this.state.changeset }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("message", this.handleMessagePopupData)
    window.parent.postMessage({ type: "moco-bx-popup-ready" }, window.document.referrer || "*")
    onMessage("setFormErrors", (message) => {
      this.setState((prev) => ({ ...prev, formErrors: message.data }))
    })
  }

  componentDidUpdate() {
    if (this.containerRef.current && !this.focusTrap) {
      this.focusTrap = createFocusTrap(this.containerRef.current, { clickOutsideDeactivates: true })
      this.focusTrap.activate()
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown)
    window.removeEventListener("message", this.handleMessagePopupData)
    if (this.focusTrap) {
      this.focusTrap.deactivate()
    }
  }

  handleChange = (event) => {
    const { projects } = this.state
    const {
      target: { name, value },
    } = event

    this.setState((prev) => {
      prev.changeset[name] = value
      return { ...prev }
    })

    if (name === "assignment_id") {
      const project = findProjectByValue(value)(projects)
      this.setState((prev) => {
        prev.changeset.task_id = defaultTask(project?.tasks)?.value
        return { ...prev }
      })
    }
  }

  handleSelectDate = (date) => {
    this.setState((prev) => {
      prev.changeset.date = formatDate(date)
      return { ...prev }
    })
  }

  handleStopTimer = (timedActivity) => {
    const { service } = this.state
    sendMessage("stopTimer", { timedActivity, service }, "background")
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { service } = this.state

    sendMessage(
      "createActivity",
      {
        activity: extractAndSetTag(this.changesetWithDefaults),
        service,
      },
      "background",
    )
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.stopPropagation()
      sendMessage("closePopup", null, "background")
    }
  }

  handleMessagePopupData = (event) => {
    if (event.data.type === "moco-bx-popup-data") {
      this.setState({
        loading: false,
        ...JSON.parse(event.data.data),
      })
    }
  }

  render() {
    const {
      loading,
      subdomain,
      projects,
      timedActivity,
      activities,
      schedules,
      fromDate,
      toDate,
      settingTimeTrackingHHMM,
      settingTimeTrackingDescriptionMandatory,
      errorType,
      errorMessage,
    } = this.state

    if (loading) {
      return <Spinner />
    }

    if (errorType === ERROR_UNAUTHORIZED) {
      return <InvalidConfigurationError />
    }

    if (errorType === ERROR_UPGRADE_REQUIRED) {
      return <UpgradeRequiredError />
    }

    if (errorType === ERROR_UNKNOWN) {
      return <UnknownError message={errorMessage} />
    }

    return (
      <div ref={this.containerRef} className="moco-bx-app-container">
        <Header subdomain={subdomain} />
        {timedActivity ? (
          <TimerView timedActivity={timedActivity} onStopTimer={this.handleStopTimer} />
        ) : (
          <>
            <Calendar
              fromDate={parseISO(fromDate)}
              toDate={parseISO(toDate)}
              activities={activities}
              schedules={schedules}
              selectedDate={new Date(this.changesetWithDefaults.date)}
              settingTimeTrackingHHMM={settingTimeTrackingHHMM}
              onChange={this.handleSelectDate}
            />
            <Form
              changeset={this.changesetWithDefaults}
              projects={projects}
              errors={this.state.formErrors}
              descriptionMandatory={settingTimeTrackingDescriptionMandatory}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          </>
        )}
      </div>
    )
  }
}

export default App
