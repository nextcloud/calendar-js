/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import AbstractRepairStep from '../abstractRepairStep.js'

export default class ICalendarConvertCreatedDateTimeRepairStep extends AbstractRepairStep {

	/**
	 * Please see the corresponding test files for an example of broken calendar-data
	 *
	 * @inheritDoc
	 */
	repair(ics) {
		return ics
			.replace(/^CREATED:([0-9]+)$/gm, 'CREATED:$1T000000Z')
	}

}
