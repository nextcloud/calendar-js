/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license AGPL-3.0-or-later
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
import { getConstructorForPropertyName } from '../../../src/properties';
import AttachmentProperty from '../../../src/properties/attachmentProperty.js';
import AttendeeProperty from '../../../src/properties/attendeeProperty.js';
import ConferenceProperty from '../../../src/properties/conferenceProperty.js';
import GeoProperty from '../../../src/properties/geoProperty.js';
import ImageProperty from '../../../src/properties/imageProperty.js';
import RelationProperty from '../../../src/properties/relationProperty.js';
import RequestStatusProperty from '../../../src/properties/requestStatusProperty.js';
import Property from '../../../src/properties/property.js';
import TextProperty from '../../../src/properties/textProperty.js';
import TriggerProperty from '../../../src/properties/triggerProperty.js';
import FreeBusyProperty from '../../../src/properties/freeBusyProperty.js';

it('should provide a function to get the constructor for a certain property name', () => {
	expect(getConstructorForPropertyName('ATTACH')).toEqual(AttachmentProperty)
	expect(getConstructorForPropertyName('attach')).toEqual(AttachmentProperty)

	expect(getConstructorForPropertyName('ATTENDEE')).toEqual(AttendeeProperty)
	expect(getConstructorForPropertyName('ORGANIZER')).toEqual(AttendeeProperty)

	expect(getConstructorForPropertyName('CONFERENCE')).toEqual(ConferenceProperty)

	expect(getConstructorForPropertyName('FREEBUSY')).toEqual(FreeBusyProperty)

	expect(getConstructorForPropertyName('GEO')).toEqual(GeoProperty)

	expect(getConstructorForPropertyName('IMAGE')).toEqual(ImageProperty)

	expect(getConstructorForPropertyName('RELATED-TO')).toEqual(RelationProperty)

	expect(getConstructorForPropertyName('REQUEST-STATUS')).toEqual(RequestStatusProperty)

	expect(getConstructorForPropertyName('TRIGGER')).toEqual(TriggerProperty)

	expect(getConstructorForPropertyName('COMMENT')).toEqual(TextProperty)
	expect(getConstructorForPropertyName('CONTACT')).toEqual(TextProperty)
	expect(getConstructorForPropertyName('DESCRIPTION')).toEqual(TextProperty)
	expect(getConstructorForPropertyName('LOCATION')).toEqual(TextProperty)
	expect(getConstructorForPropertyName('SUMMARY')).toEqual(TextProperty)

	expect(getConstructorForPropertyName('DTSTART')).toEqual(Property)
})
