# MOCO Browser Extension

## Technical Documentation

### Development

- run `yarn`
- run `yarn start:chrome` or `yarn start:firefox` (`yarn start` is an alias for `yarn start:chrome`)
- load extension into browser:
  - Chrome: visit `chrome://extensions` and load unpacked extension from `build/chrome`
  - Firefox: visit `about:debugging` and load temporary Add-on from `build/firefox/manifest.json`
- the browser should automatically pick up your changes but from time to time it may be useful to reload the extension
- and most importantly, if you love working with web tech like this, typescript, graphql etc. (👉 [we are hiring](https://www.mocoapp.com/unternehmen/jobs))

### Production Build

- bump version in `package.json`
- Update `CHANGELOG.md`
- run `yarn build`
- The Chrome and Firefox extensions are available as ZIP-files in `build/chrome` and `build/firefox` respectively

### Install Local Builds

### Chrome

- `yarn build:chrome`
- Visit `chrome://extensions`
- Enable `Developer mode`
- `Load unpacked` and select the `build/chrome` folder.

### Firefox

- `yarn build:firefox`
- Visit `about:debugging`
- Click on `Load temporary Add-on` and select the ZIP-file in `build/firefox`

Only signed extensions can be permantly installed in Firefox (unless you are using <em>Firefox Developer Edition</em>). To sign the build, proceed as described in [Getting started with web-ext](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext).

You can keep the extension settings between builds by providing a stable `APPLICATION_ID` between builds. You can set an `APPLICATION_ID` in a file named `.env` or at build time as follows:

`APPLICATION_ID=my-custom-moco-extension@mycompany.com yarn build:firefox`

### Remote Service Configuration

Remote services are configured in `src/js/remoteServices.js` (for MOCO maintained services) and `src/js/remoteServicesCommunity.js` (for community-maintained services).

A remote service is configured as follows:

```javascript
{
  service_key: {
    name: "service_name",
    host: "https://:subdomain.example.com",
    urlPatterns: [
      ":host:/card/:id",
      [/^:host:\/card\/(\d+), ["subdomain", "id"]],
    ],
    queryParams: {
      projectId: "currentList"
    },
    description: (document, service, { subdomain, id, projectId }) => {
      const title = document
        .querySelector('.title')
        ?.textContent
        ?.trim()
      return `#${id} ${service.key} ${title || ""}`
    },
    projectId: (document, service, { subdomain, id, projectId }) => {
      return projectId
    },
    position: { left: "50%", transform: "translate(-50%)" },
    allowHostOverride: false,
  }
}
```

| Parameter    | Description                                                                                                                                                                                                                                                                                                              |
| ------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| service_key  | `string` &mdash; Unique identifier for the service                                                                                                                                                                                                                                                                       |
| service_name | `string` &mdash; Must be one of the registered services `trello`, `jira`, `asana`, `wunderlist`, `github` or `youtrack`                                                                                                                                                                                                  |
| urlPatterns  | `string` \| `RegEx` &mdash; A valid URL pattern or regular expression, as described in the [url-pattern](https://www.npmjs.com/package/url-pattern) package. `:host:` will be replaced with the configured host before applying the pattern (can be configured in the settings if `allowHostOverride` is true.           |
| queryParams  | `Object` &mdash; The object value is the name of the query parameter and the key the property it will available on, e.g. the value of the query parameter `currentList` will be available under `projectId`. Matches in `urlPatterns` have precedence over matches in `queryParams`.                                     |
| description  | `undefined` \| `string` \| `function` &mdash; The default description of the service. If it is a function, it will receive `window.document`, the current `service` and an object with the URL `matches` as arguments, and the return value set as the default description.                                              |
| projectId    | `undefined` \| `string` \| `function` &mdash; The pre-selected project of the service matching the MOCO project identifier. If it is a function, it will receive `window.document`, the current `service` and an object with the URL `matches` as arguments, and must return the MOCO project identifier or `undefined`. |
| projectLabel | `undefined` \| `string` \| `function` &mdash; The pre-selected project of the service matching the MOCO project label. If it is a function, it will receive `window.document`, the current `service` and an object with the URL `matches` as arguments, and must return the MOCO project label or `undefined`.           |
| position     | `Object` &mdash; CSS properties as object styles for position the bubble. Defaults to `{ right: calc(4rem + 5px)`                                                                                                                                                                                                        |

### Adding a Custom Service

1. Fork and clone this repository
2. Add your service to `src/js/remoteServicesCommunity.js`, e.g. for self-hosted Jira copy the entry with the key `jira` and update the `urlPatterns`:

```javascript
  "self-hosted-jira": {
    name: "jira",
    urlPatterns: [
      "https\\://jira.my-company.com/secure/RapidBoard.jspa",
      "https\\://jira.my-company.net/browse/:id",
      "https\\://jira.my-company.net/jira/software/projects/:projectId/boards/:board",
      "https\\://jira.my-company.net/jira/software/projects/:projectId/boards/:board/backlog"
    ],
    queryParams: {
      id: "selectedIssue",
      projectId: "projectKey"
    },
    description: (document, service, { id }) => {
      const title =
        document
          .querySelector('[aria-label="Edit Summary"]')
          ?.parentNode?.querySelector("h1")
          ?.textContent?.trim() ||
        document
          .querySelector(".ghx-selected .ghx-summary")
          ?.textContent?.trim()
      return `#${id} ${title || ""}`
    }
  },
```

3. Build the extension (see [Production Build](#production-build)).
4. Install the extension locally (see [Install Local Builds](#install-local-builds)).

## Specification

### Preselected Project/Task

The preselected project and task is determined in the following order:

1. The last project/task that were booked on the card of the remote service
2. The project set on the remote service and the projects default task
3. The last project/task the user has used for time tracking
4. The first project in the list
