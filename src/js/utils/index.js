import {
  groupBy,
  compose,
  map,
  toPairs,
  flatMap,
  pathEq,
  get,
  find,
  curry
} from "lodash/fp"
import { format } from "date-fns"

const nilToArray = input => input || []

export const findLastProject = id =>
  compose(
    find(pathEq("value", Number(id))),
    flatMap(get("options"))
  )

export const findLastTask = id =>
  compose(
    find(pathEq("value", Number(id))),
    get("tasks")
  )

function taskOptions(tasks) {
  return tasks.map(({ id, name, billable }) => ({
    label: name,
    value: id,
    billable
  }))
}

export function projectOptions(projects) {
  return projects.map(project => ({
    value: project.id,
    label: project.name,
    customerName: project.customer_name,
    tasks: taskOptions(project.tasks)
  }))
}

export const groupedProjectOptions = compose(
  map(([customerName, projects]) => ({
    label: customerName,
    options: projectOptions(projects)
  })),
  toPairs,
  groupBy("customer_name"),
  nilToArray
)

export const trace = curry((tag, value) => {
  // eslint-disable-next-line no-console
  console.log(tag, value)
  return value
})

export const currentDate = (locale = "de") =>
  format(new Date(), "YYYY-MM-DD", { locale })

export const extensionSettingsUrl = () => `chrome://extensions/?id=${chrome.runtime.id}`
