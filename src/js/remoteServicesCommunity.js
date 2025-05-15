import { projectIdentifierBySelector } from "./utils"

export default {
  gitlab: {
    name: "gitlab",
    host: "https://gitlab.com",
    urlPatterns: [
      ":host:/:org/:group(/*)/:projectId/-/issues/:id(#note_:noteId)",
      ":host:/:org(/*)/:projectId/-/issues/:id(#note_:noteId)",
      ":host:/:org/:group(/*)/:projectId/-/merge_requests/:id(#note_:noteId)",
      ":host:/:org(/*)/:projectId/-/merge_requests/:id(#note_:noteId)",
    ],
    description: (document, service, { id, noteId: _noteId }) => {
      const title = document.querySelector("h1")?.textContent?.trim()
      return `#${id} ${title || ""}`.trim()
    },
    allowHostOverride: true,
  },

  monday: {
    name: "monday",
    host: "https://:org.monday.com",
    urlPatterns: [":host:/boards/:board/pulses/:id"],
    description: (document, _service, { id: _id }) => {
      return document.querySelector(".pulse_title")?.textContent?.trim()
    },
    allowHostOverride: false,
  },

  basecamp3: {
    name: "basecamp3",
    host: "https://3.basecamp.com",
    urlPatterns: [
      ":host:/:instanceId/buckets/:projectId/:bucketType/:id",
      ":host:/:instanceId/buckets/:projectId/:bucketType/cards/:id",
      ":host:/:instanceId/buckets/:projectId/:bucketType/occurrences/:id",
    ],
    description: (document) =>
      document.head.querySelector("meta[name='current-recording-title']")?.content,
    projectId: projectIdentifierBySelector('meta[name="current-bucket-name"]', "content"),
    allowHostOverride: true,
  },

  openproject: {
    name: "openproject",
    host: "https://:org.openproject.com",
    urlPatterns: [
      ":host:/projects/:project/work_packages/:id(/*)",
      ":host:/projects/:project/work_packages/details/:id(/*)",
      ":host:/work_packages/:id(/*)",
      ":host:/work_packages/details/:id(/*)",
    ],
    description: (document) => {
      let subject =
        document.querySelector(".work-packages--details--subject")?.textContent?.trim() || ""
      let subjectId =
        document.querySelector(".work-packages--info-row")?.firstChild?.textContent?.trim() || ""

      if (subjectId) {
        subjectId = "OP " + subjectId
      }
      if (subject && subjectId) {
        subject = subjectId + " " + subject
      }

      return subject || subjectId
    },
    projectId: (document) => {
      // ":project" in URL can be project name or OP internal project ID. Therefore, it cannot be used.
      return (
        projectIdentifierBySelector(".-project-context a")(document) ||
        projectIdentifierBySelector("#projects-menu")(document)
      )
    },
    projectLabel: (document) => {
      // ":project" in URL can be project name or OP internal project ID. Therefore, it cannot be used.
      return (
        (
          document.querySelector(".-project-context a") || document.querySelector("#projects-menu")
        )?.textContent?.trim() || ""
      )
    },
    allowHostOverride: true,
    position: { left: "calc(2rem + 5px)" },
  },

  awork: {
    name: "awork",
    host: "https://:org.awork.com",
    urlPatterns: [
      ":host:/projects/:project/tasks/list/\\(detail\\::id/details\\)",
      ":host:/projects/:project/tasks/board/\\(modal\\::id/details\\)",
      ":host:/projects/:project/tasks/timeline/\\(detailModal\\::id/details\\)",
      ":host:/tasks/:id/details",
      ":host:/tasks/filters/\\(detail\\::id/details\\)",
      ":host:/tasks/filters/:filterId/\\(detail\\::id/details\\)",
      ":host:/my/dashboard/\\(detailModal\\::id/details\\)",
    ],
    projectId: (document) => {
      const projectId =
        projectIdentifierBySelector("aw-project-detail #projectName textarea", "value")(document) ||
        projectIdentifierBySelector(
          "aw-header-navigation-history div.main div.entity-details.project",
          "textContent",
        )(document)

      const taskId =
        projectIdentifierBySelector("aw-task-detail h1 textarea", "value")(document) ||
        projectIdentifierBySelector(
          "aw-header-navigation-history div.main div.entity-details.task",
          "textContent",
        )(document)

      return projectId || taskId || ""
    },
    projectLabel: (document) => {
      const projectName =
        document.querySelector("aw-project-detail #projectName textarea")?.value ||
        document.querySelector("aw-header-navigation-history div.main div.entity-details.project")
          ?.textContent

      const taskName =
        document.querySelector("aw-task-detail h1 textarea")?.value ||
        document.querySelector("aw-header-navigation-history div.main div.entity-details.task")
          ?.textContent

      return (projectName || taskName || "").trim()
    },
    description: (document, _service, { org: _org, projectId: _projectId, id: _id }) => {
      let projectName =
        document.querySelector("aw-project-detail #projectName textarea")?.value ||
        document.querySelector("aw-header-navigation-history div.main div.entity-details.project")
          ?.textContent

      let taskName =
        document.querySelector("aw-task-detail h1 textarea")?.value ||
        document.querySelector("aw-header-navigation-history div.main div.entity-details.task")
          ?.textContent

      projectName = (projectName || "").trim()
      taskName = (taskName || "").trim()

      return [projectName, taskName].filter((p) => p).join(" - ")
    },
    allowHostOverride: false,
    position: { right: "10px", bottom: "90px" },
  },
  teamwork: {
    name: "teamwork",
    host: "https://:org.teamwork.com",
    urlPatterns: [":host:/desk/tickets/:id/messages"],
    id: (document, service, { id }) => [service.key, id].join("."),
    description: (document, _service, { id }) => {
      var desc = "#" + id + " " + document.querySelector(".title__subject-text")?.innerText?.trim()
      return desc
    },
    allowHostOverride: false,
  },
  superchat: {
    name: "superchat",
    host: "https://app.superchat.de",
    urlPatterns: [":host:/inbox/:id"],
    id: (document, service, { id }) => [service.key, id].join("."),
    description: (document, _service, { id }) => {
      let subjectsRaw = document.querySelectorAll(
        "div#__next div div#bodySafeArea  h4.hy-font-semibold.hy-text-sm.hy-mt-6.hy-px-6.hy-cursor-pointer",
      )
      let subject = id.toString()
      if (subjectsRaw.length == 1) {
        let subjectRaw = subjectsRaw[0].innerHTML
        subject = subjectRaw.substring(subjectRaw.indexOf(":") + 2)
      }

      let contactNameFields = document.querySelectorAll(
        "div#__next div#bodySafeArea div.font-semibold.cursor-pointer.text-hy-black.text-hy-base.whitespace-nowrap.truncate.mr-2",
      )
      let contactName = ""
      if (contactNameFields.length == 1) {
        contactName = contactNameFields[0].title
      }

      let desc = subject + " | " + contactName
      return desc
    },
    projectId: (document) => {
      let projectId = ""
      let projectLabels = document.querySelectorAll(
        "div#__next  div#bodySafeArea span[title='Moco ProjectId']",
      )
      if (projectLabels.length == 1) {
        projectId =
          projectLabels[0].parentElement.parentElement.nextElementSibling.querySelector(
            "input",
          ).value
      }

      return projectId
    },
    allowHostOverride: false,
  },

  // redmine service config provided by zeroseven (@pdaether)
  redmine: {
    name: "redmine",
    host: "", // No central cloud hosting, so no host by default
    urlPatterns: [":host:/issues/:id"],
    description: (document, _service, { title }) => {
      const issueIdMatch = window.location.href.match(/\/issues\/(\d+)(\?.*)?$/)
      const issueId = issueIdMatch ? issueIdMatch[1] : null
      const issueTitle = document.querySelector(".subject>div>h3")?.textContent?.trim() || title
      return issueId ? `${issueId}: ${issueTitle}` : issueTitle
    },
    projectId: (document) => projectIdentifierBySelector(".current-project")(document),
    allowHostOverride: true,
  },

  // visualstudio.com/azure devops service configs provided by lx-media (@barokai)
  visualstudiocom: {
    name: "visualstudiocom",
    host: "https://:org.visualstudio.com",
    // https://org.visualstudio.com/project/_workitems/edit/id/
    urlPatterns: [":host:/:project/_workitems/edit/:id(/*)"],
    description: (document, _service, { project, id }) => {
      // The project name is used as a fallback for the issue title
      const issueTitle = document.querySelector(".work-item-title-textfield>input")?.value.trim() || decodeURIComponent(project)
      return id ? `${id}: ${issueTitle}` : issueTitle
    },
    projectId: (document) => projectIdentifierBySelector(".project-item span:nth-child(2)")(document),
    allowHostOverride: false,
  },

  azuredevops: {
    name: "azuredevops",
    host: "https://dev.azure.com",
    // https://dev.azure.com/org/project/_workitems/edit/id/

    urlPatterns: [":host:/:org/:project/_workitems/edit/:id(/*)"],
    description: (document, _service, { project, id }) => {
      const issueTitle = document.querySelector(".work-item-title-textfield>input")?.value.trim() || decodeURIComponent(project)
      return id ? `${id}: ${issueTitle}` : issueTitle
    },
    projectId: (document) => projectIdentifierBySelector(".project-item span:nth-child(2)")(document),
    allowHostOverride: false,
  }
}
