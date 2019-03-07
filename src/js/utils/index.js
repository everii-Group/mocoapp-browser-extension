import {
  groupBy,
  compose,
  map,
  mapValues,
  toPairs,
  flatMap,
  pathEq,
  get,
  find,
  curry,
  pick
} from "lodash/fp"
import { format } from "date-fns"

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_MINUTE = 60

const nilToArray = input => input || []

export const ERROR_UNAUTHORIZED = "unauthorized"
export const ERROR_UPGRADE_REQUIRED = "upgrade-required"
export const ERROR_UNKNOWN = "unknown"

export const findProject = id =>
  compose(
    find(pathEq("value", Number(id))),
    flatMap(get("options"))
  )

export const findTask = id =>
  compose(
    find(pathEq("value", Number(id))),
    get("tasks")
  )

function taskOptions(tasks) {
  return tasks.map(({ id, name, billable }) => ({
    label: billable ? name : `(${name})`,
    value: id,
    billable
  }))
}

export function projectOptions(projects) {
  return projects.map(project => ({
    value: project.id,
    label: project.intern ? `(${project.name})` : project.name,
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

export const serializeProps = attrs =>
  compose(
    mapValues(JSON.stringify),
    pick(attrs)
  )

export const parseProps = attrs =>
  compose(
    mapValues(JSON.parse),
    pick(attrs)
  )

export const trace = curry((tag, value) => {
  // eslint-disable-next-line no-console
  console.log(tag, value)
  return value
})

export const formatDate = date => format(date, "YYYY-MM-DD")

export const extensionSettingsUrl = () =>
  `chrome://extensions/?id=${chrome.runtime.id}`
