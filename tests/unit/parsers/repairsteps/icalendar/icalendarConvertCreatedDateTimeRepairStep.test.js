/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import AbstractRepairStep from '../../../../../src/parsers/repairsteps/abstractRepairStep.js'
import ICalendarConvertInvalidDateTimeValuesRepairStep from '../../../../../src/parsers/repairsteps/icalendar/icalendarConvertInvalidDateTimeValuesRepairStep.js'

it('The repair step should inherit from AbstractRepairStep', () => {
	expect((new ICalendarConvertInvalidDateTimeValuesRepairStep() instanceof AbstractRepairStep))
		.toBe(true)
})

it('The repair step should have a priority', () => {
	expect(ICalendarConvertInvalidDateTimeValuesRepairStep.priority()).toBe(0)
})

it('The repair step should repair broken calendar data', () => {
	const repairStep = new ICalendarConvertInvalidDateTimeValuesRepairStep()
	const brokenICS = getAsset('invalid-date-time')
	const fixedICS = getAsset('invalid-date-time-sanitized')

	expect(repairStep.repair(brokenICS)).toEqual(fixedICS)
})
