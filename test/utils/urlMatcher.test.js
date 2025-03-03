import remoteServices from "../../src/js/remoteServices"
import { createMatcher, createEnhancer } from "../../src/js/utils/urlMatcher"

describe("utils", () => {
  describe("urlMatcher", () => {
    let matcher

    beforeEach(() => {
      matcher = createMatcher(remoteServices, {})
    })

    describe("createMatcher", () => {
      it("matches host and path", () => {
        const service = matcher("https://github.com/hundertzehn/mocoapp/pull/123")
        expect(service.key).toEqual("github-pr")
        expect(service.name).toEqual("github")
      })

      it("matches query string", () => {
        let service = matcher(
          "https://moco-bx.atlassian.net/secure/RapidBoard.jspa?rapidView=2&projectKey=TEST1&modal=detail&selectedIssue=TEST1-1",
        )
        expect(service.key).toEqual("jira")
        expect(service.name).toEqual("jira")
        expect(service.org).toEqual("moco-bx")
        expect(service.projectId).toBeDefined()
        expect(service.id).toEqual("TEST1-1")
        expect(service.match.org).toEqual("moco-bx")
        expect(service.match.projectId).toEqual("TEST1")
        expect(service.match.id).toEqual("TEST1-1")

        service = matcher(
          "https://moco-bx.atlassian.net/secure/RapidBoard.jspa?rapidView=2&projectKey=TEST1&modal=detail",
        )
        expect(service.key).toEqual("jira")
        expect(service.name).toEqual("jira")
        expect(service.org).toEqual("moco-bx")
        expect(service.projectId).toBeDefined()
        expect(service.id).toBeUndefined()
        expect(service.match.org).toEqual("moco-bx")
        expect(service.match.projectId).toEqual("TEST1")
        expect(service.match.id).toBeUndefined()

        service = matcher(
          "https://moco-bx.atlassian.net/secure/RapidBoard.jspa?rapidView=2&projectKey=TEST1&modal=detail&selectedIssue=",
        )
        expect(service.key).toEqual("jira")
        expect(service.name).toEqual("jira")
        expect(service.org).toEqual("moco-bx")
        expect(service.projectId).toBeDefined()
        expect(service.id).toEqual("")
        expect(service.match.org).toEqual("moco-bx")
        expect(service.match.projectId).toEqual("TEST1")
        expect(service.match.id).toEqual("")

        service = matcher("https://moco-bx.atlassian.net/secure/RapidBoard.jspa")
        expect(service.key).toEqual("jira")
        expect(service.name).toEqual("jira")
        expect(service.match.org).toEqual("moco-bx")
        expect(service.match.projectId).toBeUndefined()
        expect(service.match.id).toBeUndefined()

        service = matcher(
          "https://moco-bx.atlassian.net/secure/RapidBoard.jspa?rapidView=2&modal=detail&selectedIssue=TEST2-1",
        )
        expect(service.key).toEqual("jira")
        expect(service.name).toEqual("jira")
        expect(service.org).toEqual("moco-bx")
        expect(service.projectId).toBeDefined()
        expect(service.id).toEqual("TEST2-1")
        expect(service.match.org).toEqual("moco-bx")
        expect(service.match.projectId).toBeUndefined()
        expect(service.match.id).toEqual("TEST2-1")
      })

      it("matches url with hash", () => {
        let service = matcher("https://www.wunderlist.com/webapp#/tasks/4771178545")
        expect(service.key).toEqual("wunderlist")
        expect(service.name).toEqual("wunderlist")
        expect(service.match.id).toEqual("4771178545")
      })

      it("does not match different host", () => {
        const service = matcher("https://trello.com/hundertzehn/mocoapp/pull/123")
        expect(service).toBeFalsy()
      })

      it("matches query string in the hash", () => {
        const service = matcher(
          "https://www.wrike.com/workspace.htm?acc=5324893#folder/928360291/list?filters=status%3Dactive&sidePanelItemId=342769562&sortOrder=10&spaceId=836073701&viewId=94334135",
        )
        expect(service.key).toEqual("wrike")
        expect(service.name).toEqual("wrike")
        expect(service.id).toEqual("342769562")
        expect(service.match.id).toEqual("342769562")
      })

      it("matches query parameter with different names", () => {
        const _remoteServices = {
          ...remoteServices,
          wrike: {
            ...remoteServices.wrike,
            queryParams: { id: ["sidePanelItemId", "overlayEntityId"] },
          },
        }
        matcher = createMatcher(_remoteServices, {})
        expect(
          matcher(
            "https://www.wrike.com/workspace.htm?acc=5324893#folder/928360291/list?filters=status%3Dactive&sidePanelItemId=1234&sortOrder=10&spaceId=836073701&viewId=94334135",
          ).id,
        ).toEqual("1234")

        expect(
          matcher(
            "https://www.wrike.com/workspace.htm?acc=5324893#folder/928360291/list?filters=status%3Dactive&overlayEntityId=1234&sortOrder=10&spaceId=836073701&viewId=94334135",
          ).id,
        ).toEqual("1234")
      })

      it("should match gitlab-mergerequest url", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/testproject/-/merge_requests/1",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
      })

      it("should match gitlab-mergerequest url with note anchor", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/testproject/-/merge_requests/1#note_85524",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
        expect(service.noteId).toEqual("85524")
      })

      it("should match gitlab-mergerequest url with group", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/test-group/testproject/-/merge_requests/1",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
      })

      it("should match gitlab-mergerequest url with group and folder", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/test-group/folder/foldertwo/testproject/-/merge_requests/1",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
      })

      it("should match gitlab-issue url", () => {
        const service = matcher("https://gitlab.com/testorganisatzion/testproject/-/issues/1")
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
      })

      it("should match gitlab-issue url with dot in project name", () => {
        const service = matcher("https://gitlab.com/testorganisatzion/project.test/-/issues/1")
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("project.test")
      })

      it("should match gitlab-issue url with note anchor", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/testproject/-/issues/1#note_85524",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
        expect(service.noteId).toEqual("85524")
      })

      it("should match gitlab-issue url with group", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/test-group/testproject/-/issues/1",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
      })

      it("should match gitlab-issue url with group and folder", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/test-group/folder/fodldertwo/folderthree/testproject/-/issues/1",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
      })

      it("should match gitlab-issue url with group and folder and note", () => {
        const service = matcher(
          "https://gitlab.com/testorganisatzion/test-group/folder/fodldertwo/folderthree/testproject/-/issues/1#note_87285",
        )
        expect(service.id).toEqual("1")
        expect(service.match.id).toEqual("1")
        expect(service.name).toEqual("gitlab")
        expect(service.projectId).toEqual("testproject")
        expect(service.noteId).toEqual("87285")
      })

      it("should match asana urls", () => {
        let service
        service = matcher("https://app.asana.com/0/inbox/123/675/890")
        expect(service.id).toEqual("675")
        expect(service.match.id).toEqual("675")
        expect(service.name).toEqual("asana")

        service = matcher("https://app.asana.com/0/123/675")
        expect(service.id).toEqual("675")
        expect(service.match.id).toEqual("675")
        expect(service.name).toEqual("asana")

        service = matcher("https://app.asana.com/0/123/675/f")
        expect(service.id).toEqual("675")
        expect(service.match.id).toEqual("675")
        expect(service.name).toEqual("asana")

        service = matcher("https://app.asana.com/0/search/123/675")
        expect(service.id).toEqual("675")
        expect(service.match.id).toEqual("675")
        expect(service.name).toEqual("asana")

        service = matcher("https://app.asana.com/1/345/project/678/task/123")
        expect(service.id).toEqual("123")
        expect(service.match.id).toEqual("123")
        expect(service.name).toEqual("asana")

        service = matcher("https://app.asana.com/1/345/inbox/678/item/123/story/456")
        expect(service.id).toEqual("456")
        expect(service.match.id).toEqual("456")
        expect(service.name).toEqual("asana")
      })
    })

    describe("createEnhancer", () => {
      it("enhances a services", () => {
        const url = "https://github.com/hundertzehn/mocoapp/pull/123"
        const document = {
          querySelector: jest.fn().mockReturnValue({ textContent: "[4321] Foo" }),
        }
        const service = matcher(url)
        const enhancedService = createEnhancer(document)(service)
        expect(enhancedService.id).toEqual("github-pr.hundertzehn.mocoapp.123")
        expect(enhancedService.description).toEqual("[4321] Foo")
        expect(enhancedService.projectId).toEqual("4321")
        expect(enhancedService.taskId).toBe(undefined)
      })

      it("should use id as service.id when customId is undefined for clickup", () => {
        const document = {
          querySelector: jest.fn().mockReturnValue({ textContent: "" }),
          querySelectorAll: jest.fn().mockReturnValue({ textContent: "" }),
        }
        const service = matcher("https://app.clickup.com/t/24301549")
        const enhancedService = createEnhancer(document)(service)
        expect(enhancedService.id).toEqual("24301549")
      })

      it("should use customId as service.id for clickup", () => {
        const document = {
          querySelector: jest.fn().mockReturnValue({ textContent: "" }),
          querySelectorAll: jest.fn().mockReturnValue({ textContent: "" }),
        }
        const service = matcher("https://app.clickup.com/t/24301549/T2023-53")
        const enhancedService = createEnhancer(document)(service)
        expect(enhancedService.id).toEqual("T2023-53")
      })
    })
  })

  describe("urlMatcher with overrideHosts", () => {
    let matcher

    beforeEach(() => {
      matcher = createMatcher(remoteServices, {
        github: "https://my-custom-github-url.com",
        gitlab: "https://gitlab.com,https://gitlab.example.com",
      })
    })

    describe("createMatcher", () => {
      it("matches overridden host and path", () => {
        const service = matcher("https://my-custom-github-url.com/hundertzehn/mocoapp/pull/123")
        expect(service.key).toEqual("github-pr")
        expect(service.name).toEqual("github")
      })

      it("doesn't match default host and path", () => {
        const service = matcher("https://github.com/hundertzehn/mocoapp/pull/123")
        expect(service).toBe(undefined)
      })

      it("matches multiple overridden hosts", () => {
        const service = matcher(
          "https://gitlab.example.com/testorganisatzion/testproject/-/merge_requests/1",
        )
        expect(service.key).toEqual("gitlab")
        expect(service.name).toEqual("gitlab")

        const service2 = matcher(
          "https://gitlab.com/testorganisatzion/testproject/-/merge_requests/1",
        )
        expect(service2.key).toEqual("gitlab")
        expect(service2.name).toEqual("gitlab")
      })
    })
  })
})
