# :date: @nextcloud/calendar-js - Heart of the [Nextcloud calendar app](https://github.com/nextcloud/calendar)

[![npm](https://img.shields.io/npm/v/%40nextcloud%2Fcalendar-js?style=flat-square)](https://www.npmjs.com/package/@nextcloud/calendar-js) [![Build statis](https://img.shields.io/github/actions/workflow/status/nextcloud/nextcloud-calendar-js/node-test.yml?style=flat-square)](https://github.com/nextcloud/calendar-js/actions/workflows/node-test.yml) [![Codecov branch](https://img.shields.io/codecov/c/gh/nextcloud/calendar-js/main?style=flat-square)](https://codecov.io/gh/nextcloud/calendar-js) 

This library is a wrapper for [ICAL.js](https://github.com/mozilla-comm/ical.js/) that provides more convenient ways for editing.
Together with [cdav-library](https://github.com/nextcloud/cdav-library), it's the heart of the Nextcloud calendar app.

## Maintainers

* [@ChristophWurst](https://github.com/ChristophWurst)
* [@GretaD](https://github.com/GretaD)
* [@st3iny](https://github.com/st3iny)

## Developing

Please take note that this library has been developed solely for the purpose of using it in the Nextcloud calendar app.
Feel free to use it in your project, but don't expect any support / bugfixes / features.

### Setup
```bash
npm ci
```

### Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Releases

This repository follows the concept of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0). A github action workflow automates the release. However, an authorized [maintainer](#maintainers) has to approve the workflow before it can run.

1) Go to https://github.com/nextcloud/calendar-js/actions/workflows/release.yml
2) Click *Run workflow*
   1) Select *Branch: main*
   2) Click *Run workflow*
3) Reload the page
4) Click on the waiting *Release* workflow (yellow clock icon) and approve it if you have permission or ask one of the [maintainers](#maintainers)

## License

Calendar-js is licensed under the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html), version 3 or later. 
