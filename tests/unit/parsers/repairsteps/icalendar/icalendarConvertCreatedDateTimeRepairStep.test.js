/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import AbstractRepairStep from '../../../../../src/parsers/repairsteps/abstractRepairStep.js'
import ICalendarConvertCreatedDateTimeRepairStep from '../../../../../src/parsers/repairsteps/icalendar/icalendarConvertCreatedDateTimeRepairStep.js'

it('The repair step should inherit from AbstractRepairStep', () => {
	expect((new ICalendarConvertCreatedDateTimeRepairStep() instanceof AbstractRepairStep))
		.toBe(true)
})

it('The repair step should have a priority', () => {
	expect(ICalendarConvertCreatedDateTimeRepairStep.priority()).toBe(0)
})

it('The repair step should repair broken calendar data', () => {
	const repairStep = new ICalendarConvertCreatedDateTimeRepairStep()
	const brokenICS = getAsset('created-date-time')
	const fixedICS = getAsset('created-date-time-sanitized')

	expect(repairStep.repair(brokenICS)).toEqual(fixedICS)
})
