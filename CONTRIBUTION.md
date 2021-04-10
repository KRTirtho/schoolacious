# Contributing to VESchool

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to VESchool and its parts & components. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)

- [Languages/Runtimes/Test Environment used in entire VESchool project](#languagesruntimestestenvironment)
- [Tools & libraries used for VESchool Frontend](#frontend)
- [Backend technologies & architecture of VESchool](#backend)

[How Can I Contribute?](#how-can-i-contribute)

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)

[Styleguides](#styleguides)

- [Git Commit Messages](#git-commit-messages)
- [Typescript Styleguide](#typescript-styleguide)
- [Tests Styleguide](#tests-styleguide)
- [Documentation Styleguide](#documentation-styleguide)

[Additional Notes](#additional-notes)

- [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## Code of Conduct

This project and everyone participating in it is governed by the [VESchool's Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [krtirtho@gmail.com](mailto:krtirtho@gmail.com)

## What should I know before I get started?

This part lets you know about what tools & framework you should know or be familiar with to contribute to this project

## Languages/Runtimes/Test Environment

To contribute to any part of the project you must know following tools & technologies or be familiar with

- **Nodejs**:
  Nodejs always had an good reputation for being fast & simple in for such application that was previously impossible for other server-side technologies. It's event based architecture enables it to be faster & the superior event loop makes it possible to run concurrently. VESchool uses Nodejs because of it use case for huge I/O related operations. Almost 90% of the application is based on data retrieval or data pushing. Thus it makes sense to use an server-side framework that is well reputed for being fast for I/O operations. Knowing nodejs lts (currently version **14.x**) is important & core tools supporting this version of node might also help

- **Typescript**: Typescript is the typed superset of JavaScript. It removes or at least tries to mitigate the legacy problems of JavaScript. VESchool uses typescript for the entire project instead of javascript because typescript ensures type safety & filters out common patterns of mistake. Its strongly typed system make the debugging easier & Dev Experience better than ever before

  > **Info**: Typescript **decorators** are the core foundation of VESchool's backend [Nestjs](https://nestjs.com) & database driver [TypeORM](https://typeorm.io)

- **Jest**: VESchool runs all of its testing with jest. Jest is fast & modern. It has all the necessary testing tools built into it. Thus using jest as the testing framework makes sense these days. For upgrading any testing facility or any test please use jest & always create test that are valid for this project
- **Rust**: Rust is a super fast, lightweight, memory safe compiled system level programming language by mozilla.org. VESchool uses it for higher & complex computational task. Its a replacement for C++ but with better memory safety. For current project state, it doesn't have any application. Thus knowing or not knowing it doesn't matter. But there's a bigger chance that it will be used

## Frontend

Knowledge & familiarity with following packages/libraries is required to contribute to the frontend part of the VESchool project

- **React**: We use Facebook's open source frontend UI library [React](https://reactjs.org/). React is awesome & has huge community support. Has so many packages to work with. Also modern react features enables project to be more fancy & gives a unbelievable developer experience. Learn & contribute to frontend of VESchool by following the [DESIGN_GUIDELINES](DESIGN_GUIDELINES.md)

- **Grommet**: Grommet is the design & component toolkit that VESchool going to use. It has beautiful design principals with minimal & attractive designs. Has react support & uses styled-component to design. It follows the CSS in JS convention. Learn more from grommet.io

- **React-Query**: react-query is the caching, prefetching & auto query base of VESchool's frontend. Its rich interface of caching & easy access to query-client gives the developer a breeze of happiness. Using it for querying & caching make the application faster & reduces api load of backend. Perfectly knowing this library is really important. Any kind of API call should be done using react-query features. Learn more about this package in react-query.tanstack.com

- **formik & yup**: Easy tools for form validation & handling. Knowing this is pretty important. Since the frontend of VESchool is really input heavy

## Backend

Nodejs based backend requires following packages to be familiar with to contribute to VESchool backend part

- **express**: Express is a fast & minimal http library for Nodejs. Its not that important to know but the framework Nestjs using it under the hood but quite of its API is exposed to the developer & it is important for some use cases too

- **NestJS**: Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It encourages the developer to follow certain guidelines to keep the project steady even in large scale. NestJS is the only framework in NodeJS that enables building web servers & APIs with meta programming. Most of the time big enterprise level server-side application uses meta decorators or derive statements to create routes. NestJS respects that pattern of meta programming & mixes the good part of meta programming with OOP. Also it gives the developer hint for every wrong this. VESchool decided to use NestJS as the server-side framework because it has strong design & structural principal inspired by Angular but not Angular. It has the right tools built into it to do all the stuff alone. Has GraphQL/WebSocket/Authentication etc built right into it keeping the developer experience a breeze

- **TypeORM**: TypeORM is a database driver for sql/no-sql databases. It supports all the major databases currently available in this world. VESchool uses it because it has the same design & code principal of NestJS with Typescript Decorators & fits well with the architecture of NestJS. NestJS also has an official support for this package. TypeORM is one the most recommended nodejs database driver after mongoose-orm. Its the only database driver that VESchool will only use

- **PostgreSQL**: PostgreSQL (in short psql) is an OSDS (Open Source Database Software). It has minimal licensing with freedom to use it anywhere even for commercial use. Its faster & reliable & has rich extension support. VESchool will use database as the primary database as most of the data of VESchool is relational (many-to-many)

- **MongoDB**: Mongodb is the no-sql database that is free to use & doesn't require licensing for commercial usa cases. Its the secondary database software of VESchool. Many of the non-relational & unstructured data will be stored in this. **Currently, there is no part for its use case in the project. It will be used in future if needed**

> **Note**: If you don't know any of the language/library/framework its not a shame, don't hesitate to learn. As learning is the best thing you can do in you're life. You can read docs or learn from youtube/other learning method for specific packages. After all you don't need to know each of the technology **just knowing the part that you're intending to contribute is enough**

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for VESchool. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](https://github.com/veschool/.github/blob/master/.github/ISSUE_TEMPLATE/bug_report.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

- **Check the [debugging guide (currently N/A, WIP)]().** You might be able to find the cause of the problem and fix things yourself. Most importantly, check if you can reproduce the problem in the latest release of VESchool
- **Check the [FAQs](FAQs.md)** for a list of common questions and problems.
- **Determine which [part of the project](https://github.com/KRTirtho/veschool#structure)** the issue belongs to
- **Perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Aveschool)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After determining where the issue belongs, create an issue on that repository and provide the following information by filling in [the template](.github/ISSUE_TEMPLATE/bug_report.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible. For example, if you saw a problem in frontend ([Zainul][zainul]) about any action that isn't completing then don't just directly say you witnessed it. Give the **console** information of that time & things you do or what route you were previously in or what preferences you've in your profile settings. If its a network related issue than it might not be a frontend issue rather be a backend ([Titumir][titumir]) issue
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem
- **If the problem is related to performance or memory**, include a [CPU profile capture](https://flight-manual.veschool.io/hacking-veschool/sections/debugging/#diagnose-runtime-performance) with your report.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions **(might need a local-testing/git-clone)**:

- **Can you reproduce the problem in another browser (incase of Frontend) or API client(incase of Backend)**
- **Did the problem start happening recently?**
- If the problem started happening recently, **can you reproduce the problem in an older commits of the particular part (Zainul or Titumir)?** What's the most recent commit/release in which the problem doesn't happen?
- **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

- **Which Browser are you using?** You can get the exact version by navigating to `chrome://version` in **Chrome/chromium** based browsers or `About Firefox` option in options menu in **Firefox**
- **What's the name and version of the OS you're using**?
- **What API client you're using & which version?**
- **Which version of nodejs or [other package's/tool's](#what-should-i-know-before-i-get-started) version you're using (in development)?**

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for VESchool, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](https://github.com/veschool/.github/blob/master/.github/ISSUE_TEMPLATE/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

- **Check the [specific project board](https://github.com/KRTirtho/veschool/projects)** — you might discover that the enhancement is already available or queued for future
- **Determine which part of the project ([zainul-frontend][zainul]/[titumir-backend][titumir]) the enhancement should be suggested in**
- **Perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Aveschool)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which part of the project](https://github.com/KRTirtho/veschool#frameworkpackagestools) your enhancement suggestion is related to, create an issue with that **label(s)** and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of VESchool which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **Explain why this enhancement would be useful** to most VESchool users
- **List some other services/websites/application where this enhancement exists.**
- **Which Browser are you using?** You can get the exact version by navigating to `chrome://version` in **Chrome/chromium** based browsers or `About Firefox` option in options menu in **Firefox**
- **Specify the name and version of the OS you're using.**
- **What API client you're using & which version (incase of backend)?**

### Your First Code Contribution

Unsure where to begin contributing to VESchool? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have

#### Local development

VESchool's both [frontend][zainul] & [backend][titumir] can be developed locally

- [Source code](https://github.com/KRTirtho/veschool/archive/refs/tags/vx.x.x.zip) of latest release

### Pull Requests

The process described here has several goals:

- Maintain VESchool's quality & coding/design conventions
- Fix problems that are important to users
- Engage the community in working toward the best possible of VESchool
- Enable a sustainable system for VESchool's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

> **Note**: Don't create tests after finishing the feature. Always create test before implementing any major feature and change according to development. This can mitigate the chances of having hidden bugs that get introduced after deployment

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Required information for each commit message
  - use `[zainul]` at the starting of the title to indicate **frontend**
  - use `[titumir]` at the starting of the title to indicate **backend**
- Consider starting the commit message with an applicable emoji:
  - :art: `:art:` when improving the format/structure of the code
  - :racehorse: `:racehorse:` when improving performance
  - :non-potable_water: `:non-potable_water:` when plugging memory leaks
  - :memo: `:memo:` when writing docs
  - :bug: `:bug:` when fixing a bug
  - :fire: `:fire:` when removing code or files
  - :white_check_mark: `:white_check_mark:` when adding tests
  - :atom_symbol: `:atom_symbol:` when doing something with React
  - :wolf: `:wolf:` when doing something with NestJS
  - :scroll: `:scroll:` when modifying Scripts
  - :green_heart: `:green_heart:` when fixing the CI build
  - :lock: `:lock:` when dealing with security/authorization
  - :arrow_up: `:arrow_up:` when upgrading dependencies
  - :arrow_down: `:arrow_down:` when downgrading dependencies
  - :shirt: `:shirt:` when removing linter warnings

  > Note: You can use multiple emojis to sub categorize some of the commits or to indicate this commit has upgrade on multiple branches

### Typescript Styleguide

All Typescript code is linted with [Prettier](https://prettier.io/).

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export`s with expressions whenever possible

  ```ts
  // Use this:
  export default class ClassName {}

  // Instead of:
  class ClassName {}
  export default ClassName;
  ```
- Forget about the `any` or `unknown` type, use types ever where possible. If needed use the `as` keyword to change type
- Place requires in the following order:
  - Built in Node Modules (such as `path`)
  - Local Modules (using relative paths)
- Place class properties in the following order:
  - Class methods and properties (methods starting with `static`)
  - Instance methods and properties
- Avoid platform-dependent code as different contributors might use different platform

### Tests Styleguide

- Include thoughtfully-worded, well-structured [Jest](https://jestjs.io/) tests in the `./test` folder of each separate part of the project.
- Treat `describe` as a noun or situation.
- Treat `test` as a statement about result or how an operation results.
- Treat `expect` as a noun about expectation about certain operations

#### Example

```typescript
describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
```

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown).
- Reference methods and classes in markdown with the custom `{}` notation:
  - Reference Component with `<ComponentName/>`
  - Reference Props as `propName={value | ValueType}`
  - Reference hook with `use` prefix then `useHookName`
  - Reference classes with `{ClassName}`
  - Reference instance methods with `{ClassName::methodName}`
  - Reference class methods with `{ClassName.methodName}`
  - Reference Routes with `route1 > route2 > :dynmicRoute3 ? query=value`

## Additional Notes

### Issue and Pull Request Labels

This section lists the **labels** we use to help us track and manage issues and pull requests, use these labels to describe which part of the project the issue is related to

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in. For example, you might be interested in [open issues across `KRTirtho/veschool` which are labeled as bugs, but still need to be reliably reproduced](https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+user%3Aveschool+label%3Abug+label%3Aneeds-reproduction) or perhaps [open pull requests in `KRTirtho/veschool` which haven't been reviewed yet](https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+repo%3AKRTirtho%2Fveschool+comments%3A0). To help you find issues and pull requests, each label is listed with search links for finding open items with that label in `KRTirtho/veschool`. We encourage you to read about [other search filters](https://help.github.com/articles/searching-issues/) which will help you write more focused queries.

The labels are loosely grouped by their purpose, but it's not required that every issue has a label from every group or that an issue can't have more than one label from the same group.

Please open an issue on `KRTirtho/veschool` if you have suggestions for new labels, and if you notice some labels are missing on some repositories, then please open an issue on that repository.

#### Type of Issue and Issue State

| Label name                     | `KRTirtho/veschool` :mag_right:                              | Description                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `zainul` (frontend) (required) | [search][search-veschool-repo-label-zainul]                      | Related to visual design.                                                                                                                                          |
| `titumir` (backend) (required) | [search][search-veschool-repo-label-titumir]                     | Related to VESchool's public APIs.                                                                                                                                 |
| `enhancement`                  | [search][search-veschool-repo-label-enhancement]             | Feature requests.                                                                                                                                                  |
| `bug`                          | [search][search-veschool-repo-label-bug]                     | Confirmed bugs or reports that are very likely to be bugs.                                                                                                         |
| `question`                     | [search][search-veschool-repo-label-question]                | Questions more than bug reports or feature requests (e.g. how do I do X).                                                                                          |
| `feedback`                     | [search][search-veschool-repo-label-feedback]                | General feedback more than bug reports or feature requests.                                                                                                        |
| `help-wanted`                  | [search][search-veschool-repo-label-help-wanted]             | The VESchool core team would appreciate help from the community in resolving these issues.                                                                         |
| `beginner`                     | [search][search-veschool-repo-label-beginner]                | Less complex issues which would be good first issues to work on for users who want to contribute to VESchool.                                                      |
| `more-information-needed`      | [search][search-veschool-repo-label-more-information-needed] | More information needs to be collected about these problems or feature requests (e.g. steps to reproduce).                                                         |
| `needs-reproduction`           | [search][search-veschool-repo-label-needs-reproduction]      | Likely bugs, but haven't been reliably reproduced.                                                                                                                 |
| `blocked`                      | [search][search-veschool-repo-label-blocked]                 | Issues blocked on other issues.                                                                                                                                    |
| `duplicate`                    | [search][search-veschool-repo-label-duplicate]               | Issues which are duplicates of other issues, i.e. they have been reported before.                                                                                  |
| `wontfix`                      | [search][search-veschool-repo-label-wontfix]                 | The VESchool core team has decided not to fix these issues for now, either because they're working as intended or for some other reason.                           |
| `invalid`                      | [search][search-veschool-repo-label-invalid]                 | Issues which aren't valid (e.g. user errors).                                                                                                                      |
| `documentation`                | [search][search-veschool-repo-label-documentation]           | Related to any type of documentation (e.g. [API documentation](https://veschool.io/docs/api/latest/) and the [flight manual](https://flight-manual.veschool.io/)). |
| `performance`                  | [search][search-veschool-repo-label-performance]             | Related to performance.                                                                                                                                            |
| `security`                     | [search][search-veschool-repo-label-security]                | Related to security.                                                                                                                                               |
| `git`                          | [search][search-veschool-repo-label-git]                     | Related to Git functionality (e.g. problems with gitignore files or with showing the correct file status).                                                         |

#### Pull Request Labels

| Label name         | `KRTirtho/veschool` :mag_right:                       | Description                                                                                |
| ------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `work-in-progress` | [search][search-veschool-repo-label-work-in-progress] | Pull requests which are still being worked on, more changes will follow.                   |
| `needs-review`     | [search][search-veschool-repo-label-needs-review]     | Pull requests which need code review, and approval from maintainers or VESchool core team. |
| `under-review`     | [search][search-veschool-repo-label-under-review]     | Pull requests being reviewed by maintainers or VESchool core team.                         |
| `requires-changes` | [search][search-veschool-repo-label-requires-changes] | Pull requests which need to be updated based on review comments and then reviewed again.   |
| `needs-testing`    | [search][search-veschool-repo-label-needs-testing]    | Pull requests which need manual testing.                                                   |

[search-veschool-repo-label-enhancement]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Aenhancement
[search-veschool-repo-label-bug]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Abug
[search-veschool-repo-label-question]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Aquestion
[search-veschool-repo-label-feedback]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Afeedback
[search-veschool-repo-label-help-wanted]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Ahelp-wanted
[search-veschool-repo-label-beginner]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Abeginner
[search-veschool-repo-label-more-information-needed]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Amore-information-needed
[search-veschool-repo-label-needs-reproduction]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Aneeds-reproduction
[search-veschool-repo-label-documentation]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Adocumentation
[search-veschool-repo-label-performance]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Aperformance
[search-veschool-repo-label-security]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Asecurity
[search-veschool-repo-label-zainul]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Azainul
[search-veschool-repo-label-titumir]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Atitumir
[search-veschool-repo-label-git]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Agit
[search-veschool-repo-label-blocked]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Ablocked
[search-veschool-repo-label-duplicate]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Aduplicate
[search-veschool-repo-label-wontfix]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Awontfix
[search-veschool-repo-label-invalid]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AKRTirtho%2Fveschool+label%3Ainvalid
[search-veschool-repo-label-work-in-progress]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3AKRTirtho%2Fveschool+label%3Awork-in-progress
[search-veschool-repo-label-needs-review]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3AKRTirtho%2Fveschool+label%3Aneeds-review
[search-veschool-repo-label-under-review]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3AKRTirtho%2Fveschool+label%3Aunder-review
[search-veschool-repo-label-requires-changes]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3AKRTirtho%2Fveschool+label%3Arequires-changes
[search-veschool-repo-label-needs-testing]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3AKRTirtho%2Fveschool+label%3Aneeds-testing
[beginner]: https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3Abeginner+label%3Ahelp-wanted+repo%3AKRTirtho%2Fveschool+sort%3Acomments-desc
[help-wanted]: https://github.com/search?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted+repo%3AKRTirtho%2Fveschool+sort%3Acomments-desc+-label%3Abeginner
[zainul]: https://github.com/KRTirtho/veschool/tree/master/zainul
[titumir]: https://github.com/KRTirtho/veschool/tree/master/titumir

> **Final Note**: Before creating PR/Issue check which **part of the project that belongs** & assign label **zainul (frontend) or titumir (backend)** accordingly