import { projectIdentifierBySelector, projectRegex } from "./utils"

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
    description: (document, service, { id, noteId }) => {
      const title = document.querySelector(".detail-page-description .title")?.textContent?.trim()
      return `#${id} ${title || ""}`.trim()
    },
    allowHostOverride: true,
  },

  monday: {
    name: "monday",
    host: "https://:org.monday.com",
    urlPatterns: [":host:/boards/:board/pulses/:id"],
    description: (document, service, { id }) => {
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
    host: "https://:org.awork.io",
    urlPatterns: [
      ":host:/projects/:id/details",
      ":host:/projects/:id/tasks/list",
      ":host:/projects/:id/tasks/board",
      ":host:/projects/:id/tasks/timeline",
      ":host:/projects/:id/times/list",
      ":host:/projects/:projectId/tasks/list/\\(detail\\::id/details\\)",
      ":host:/projects/:projectId/tasks/board/\\(modal\\::id/details\\)",
      ":host:/projects/:projectId/tasks/timeline/\\(detailModal\\::id/details\\)",
      ":host:/tasks/:id/details",
      ":host:/tasks/filters/\\(detail\\::id/details\\)",
    ],
    projectLabel: (document) => {
      var names = {
        projectNameFromProjectDetail: document
          .querySelector("aw-project-detail #projectName textarea")
          ?.value,
        projectNameFromEntityDetail: document
          .querySelector("aw-header-navigation-history div.main div.entity-details.project")
          ?.textContent,
      }

      return (names.projectNameFromProjectDetail || names.projectNameFromEntityDetail || "").trim();
    },
    description: (document, service, { org, projectId, id }) => {
      var names = {
        projectNameFromProjectDetail: document
          .querySelector("aw-project-detail #projectName textarea")
          ?.value,
        projectNameFromEntityDetail: document
          .querySelector("aw-header-navigation-history div.main div.entity-details.project")
          ?.textContent,
        
        taskNameFromTaskDetail: document
          .querySelector("aw-task-detail h1 textarea")
          ?.value,
        taskNameFromEntityDetail: document
          .querySelector("aw-header-navigation-history div.main div.entity-details.task")
          ?.textContent,  
      }

      var projectName = (names.projectNameFromProjectDetail || names.projectNameFromEntityDetail || "").trim();
      var taskName = (names.taskNameFromTaskDetail || names.taskNameFromEntityDetail || "").trim();

      return [projectName, taskName].filter(p => p).join(' - ');
    },
    allowHostOverride: true,
    position: { right: "10px", bottom: "90px" },
  },
}
