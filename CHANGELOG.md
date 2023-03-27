## [5.0.5](https://github.com/nextcloud/calendar-js/compare/v5.0.4...v5.0.5) (2023-03-27)


### Reverts

* Revert "chore!(deps): Bump uuid from 8.3.2 to 9.0.0" ([2671cda](https://github.com/nextcloud/calendar-js/commit/2671cda40116632555430271f7147330bc64d84c))



## [5.0.4](https://github.com/nextcloud/calendar-js/compare/v5.0.3...v5.0.4) (2023-03-10)


### Bug Fixes

* adjust RRULE count when forking occurrences ([348c829](https://github.com/nextcloud/calendar-js/commit/348c829667c77712ab46a27a54ddf85ab05a0a02))
* tasks may return a nullish reference recurrence id ([5d20f29](https://github.com/nextcloud/calendar-js/commit/5d20f29daed317a74a4338c29d67c9724556563e))



## [5.0.3](https://github.com/nextcloud/calendar-js/compare/v5.0.2...v5.0.3) (2022-12-28)


### Bug Fixes

* **eslint:** Lower case string type ([e3c8de1](https://github.com/nextcloud/calendar-js/commit/e3c8de1c20a679fc27d3e1d84f316216fad27aa0))



## [5.0.2](https://github.com/nextcloud/calendar-js/compare/v5.0.1...v5.0.2) (2022-12-28)


### Bug Fixes

* **jsdoc:** Fix casing of boolean types ([ac1a9b6](https://github.com/nextcloud/calendar-js/commit/ac1a9b6e29785e0f1559a12080154e1dfd506a86))



## [5.0.1](https://github.com/nextcloud/calendar-js/compare/v5.0.0...v5.0.1) (2022-12-28)


### Bug Fixes

* **jsdoc:** Replace [@returns](https://github.com/returns) with [@return](https://github.com/return) ([16b7af7](https://github.com/nextcloud/calendar-js/commit/16b7af7497034d58d94505fb099c0cb973532bba))



# [5.0.0](https://github.com/nextcloud/calendar-js/compare/v4.0.0...v5.0.0) (2022-12-28)


* fix!: Avoid circular dependencies between timezone and timezoneComponent ([8838a8d](https://github.com/nextcloud/calendar-js/commit/8838a8d1a3da8ecb47e7f9b689cc5ce21d3b17b8))


### BREAKING CHANGES

* Removes the Timezone.toTimezoneComponent() method, which is being used in the Calendar App

Instead of ``timezone.toTimezoneComponent()`` you should use
``TimezoneComponent.fromICALJs(timezone.toICALJs())``.

Signed-off-by: Thomas Citharel <tcit@tcit.fr>



# [4.0.0](https://github.com/nextcloud/calendar-js/compare/v3.1.0...v4.0.0) (2022-12-27)


* chore(deps)!: Drop support for Node 14 ([5d9084b](https://github.com/nextcloud/calendar-js/commit/5d9084b2086756b1618656670276479e74264e9f))


### Features

* **release:** Add release automation ([b228312](https://github.com/nextcloud/calendar-js/commit/b22831207f128e7ddadbc4e523631886eb476127))


### BREAKING CHANGES

* package requires Node 16+ now

Signed-off-by: Christoph Wurst <christoph@winzerhof-wurst.at>



## [1.1.1](https://github.com/nextcloud/calendar-js/compare/v1.1.0...v1.1.1) (2021-08-10)



# [1.1.0](https://github.com/nextcloud/calendar-js/compare/v1.0.0...v1.1.0) (2021-07-28)



# 1.0.0 (2021-07-26)



