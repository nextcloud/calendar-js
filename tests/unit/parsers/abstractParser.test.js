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
import AbstractParser from '../../../src/parsers/abstractParser.js';

it('AbstractParser should be defined', () => {
	expect(AbstractParser).toBeDefined()
})

it('AbstractParser should not be instantiable', () => {
	expect(() => {
		new AbstractParser()
	}).toThrow(TypeError, 'Cannot instantiate abstract class AbstractParser')
})

it('AbstractParser should return a name', () => {
	class Foo extends AbstractParser {
		constructor() {
			super()
			super._name = 'Name 123'
		}
	}

	const parser = new Foo()
	expect(parser.getName()).toEqual('Name 123')
	expect(parser.offersWebcalFeed()).toEqual(false)
})

it('AbstractParser should return a color', () => {
	class Foo extends AbstractParser {
		constructor() {
			super()
			super._color = '#ffffff'
		}
	}

	const parser = new Foo()
	expect(parser.getColor()).toEqual('#ffffff')
})

it('AbstractParser should return a sourceURL', () => {
	class Foo extends AbstractParser {
		constructor() {
			super()
			super._sourceURL = 'http://example.com/file.ics'
		}
	}

	const parser = new Foo()
	expect(parser.getSourceURL()).toEqual('http://example.com/file.ics')
	expect(parser.offersWebcalFeed()).toEqual(true)
})

it('AbstractParser should return a refresh interval', () => {
	class Foo extends AbstractParser {
		constructor() {
			super()
			super._refreshInterval = 'P1D'
		}
	}

	const parser = new Foo()
	expect(parser.getRefreshInterval()).toEqual('P1D')
})

it('AbstractParser should return a calendar timezone', () => {
	class Foo extends AbstractParser {
		constructor() {
			super()
			super._calendarTimezone = 'Europe/Berlin'
		}
	}

	const parser = new Foo()
	expect(parser.getCalendarTimezone()).toEqual('Europe/Berlin')
})

it('AbstractParser should not implement the parse method', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	expect(() => {
		parser.parse('')
	}).toThrow(TypeError, 'Abstract method not implemented by subclass')
})

it('AbstractParser should not implement item iterator', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	const iterator = parser.getItemIterator()
	expect(() => {
		iterator.next()
	}).toThrow(TypeError, 'Abstract method not implemented by subclass')
})

it('AbstractParser should provide a method to get a list of all items', () => {
	class Foo extends AbstractParser {

		*getItemIterator() {
			yield 1
			yield 2
			yield 3
		}

	}
	const parser = new Foo()

	expect(parser.getAllItems()).toEqual([1, 2, 3])
})

it('AbstractParser should implement a method to indicate whether parsed data contains events', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	expect(parser.containsVEvents()).toEqual(false)
})

it('AbstractParser should implement a method to indicate whether parsed data contains journals', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	expect(parser.containsVJournals()).toEqual(false)
})

it('AbstractParser should implement a method to indicate whether parsed data contains todos', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	expect(parser.containsVTodos()).toEqual(false)
})

it('AbstractParser should implement a method to indicate whether parsed data contains freebusy', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	expect(parser.containsVFreeBusy()).toEqual(false)
})

it('AbstractParser should provide a method to check if errors occurred', () => {
	class Foo extends AbstractParser {
		incErrorCount() {
			this._errors.push('I\'m an error 1')
			this._errors.push('I\'m an error 2')
			this._errors.push('I\'m an error 3')
		}
	}
	const parser = new Foo()

	expect(parser.hasErrors()).toEqual(false)
	expect(parser.getErrorList()).toEqual([])

	parser.incErrorCount()

	expect(parser.hasErrors()).toEqual(true)
	expect(parser.getErrorList()).toEqual(['I\'m an error 1', 'I\'m an error 2', 'I\'m an error 3'])
})

it('AbstractParser should implement a static method to get supported mimetypes', () => {
	expect(() => {
		AbstractParser.getMimeTypes()
	}).toThrow(TypeError, 'Abstract method not implemented by subclass')
})

it('AbstractParser should return 0 for item count', () => {
	class Foo extends AbstractParser {}
	const parser = new Foo()

	expect(parser.getItemCount()).toEqual(0)
})
