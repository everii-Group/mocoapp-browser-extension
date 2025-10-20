# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.3] – 2025-10-20

### Added

- Add project issue URL to youtrack [#1047](https://github.com/everii-Group/mocoapp-browser-extension/pull/1047)

## [2.12.2] – 2025-10-16

### Fixed

- Update selector for description in Github Issues [#1044](https://github.com/everii-Group/mocoapp-browser-extension/pull/1044)
- Fix pre-selected project for ClickUp [#1042](https://github.com/everii-Group/mocoapp-browser-extension/pull/1042)

### Changed

- Library updates

## [2.12.1] – 2025-08-26

### Fixed

- Improve visibility check of modal [#1023](https://github.com/everii-Group/mocoapp-browser-extension/pull/1023)

## [2.12.1] – 2025-08-26

### Fixed

- Improve visibility check of modal [#1023](https://github.com/everii-Group/mocoapp-browser-extension/pull/1023)

## [2.12.0] – 2025-08-21

### Added

- Require description if it is set to be mandatory in MOCO

## [2.11.0] – 2025-06-12

### Added

- Added support for visualstudio.com and azure.com by [Barokai](https://github.com/Barokai)

## [2.10.0] – 2025-05-08

### Changed

- Reading title from GitLab [#977](https://github.com/everii-Group/mocoapp-browser-extension/pull/977)

## [2.9.1] – 2025-03-13

### Fixed

- Fix reading project identifier from Asana [#966](https://github.com/everii-Group/mocoapp-browser-extension/pull/966)
- Show MOCO-Bubble on Trello with URLs containing a hash

## [2.9.0] - 2025-03-03

### Added

- Added additional asana url-patterns

## [2.8.1] - 2025-02-05

### Added

- Small awork community service improvement [#911](https://github.com/everii-Group/mocoapp-browser-extension/pull/911)

## [2.8.0] - 2025-01-11

### Added

- Added redmine support by zeroseven/@pdaether

## [2.7.5] – 2024-10-17

### Fixed

- Correctly remove the tag from the description if the description contains only a tag
- Fix re-opening the popup in Asana

## [2.7.4] – 2024-10-07

### Fixed

- Fix display of popup in Clickup

## [2.7.3] – 2024-10-02

### Fixed

- Make sure focus-trap is created after form mounted

## [2.7.2] – 2024-10-02

### Fixed

- Popup only mounts for the first time

## [2.7.1] – 2024-10-02

### Fixed

- Unable to focus popup due to focus trap in Trello

### Changed

- Add Jira issue summary to description ([#881](https://github.com/hundertzehn/mocoapp-browser-extension/pull/881)) – contribution by [jj117171](https://github.com/jj117171)

## [2.7.0] – 2024-08-12

### Added

- Support for Superchat ([#866](https://github.com/hundertzehn/mocoapp-browser-extension/pull/866)) – contribution by [Niiiklaas](https://github.com/Niiiklaas)

### Changed

- Update urlPatterns list for jira - add jira core project urls ([#861](https://github.com/hundertzehn/mocoapp-browser-extension/pull/861)) – contribution by [Der-Alex](https://github.com/Der-Alex))

## [2.6.2] - 2024-01-29

### Changed

- Update MOCO logos

## [2.6.1] - 2024-01-11

### Fixed

- Show hours in the format configured in the profile ([#787](https://github.com/hundertzehn/mocoapp-browser-extension/pull/787))

## [2.6.0] - 2023-11-21

### Added

- Support new service Teamwork ([#764](https://github.com/hundertzehn/mocoapp-browser-extension/pull/764)) – community supported, contribution by [Niiiklaas](https://github.com/Niiiklaas))

## [2.5.4] - 2023-11-15

### Fixed

- Fix reading description from Asana ([#763](https://github.com/hundertzehn/mocoapp-browser-extension/pull/763))

### Changed

- Library updates

## [2.5.3] - 2023-11-14

### Changed

- Library updates

## [2.5.2] - 2023-11-12

### Fixed

- Fix reading project identifier from Jira and Clickup ([#760](https://github.com/hundertzehn/mocoapp-browser-extension/pull/760))

## [2.5.1] – 2023-10-30

### Fixed

- Fixed reading project identifier from project and ticket name in Jira ([commit](https://github.com/hundertzehn/mocoapp-browser-extension/commit/dee024011918177d120146095e1f944c7114bebf))
- Fixed reading project identifier from board name in Trello ([commit](https://github.com/hundertzehn/mocoapp-browser-extension/commit/134530f92e48264749f5fbaf195983bf072dd88e))

### Added

- Add support for awork task detail modal from the dashboard view ([#750](https://github.com/hundertzehn/mocoapp-browser-extension/pull/750))

## [2.5.0] – 2023-10-16

### Changed

- Absences are now displayed with the same icons and styles as in the web application ([#747](https://github.com/hundertzehn/mocoapp-browser-extension/pull/747))

### Removed

- Removed MobX dependency ([#748](https://github.com/hundertzehn/mocoapp-browser-extension/pull/748))

## [2.4.3] - 2023-10-06

### Fixed

- Added namespace to fadeIn keyframe animage ([#742](https://github.com/hundertzehn/mocoapp-browser-extension/pull/742))
- Updated selector for description in Jira ([#744](https://github.com/hundertzehn/mocoapp-browser-extension/pull/744))

### Added

- Support dots in url segments ([#745](https://github.com/hundertzehn/mocoapp-browser-extension/pull/745))

## [2.4.2] - 2023-09-26

### Changed

- awork: no more logging on projects
- awork: better matching of project identifier (also on tasks)
- awork: project label fallback on task

## [2.4.1] - 2023-09-18

### Added

- Support ClickUp version 3: update markup to fetch title

### Changed

- Change host for awork from awork.io to awork.com

### Fixed

- Replace deprecated package `babel-eslint` with `@babel/eslint-parser`
- Fixed eslint errors and warnings

## [2.4.0] - 2023-08-10

### Added

- Support awork ([PR 734](https://github.com/hundertzehn/mocoapp-browser-extension/pull/734) – community supported, contribution by [Vitor Durante](https://github.com/vdurante))

## [2.3.1] - 2023-05-23

### Fixed

- Use customId as service.id if it is defined for ClickUp
- Moved openproject to remoteServicesCommunity.js

### Added

- projectId service property to openproject ([PR 686](https://github.com/hundertzehn/mocoapp-browser-extension/pull/686) – community supported, contribution by [Bernhard Krop](https://github.com/Bernhard-Krop))

## [2.3.0] - 2023-05-02

### Added

- Support OpenProject ([PR 680](https://github.com/hundertzehn/mocoapp-browser-extension/pull/680) – community supported, contribution by [Bernhard Krop](https://github.com/Bernhard-Krop))

### Changed

- Allow 500 characters for time entry description

## [2.2.0] - 2023-02-06

### Fixed

- Fix a crash where the extension stopped working

## [2.1.0] - 2023-01-16

### Added

- Support Wrike dashboards
- Support Asana search

## [2.0.2] - 2022-11-15

### Fixed

- Fixed an error where the root of the bubble was not defined

### Added

- Support Basecamp 3 cards ([PR 590](https://github.com/hundertzehn/mocoapp-browser-extension/pull/590) – community supported, contribution by [Florian Jahn](https://github.com/fjahn))

## [2.0.1] - 2022-10-08

### Added

- Support Basecamp 3 cards ([PR 590](https://github.com/hundertzehn/mocoapp-browser-extension/pull/590) – community supported, contribution by [Florian Jahn](https://github.com/fjahn))

### Changed

- Use package webext-bridge for messaging
- Upgrade Chrome to Manifest V3

## [2.0.0] - 2022-10-04

### Changed

- Use package webext-bridge for messaging
- Upgrade Chrome to Manifest V3

## [1.9.2] - 2022-10-04

### Fixed

- Popup cannot be opened due to too long popup URL ([Issue 570](https://github.com/hundertzehn/mocoapp-browser-extension/issues/570))

## [1.9.1] - 2022-08-22

### Fixed

- Revert back to Manifest V2

## [1.9.0] - 2022-08-15

### Fixed

- Add URL pattern for Youtrack

### Added

- Support Manifest V3 for Chrome

## [1.8.1] - 2022-08-05

### Fixed

- URL patterns fixed for Youtrack

## [1.8.0] - 2022-07-11

### Changed

- Major library upgrades

### Fixed

- URL patterns fixed for Wrike

## [1.7.7] - 2022-04-05

### Fixed

- Reduced popup height on Chrome 100

## [1.7.7] - 2022-03-29

### Fixed

- Gitlab title selector and tracking time on comment URLs (contribution by https://github.com/infabo)

### Added

- Add additional url pattern for Youtrack (":host:/issue/:id")

### Changed

- Community supported services extracted to own module `remoteServicesCommunity.js`

## [1.7.6] - 2022-03-21

### Added

- Add additional url pattern for Jira Backlogs

## [1.7.5] - 2022-03-14

### Added

- Add url pattern for Jira Backlogs

## [1.7.4] - 2022-02-10

### Added

- Support for additional URLs for Jira

## [1.7.3] - 2022-01-31

### Added

- Support for URL with comment hash for Jira

## Changed

- Increase bottom margin of MOCO-bubble on Wrike

## [1.7.2] - 2022-01-10

### Added

- Region support for Wrike

## [1.7.1] - 2021-12-06

### Changed

- Improvments to basecamp3: (community supported, contribution by [Florian Jahn](https://github.com/fjahn))

## [1.7.0] - 2021-11-22

### Added

- basecamp3 service: (community supported, contribution by [Florian Jahn](https://github.com/fjahn))

## [1.6.10] - 2021-08-31

### Fixed

- Fixed description field for Wrike
- Fixed description field for Jira

## [1.6.9] - 2021-07-20

### Fixed

- Fixed URL-patterns for Asana

## [1.6.8] - 2021-06-03

### Fixed

- Hide Bubble when a service is no longer available

## [1.6.7] - 2021-05-25

### Changed

- Display bubble in the bottom center in Asana

## [1.6.6] - 2021-05-25

### Fixed

- Increase bottom position of bubble in Asana so that it no longer overlaps with the controls

## [1.6.5] - 2021-05-11

### Fixed

- Set the top padding of the popup relative to the window height

## [1.6.4] - 2021-02-18

### Added

- Show tag of activity on timer view

## [1.6.3] - 2021-02-17

### Added

- Support different languages on Asana

## [1.6.2] - 2021-02-11

### Fixed

- Prefill description from Asana task name

### Added

- Add support for project folders in Gitlab (contribution by [Adrian Görisch](https://github.com/adrian-goe))

## [1.6.1] - 2020-12-07

### Fixed

- Pre-selected project

## [1.6.0] - 2020-11-26

### Added

- Clickup service

### Changed

- Major library upgrades

## [1.5.2] - 2020-09-10

### Fixed

- Remember last tracked project and task on card

## [1.5.1] - 2020-08-04

### Added

- Add support for Monday: (community supported, contribution by https://github.com/markusNahketing)

## [1.5.0] - 2020-06-15

### Added

- Allow to override hosts for Jira, Youtrack and Gitlab in options (implemented by yay-digital.de)

## [1.4.0] - 2020-04-27

### Added

- Add support for Gitlab merge requests and issues: (community supported, contribution by [Adrian Görisch](https://github.com/adrian-goe))

## [1.3.4] - 2020-01-09

### Added

- Asana: read task title from single task pane

## [1.3.3] - 2019-10-17

### Fixed

- Fix an issue on Trello where the card closes when clicking the MOCO bubble
- Asana: read project title from page heading

## [1.3.2] - 2019-10-24

### Added

- Read project identifier from Trello board title

## [1.3.1] - 2019-10-17

### Fixed

- Set propper focus on timer view

### Removed

- Find projects by identifier without alphanumerical characters

## [1.3.0] - 2019-10-11

### Added

- Start a new timer or stop a running timer
- Format time as set in time tracking
- Add support for project identifier in Github Issue, Trello, Wunderlist, Youtrack
- Find projects by identifier without alphanumerical characters

## [1.2.4] - 2019-09-20

### Changed

- Preselect last used task per project

## [1.2.3] - 2019-06-26

### Changed

- Description of activities are optional

## [1.2.2] - 2019-05-24

### Removed

- Bugsnag client

## [1.2.1] - 2019-05-03

### Fixed

- Support EU-hosted wrike.com (app-eu.wrike.com)

## [1.2.0] - 2019-04-26

### Added

- Add support for wrike.com

## [1.1.5] - 2019-04-24

### Fixed

- Unexpected closing of Trello card when clicking on Bubble

## [1.1.4] - 2019-04-11

### Added

- Show customer name in the project select box

## [1.1.3] - 2019-04-10

### Fixed

- Read projected identifier in Asana's "My tasks"-view

## [1.1.2] - 2019-04-06

### Fixed

- Allow production build without BUGSNAG_API_KEY
- Hours entered in brackets must be non-billable

### Changed

- Read project identifier also from card title in the meistertask service

## [1.1.1] - 2019-04-01

### Fixed

- Discard projects with undefined identifier for preselecting

## [1.1.0] - 2019-03-30

### Added

- Read project identifier from Asana project title
- Add support for meistertask.com

### Fixed

- Link logo in modal to MOCO activities page
- Set full url on service, including query params

## [1.0.22] - 2019-03-28

### Changed

- Change the default value of subdomain to `unset` to have a well-formed URL.

## [1.0.21] - 2019-03-26

### Changed

- Update README with example configuration and instructions for local installation

## [1.0.20] - 2019-03-26

### Added

- Add support for tags in description

## [1.0.19] - 2019-03-26

### Changed

- Position Bubble in the bottom right by default

### Fixed

- Set default value of subdomain to `__unset__` to prevent network error if it is empty

## [1.0.18] - 2019-03-23

### Added

- First release of version 1
