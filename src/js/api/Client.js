import axios from "axios"
import { formatDate, mocoHost, mocoProtocol } from "utils"

const baseURL = (subdomain) => {
  return `${mocoProtocol()}://${encodeURIComponent(subdomain)}.${mocoHost()}/api/browser_extensions`
}

export default class Client {
  #client
  #apiKey

  constructor({ subdomain, apiKey, version }) {
    this.#apiKey = apiKey
    this.#client = axios.create({
      adapter: "fetch",
      responseType: "json",
      baseURL: baseURL(subdomain),
      headers: {
        common: {
          "x-api-key": apiKey,
          "x-extension-version": version,
        },
      },
    })
  }

  login = (service) =>
    this.#client.post("session", {
      api_key: this.#apiKey,
      remote_service: service?.name,
      remote_id: service?.id,
    })

  projects = () => this.#client.get("projects")

  schedules = (fromDate, toDate) =>
    this.#client.get("schedules", {
      params: { date: `${formatDate(fromDate)}:${formatDate(toDate)}` },
    })

  activities = (fromDate, toDate) =>
    this.#client.get("activities", {
      params: { date: `${formatDate(fromDate)}:${formatDate(toDate)}` },
    })

  activitiesStatus = (service) => {
    if (!service) {
      return Promise.resolve({ data: { hours: 0 } })
    }
    return this.#client.get("activities/status", {
      params: { remote_id: service.id, remote_service: service.name },
    })
  }

  createActivity = (activity) => this.#client.post("activities", { activity })

  stopTimer = (timedActivity) => this.#client.get(`activities/${timedActivity.id}/stop_timer`)
}
