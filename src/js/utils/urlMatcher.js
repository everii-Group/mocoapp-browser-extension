import UrlPattern from "url-pattern"
import { isFunction, isUndefined, compose, toPairs, map, pipe, isNil, reduce } from "lodash/fp"
import { asArray } from "./index"

function parseUrl(url) {
  const urlObject = new URL(url)
  const { origin, pathname, search } = urlObject
  let { hash } = urlObject
  const hashQueryString = hash.substring(hash.indexOf("?"))
  const query = {
    ...Object.fromEntries(new URLSearchParams(search)),
    ...Object.fromEntries(new URLSearchParams(hashQueryString)),
  }
  if (hash) {
    hash = hash.match(/#[^?]+/)[0]
  }
  return { origin, pathname, hash, query }
}

function extractQueryParams(queryParams, query) {
  return toPairs(queryParams).reduce((acc, [key, params]) => {
    const param = asArray(params).find((param) => !isNil(query[param]))
    if (param) {
      acc[key] = query[param]
    }
    return acc
  }, {})
}

const createEvaluator = (args) => (fnOrValue) => {
  if (isUndefined(fnOrValue)) {
    return
  }

  if (isFunction(fnOrValue)) {
    return fnOrValue(...args)
  }

  return fnOrValue
}

const prepareHostForRegExp = (host) => {
  return host.replace(":", "\\:")
}

const replaceHostInPattern = (host, pattern) => {
  if (typeof pattern === "string") {
    return pattern.replace(":host:", prepareHostForRegExp(host))
  } else if (pattern instanceof RegExp) {
    return new RegExp(pattern.source.replace(":host:", prepareHostForRegExp(host)))
  } else {
    return pattern
  }
}

const urlPatternOptions = {
  segmentValueCharset: UrlPattern.defaultOptions.segmentValueCharset + ".",
}

const parseServices = compose(
  map(([key, config]) => {
    const hosts = config.host.split(",").map((host) => host.trim())
    return {
      ...config,
      key,
      patterns: hosts.flatMap((host) =>
        config.urlPatterns.map((pattern) => {
          if (Array.isArray(pattern)) {
            return new UrlPattern(
              ...pattern.map((p) => replaceHostInPattern(host, p)),
              urlPatternOptions,
            )
          }
          return new UrlPattern(replaceHostInPattern(host, pattern), urlPatternOptions)
        }),
      ),
    }
  }),
  toPairs,
)

export const createEnhancer = (document) => (service) => {
  if (!service) {
    return
  }

  const match = service.match
  const args = [document, service, match]
  const evaluate = createEvaluator(args)

  const id = evaluate(service.id)

  return {
    ...service,
    id,
    description: evaluate(service.description),
    projectId: evaluate(service.projectId),
    projectLabel: evaluate(service.projectLabel),
    taskId: evaluate(service.taskId),
    // Some services (e.g. Notion) can end up on a tab URL that is only valid for the
    // current user (a shared view link). remoteUrl lets a service build a stable,
    // shareable link instead of falling back to the raw tab URL.
    url: (isFunction(service.remoteUrl) && service.remoteUrl(document, service, match, id)) || service.url,
    position: service.position || { right: "calc(2rem + 5px)" },
  }
}

const applyHostOverrides = (remoteServices, hostOverrides) =>
  pipe(
    toPairs,
    reduce((acc, [key, remoteService]) => {
      acc[key] = {
        ...remoteService,
        key,
        host: hostOverrides[remoteService.name] || remoteService.host,
      }
      return acc
    }, {}),
  )(remoteServices)

export const createMatcher = (remoteServices, hostOverrides) => {
  const services = parseServices(applyHostOverrides(remoteServices, hostOverrides))

  return (tabUrl) => {
    const { origin, pathname, hash, query } = parseUrl(tabUrl)
    const url = `${origin}${pathname}${hash}`
    const service = services.find((service) => {
      return service.patterns.some((pattern) => pattern.match(url))
    })

    if (!service) {
      return
    }

    const pattern = service.patterns.find((pattern) => pattern.match(url))
    let match = pattern.match(url)
    if (service.queryParams) {
      const extractedQueryParams = extractQueryParams(service.queryParams, query)
      match = { ...extractedQueryParams, ...match }
    }

    return {
      ...match,
      ...service,
      url: tabUrl,
      match,
    }
  }
}

export const createServiceFinder = (remoteServices, hostOverrides) => (document) => {
  const matcher = createMatcher(remoteServices, hostOverrides)
  const enhancer = createEnhancer(document)
  return pipe(matcher, enhancer)
}
