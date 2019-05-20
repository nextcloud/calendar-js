/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { getConstructorForComponentName } from '../../../../src/components/root';
import AbstractComponent from '../../../../src/components/abstractComponent.js';
import EventComponent from '../../../../src/components/root/eventComponent.js';
import FreeBusyComponent from '../../../../src/components/root/freeBusyComponent.js';
import JournalComponent from '../../../../src/components/root/journalComponent.js';
import TimezoneComponent from '../../../../src/components/root/timezoneComponent.js';
import ToDoComponent from '../../../../src/components/root/toDoComponent.js';

it('should provide a constructor for a given component name', () => {
	expect(getConstructorForComponentName('valarm')).toEqual(AbstractComponent)

	expect(getConstructorForComponentName('vevent')).toEqual(EventComponent)
	expect(getConstructorForComponentName('VEVENT')).toEqual(EventComponent)
	expect(getConstructorForComponentName('vEvEnT')).toEqual(EventComponent)
	expect(getConstructorForComponentName('vfreebusy')).toEqual(FreeBusyComponent)
	expect(getConstructorForComponentName('vjournal')).toEqual(JournalComponent)
	expect(getConstructorForComponentName('vtimezone')).toEqual(TimezoneComponent)
	expect(getConstructorForComponentName('vtodo')).toEqual(ToDoComponent)
	expect(getConstructorForComponentName('vwhatever')).toEqual(AbstractComponent)
})
